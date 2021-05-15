const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { roundTo2Decimals } = require('./utils');

const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// initialize a simple http server
const server = http.createServer(app);
// const events = require('events');

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

let dataObject = {'-1': {}}; // described above

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

  Object.keys(dataObject).forEach(queryId => {
    
    if (!dataObject[queryId][streetName]) {
      dataObject[queryId][streetName] = {};
    }

    if (!dataObject[queryId][streetName][poleId]) {
      dataObject[queryId][streetName][poleId] = [];
    }

    const poleData = dataObject[queryId][streetName][poleId];

    if (
      !poleData.length ||
      timeStamp >= poleData[poleData.length - 1].timeStamp
    ) {
      poleData.push(data);
    } else {
      poleData.unshift(data);
    }

    if (poleData.length > 10) {
      poleData.shift();
    }

  });

};

const queriesIntervals = {};

// for each poleId 
const aggregatePolesDataByQueryId = (queryId, queryType) => {
  const result = [];

  if (dataObject[queryId]) {

    Object.keys(dataObject[queryId]).forEach(streetName => {

      const polesAggResults = [];

      if (queryType === 'traffic-jam') {

        Object.keys(dataObject[queryId][streetName]).forEach(poleId => {

          const poleData = dataObject[queryId][streetName][poleId];

          if (poleData.length) {
            const poleSum = (poleData.reduce(
              (sum, poleData) => sum + +poleData.motionDetected, 0
            ));
            const average = roundTo2Decimals(poleSum / poleData.length);
            polesAggResults.push(average);
          }

        });

        const streetSum = polesAggResults.reduce(
          (sum, poleAvg) => sum + +poleAvg, 0
        );

        const streetAverage = roundTo2Decimals(streetSum / Object.keys(dataObject[queryId][streetName]).length);
        result.push({ streetName, queryId, queryResult: streetAverage });
      }
    });
  }
  return result;
};

const sendQueryResultIfCollectedAllData = (queryId, queryType) => {

  const result = aggregatePolesDataByQueryId(queryId, queryType);

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
  delete dataObject[queryId];
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
            nrOfTuples
          } = msg;

          // log the received query type from user and send back the result
          console.log(`CCU received query ${queryId} from user: ${queryType} with action ${action}`);
          // add the user client in clients.users list
          clients.users.push(socket);
        
          if (action === 'start') {
          
            dataObject[queryId] = {};

            if (nrOfTuples === undefined) {
              const intervalId = setInterval(
                () => sendQueryResultIfCollectedAllData(queryId, queryType), timeFrame || 1000 // if no timeframe, at least 1 second
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
