const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { roundTo2Decimals } = require('./utils');

const startPCUServer = (port, streetName, ccu) => {
  
  // LOGGING STUFF
  const log4js = require('log4js');
  log4js.configure({
    appenders: { pcuAppender: { type: "file", filename: `PCU-${streetName}.log` } },
    categories: { default: { appenders: ["pcuAppender"], level: "debug" } }
  });

  const logger = log4js.getLogger();

  let polesDictionary = {};

  const logMessage = (message) => {
    logger.debug(JSON.stringify(message));
  };

  const addMessageToPolesDictionary = message => {
    const {
      poleId,
      data,
      data: {
        timeStamp,
      },
    } = message;

    if (
        !polesDictionary[poleId].length ||
        timeStamp >= polesDictionary[poleId][polesDictionary[poleId].length - 1].timeStamp
      ) {
      polesDictionary[poleId].push(data);
    } else {
      polesDictionary[poleId].unshift(data);
    }

    if (polesDictionary[poleId].length > 10) {
      polesDictionary[poleId].shift();
    }

  };

  const addMessageToMicroBatchingActiveQueries = message => {
    const {
      poleId,
      data,
      data: {
        timeStamp,
      },
    } = message;

    if (Object.keys(microBatchQueriesSpecs).length) {

      Object.keys(microBatchQueriesSpecs).forEach(queryId => {

        const storedPoleData = microBatchingQueriesResults[queryId][poleId];

        if (
            !storedPoleData.length ||
            timeStamp >= storedPoleData[storedPoleData.length - 1].timeStamp
          ) {
            microBatchingQueriesResults[queryId][poleId].push(data);
        } else {
          microBatchingQueriesResults[queryId][poleId].unshift(data);
        }

      });

    }

  };

  const app = express();

  // initialize a simple http server
  const server = http.createServer(app);

  // initialize the WebSocket server instance for Pole <-> PCU communication
  const wss = new WebSocket.Server({ server });
  // initialize the WebSocket client instance for PCU <-> CCU communication
  const wsClientCCU = new WebSocket(`ws://${ccu.host}:${ccu.port}`);

  const queriesIntervals = {};
  const microBatchingQueriesResults = {};
  const microBatchQueriesSpecs = {};

  const solveTrafficJamQuery = async (queryId, processingType, timeFrame) => new Promise((resolve, reject) => {
    let nrOfMotionDetectedTrueValues = 0;
    const nrOfPoles = Object.keys(polesDictionary).length;

    if ([undefined, 'native'].includes(processingType)) {
      Object.keys(polesDictionary).forEach(poleId => {
        if (
          polesDictionary[poleId].length &&
          polesDictionary[poleId][polesDictionary[poleId].length - 1].motionDetected
        ) {
          nrOfMotionDetectedTrueValues++;
        }
      });
      return resolve(roundTo2Decimals(nrOfMotionDetectedTrueValues / nrOfPoles));

    } else if (processingType === 'micro-batching') {
      
      // if no timeframe, use polesDictionary 10 values stored data
      if ([0, undefined].includes(timeFrame)) {
        Object.keys(polesDictionary).forEach(poleId => {
          if (polesDictionary[poleId].length) {
            let poleBatchMotionDetectorValues = 0;

            polesDictionary[poleId].forEach(entry => { if (entry.motionDetected) { poleBatchMotionDetectorValues++; } });
            nrOfMotionDetectedTrueValues += (poleBatchMotionDetectorValues / polesDictionary[poleId].length);
          }
        });
        return resolve(roundTo2Decimals(nrOfMotionDetectedTrueValues / nrOfPoles));
      
      } else {
        Object.keys(microBatchingQueriesResults[queryId]).forEach(poleId => {
          const currentPoleData = microBatchingQueriesResults[queryId][poleId];

          if (currentPoleData.length) {
            let poleBatchMotionDetectorValues = 0;

            currentPoleData.forEach(entry => { if (entry.motionDetected) { poleBatchMotionDetectorValues++; } });
            nrOfMotionDetectedTrueValues += (poleBatchMotionDetectorValues / currentPoleData.length);
            microBatchingQueriesResults[queryId][poleId] = [];
          }
        });
        return resolve(roundTo2Decimals(nrOfMotionDetectedTrueValues / nrOfPoles));
      }
    }

  });

  const solveQueryAndSendResult = async (queryId, queryType, processingType, timeFrame) => {
    const result = {
      pcu: streetName,
      queryId,
      queryResult: null
    };

    switch (queryType) {
      case 'traffic-jam':
        result.queryResult = await solveTrafficJamQuery(queryId, processingType, timeFrame);
        break;
    
      default:
        break;
    }

    wsClientCCU.send(JSON.stringify({
      type: 'queryResult',
      message: { result }
    }));

  };

  wsClientCCU.on('open', () => {
    wsClientCCU.send(JSON.stringify({
      pcu: streetName,
      type: 'pcuConnection',
      message: `I am PCU from ${streetName}!`
    }));
  });

  // messages received from ccu
  wsClientCCU.on('message', message => {
    
    const parsedMessage = JSON.parse(message);
    const {
      type,
      message: msg,
      queryId
    } = parsedMessage;

    switch (type) {
      case 'info':
        console.log(`PCU ${streetName} received from CCU: ${msg}`);
        break;
      case 'query':
        microBatchingQueriesResults[queryId] = JSON.parse(JSON.stringify(polesDictionary));
        Object.keys(microBatchingQueriesResults[queryId]).forEach(poleId => microBatchingQueriesResults[queryId][poleId] = []);

        const {
          queryType,
          action,
          timeFrame,
          processingType
        } = msg;

        console.log('query type:', queryType, 'processingType:', processingType, 'timeframe: ', timeFrame, 'action: ', action);
        
        if (action === 'start') {

          if (processingType === 'micro-batching') {
            // to be added also nr of tuples
            microBatchQueriesSpecs[queryId] = { timeFrame };
          }

          const intervalId = setInterval(
            () => solveQueryAndSendResult(queryId, queryType, processingType, timeFrame), timeFrame
          );
          queriesIntervals[queryId] = intervalId; 
        } else if (action === 'stop') {
          clearInterval(queriesIntervals[queryId]);
        }
        break;
      
      default:
        console.log('BAD DATA!');
        break;
    }
  });

  wss.on('connection', socket => {

    // messages received from poles 
    socket.on('message', message => {

      const parsedMessage = JSON.parse(message);
      const {
        type,
        message: msg,
        message: {
          poleId,
        }
      } = parsedMessage;

      switch (type) {
        case 'poleConnection':
          console.log(`PCU ${streetName}: Pole ${poleId} connected!`);
          polesDictionary[poleId] = [];
          break;
        case 'sensorsData':
          // console.log(`PCU ${streetName}: Pole ${parsedMessage.message.poleId} sent: ${JSON.stringify(parsedMessage.message.data)}`);
          addMessageToPolesDictionary(msg);
          // if there is any micro batching query recorded, collect data
          addMessageToMicroBatchingActiveQueries(msg);
          logMessage(msg);
          break;
        default:
          console.log('BAD DATA!');
          break;
      }
    });

    socket.on('close', () => {
      console.log('closed');
    });

    console.log(`PCU ${streetName}: New client connected!`);
  });

  server.listen(port, () => {
    console.log(`PCU server started on port ${port} :)`);
  });

};

module.exports = {
  startPCUServer,
};
