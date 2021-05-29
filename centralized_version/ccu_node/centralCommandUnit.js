const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { roundTo2Decimals } = require('./utils');

const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// initialize a simple http server
const server = http.createServer(app);
const events = require('events');

// initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });
const clients = {
  poles: [],
  users: []
};

// LOGGING STUFF
const log4js = require('log4js');
log4js.configure({
  appenders: { ccuAppender: { type: "file", filename: `CCU.log` } },
  categories: { default: { appenders: ["ccuAppender"], level: "debug" } }
});

const logger = log4js.getLogger();

/**
 * {
 *  queryId1: {
 *    streetName1: {
 *      poleId1: [],
 *      poleId2: [],
 *      poleId3: [],
 *        ...
 *    },
 *    streetName2: {
 *      poleId1: [],
 *      poleId2: [],
 *      poleId3: [],
 *        ...
 *    }
 *  },
 *  queryId2: {
 *    ...
 *  }
 * }
 */

let dataObject = new events.EventEmitter();
dataObject.data = {'-1': {}}; // described above

const checkIfRequiredNrOfTuples = queryId => {
  let isAllData = true;
  
  Object.keys(dataObject.data[queryId]).forEach(street => {
    if (!isAllData) {
      return;
    }

    Object.keys(dataObject.data[queryId][street]).forEach(pole => {
      if (dataObject.data[queryId][street][pole].length < queriesSpecs[queryId].nrOfTuples) {
        isAllData = false;
      }
    });

  });

  return isAllData;
};

dataObject.on('collect-data', (queryId, queryType, processingType) => {
  console.log(dataObject.data[queryId], 'actual data in dataObject');
  if(checkIfRequiredNrOfTuples(queryId)) {
    sendQueryResultIfCollectedAllData(queryId, queryType, processingType);
  }
});

const logMessage = (message) => {
  logger.debug(JSON.stringify(message));
};

const addMessageToDataObject = message => {
  const {
    streetName,
    poleId,
    data,
    data: {
      timeStamp,
    },
  } = message;

  Object.keys(dataObject.data).forEach(queryId => {
    
    if (!dataObject.data[queryId][streetName]) {
      dataObject.data[queryId][streetName] = {};
    }

    if (!dataObject.data[queryId][streetName][poleId]) {
      dataObject.data[queryId][streetName][poleId] = [];
    }

    const poleData = dataObject.data[queryId][streetName][poleId];

    if (
      !poleData.length ||
      timeStamp >= poleData[poleData.length - 1].timeStamp
    ) {
      poleData.push(data);
    } else {
      poleData.unshift(data);
    }
    
    if (
      queriesSpecs[queryId] &&
      queriesSpecs[queryId].processingType === 'micro-batching' &&
      queriesSpecs[queryId].nrOfTuples !== undefined 
    ) {
      dataObject.emit('collect-data', queryId, queriesSpecs[queryId].queryType, queriesSpecs[queryId].processingType);
    }

    if (`${queryId}` === '-1' || [undefined, null, 'native'].includes(queriesSpecs[queryId].processingType)) {
      if (poleData.length > 10) { // storing locally last 10 values 
        poleData.shift();
      }
    }

  });

};

const queriesIntervals = {};
const queriesSpecs = {};

// for each poleId 
const aggregatePolesDataByQueryId = (queryId, queryType, processingType) => {
  const result = [];

  if (dataObject.data[queryId]) {

    Object.keys(dataObject.data[queryId]).forEach(streetName => {

      const polesAggResults = [];

      if (queryType === 'traffic-jam') {

        Object.keys(dataObject.data[queryId][streetName]).forEach(poleId => {
          
          let poleData = dataObject.data[queryId][streetName][poleId];
          
          if (poleData.length) {
            if (processingType === 'micro-batching' && queriesSpecs[queryId].nrOfTuples !== undefined) {
              const nrOfTuples = queriesSpecs[queryId].nrOfTuples;

              if (poleData.length >= nrOfTuples) {

                const poleSum = (poleData.splice(0, nrOfTuples).reduce(
                  (sum, poleData) => sum + +poleData.motionDetected, 0
                ));

                const average = roundTo2Decimals(poleSum / nrOfTuples);
                polesAggResults.push(average);
                
              }
            }
            
            else if (processingType === 'micro-batching' && queriesSpecs[queryId].timeFrame !== undefined) {

              const poleSum = (poleData.reduce(
                (sum, poleData) => sum + +poleData.motionDetected, 0
              ));

              const average = roundTo2Decimals(poleSum / poleData.length);
              polesAggResults.push(average);
              
              dataObject.data[queryId][streetName][poleId] = [];
            }

            else if (['native', undefined, null].includes(processingType)) {
              polesAggResults.push(+poleData[poleData.length - 1].motionDetected);
            }

          } 

        });

        const streetSum = polesAggResults.reduce(
          (sum, poleAvg) => sum + +poleAvg, 0
        );

        const streetAverage = roundTo2Decimals(streetSum / Object.keys(dataObject.data[queryId][streetName]).length);
        result.push({ streetName, queryId, queryResult: streetAverage });
      }
    });
  }
  return result;
};

const sendQueryResultIfCollectedAllData = (queryId, queryType, processingType) => {

  const result = aggregatePolesDataByQueryId(queryId, queryType, processingType);

  clients.users[0].send(
    JSON.stringify({
      type: 'queryResult',
      message: {
        result,
      }
    })
  );

};

const deleteQuery = queryId => {
  delete dataObject.data[queryId];
  delete queriesSpecs[queryId];
};

const checkIfAnyMBQuery = () => {
  return Object.keys(queriesSpecs)
    .filter(queryId =>
      queriesSpecs[queryId].processingType === 'micro-batching'
    )
    .length > 0;
};

wss.on('connection', socket => {

  console.log('New client connected!');

  socket.on('message', message => {

    try {

      const parsedMessage = JSON.parse(message);

      const {
        type,
        message: msg,
        message: {
          poleId,
        },
      } = parsedMessage;

      switch (type) {
        case 'poleConnection':
          console.log(`CCU: Pole ${poleId} connected!`);
          break;
        case 'sensorsData':
          addMessageToDataObject(msg);
          logMessage(msg);
          break;
        /**
         * query message type
         *  {
         * {
            type,
            message: {
              queryType,
              action,
              timeFrame,
              queryId,
              nrOfTuples
            },
         * }
         */
        case 'query': {

          const {
            queryType,
            action,
            timeFrame,
            queryId,
            nrOfTuples,
            processingType
          } = msg;

          // log the received query type from user and send back the result
          console.log(`CCU received query ${queryId} from user: ${queryType} with action ${action}`);
          // add the user client in clients.users list
          clients.users.push(socket);
        
          if (action === 'start') {
          
            dataObject.data[queryId] = {};
            queriesSpecs[queryId] = { timeFrame, nrOfTuples, processingType, queryType };

            if (
              ['native', undefined, null].includes(processingType) ||
              (processingType === 'micro-batching' && nrOfTuples === undefined)
            ) {
              const intervalId = setInterval(
                () => sendQueryResultIfCollectedAllData(queryId, queryType, processingType), timeFrame || 1000 // if no timeframe, at least 1 second
              );
              queriesIntervals[queryId] = intervalId;
            }

          } else if (action === 'stop') {
            clearInterval(queriesIntervals[queryId]);
            deleteQuery(queryId);
          }

          break;
        }
        default:
          console.log('BAD DATA!');
          break;
      }
    }
    catch (error) {
      console.log(error);
      socket.send('error');
    }
  });

  socket.on('close', () => {
    console.log('closed');
  });

});

// start our server
const startCCUServer = port => {
  server.listen(port, () => {
    console.log(`CCU server started on port ${server.address().port} :)`);
  });
};

module.exports = {
  startCCUServer,
};
