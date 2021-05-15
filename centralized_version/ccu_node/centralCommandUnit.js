const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// initialize a simple http server
const server = http.createServer(app);
const events = require('events');

// initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });
const clients = {
  pcus: [],
  users: []
};

const queryResultByPCU = new events.EventEmitter();
queryResultByPCU.data = {};

queryResultByPCU.on('collected-results', queryId => {
  
  if (!queryId) {
    return null;
  }

  let incompleteData = false;
  Object.keys(queryResultByPCU.data).forEach(pcu => {
    
    if (incompleteData) {
      return;
    }
    
    if (queryResultByPCU.data[pcu][queryId] === undefined) {
      incompleteData = true;
      return;
    }
  });

  if (!incompleteData) {
    sendQueryResultIfCollectedAllData(queryId);
    Object.keys(queryResultByPCU.data).forEach(pcu => delete queryResultByPCU.data[pcu][queryId]);
  }

});

const queriesIntervals = {};

const aggregateQueryResult = msg => {
  const {
    result: {
      pcu,
      queryId,
      queryResult
    }
  } = msg;

  queryResultByPCU.data[pcu][+queryId] = queryResult;
};

const sendQueryResultIfCollectedAllData = queryId => {
  const result = [];
  Object.keys(queryResultByPCU.data).forEach(pcu => {
    if (queryResultByPCU.data[pcu][queryId] !== undefined) {
      result.push({ pcu, queryId, queryResult: queryResultByPCU.data[pcu][queryId] });
    }
  })

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
  Object.keys(queryResultByPCU.data).forEach(pcu => delete queryResultByPCU.data[pcu][queryId]);
};

wss.on('connection', socket => {

  socket.on('message', message => {

    try {

      const parsedMessage = JSON.parse(message);

      const {
        type,
        message: msg,
        pcu,
      } = parsedMessage;

      switch (type) {
        case 'pcuConnection':
          // log the received message from pcu and send back the confirmation
          console.log(`CCU received from PCU: ${msg}`);
          socket.send(
            JSON.stringify({
              type: 'info',
              message: 'OK, ready for communication!'
            })
          );

          queryResultByPCU.data[pcu] = {};

          // add the pcu client in clients.pcus list
          clients.pcus.push(socket);
          break;
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
            
            if (nrOfTuples === undefined) {
              const intervalId = setInterval(
                () => sendQueryResultIfCollectedAllData(queryId), timeFrame || 1000 // if no timeframe, at least 1 second
              );
              queriesIntervals[queryId] = intervalId;
            }
          
          } else if (action === 'stop') {
            clearInterval(queriesIntervals[queryId]);
            deleteQuery(queryId);
          }

          // broadcast the message received from user
          clients.pcus.forEach(pcuWS => {
            pcuWS.send(
              JSON.stringify(
                { ...parsedMessage, queryId }
              )
            );
          });

          break;
        }
        case 'queryResult':
          const {
            result: {
              queryId,
            },
          } = msg;
          console.log(msg, '<-- msg primit');
          aggregateQueryResult(msg);
          queryResultByPCU.emit('collected-results', queryId);
          break;
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

  // send immediately a feedback to the incoming connection    
  console.log('CCU: New client connected!');
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
