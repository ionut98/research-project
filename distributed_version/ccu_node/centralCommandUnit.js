// const http = require('http');
// const WebSocket = require('ws');

const express = require('express');
const server = express();
const wsServer = require('express-ws')(server);
const cors = require('cors');
const { MongoClient } = require('mongodb');

const {
  ccu: {
    mongo: {
      dbConnString,
    }
  }
} = require('./config');

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());

const wsRouter = express.Router();
const router = require('./router.js');

// initialize a simple http server
// const server = http.createServer(app);
const events = require('events');

// initialize the WebSocket server instance
// const wss = new WebSocket.Server({ server });
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

  if (result.length) {
    wsServer.getWss('/query').clients.forEach(client => client.send(
      JSON.stringify({
        type: 'queryResult',
        message: {
          result,
        }
      })
    ));
  }

};

const deleteQuery = queryId => {
  Object.keys(queryResultByPCU.data).forEach(pcu => delete queryResultByPCU.data[pcu][queryId]);
};

// start our server

const startCCUServer = port => {

  wsRouter.ws('/pcu-connection', (ws, req) => {
    // send immediately a feedback to the incoming connection    
    console.log('CCU: New client connected!');

    ws.on('close', () => {
      console.log('closed');
    });

    ws.on('message', message => {

      try {
        const parsedMessage = JSON.parse(message);

        const {
          type,
          message: msg,
          pcu,
        } = parsedMessage;

            // log the received message from pcu and send back the confirmation
            console.log(`CCU received from PCU: ${msg}`);
            ws.send(
              JSON.stringify({
                type: 'info',
                message: 'OK, ready for communication!'
              })
            );

            queryResultByPCU.data[pcu] = {};

            // add the pcu client in clients.pcus list
            // clients.pcus.push(ws);
      }
      catch (error) {
        ws.send('error');
      }
    });

  });

  wsRouter.ws('/query', (ws, req) => {

    ws.on('close', () => {
      console.log('closed');
    });

    ws.on('message', message => {

      try {
        const parsedMessage = JSON.parse(message);

        const {
          message: msg,
        } = parsedMessage;

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
        // clients.users.push(ws);
      
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
        wsServer.getWss('/pcu-connection').clients.forEach(pcuWS => {
          pcuWS.send(
            JSON.stringify(
              { ...parsedMessage, queryId }
            )
          );
        });
        
      }
      catch (error) {
        ws.send('error');
      }
      
    });
  
  });

  wsRouter.ws('/query-result', (ws, req) => {

    ws.on('close', () => {
      console.log('closed');
    });

    ws.on('message', message => {

      try {
        const parsedMessage = JSON.parse(message);
        const {
          message: msg,
        } = parsedMessage;

        const {
          result: {
            queryId,
          },
        } = msg;

        console.log(msg, '<-- msg primit');
        aggregateQueryResult(msg);
        queryResultByPCU.emit('collected-results', queryId);
      
      } catch (error) {
        ws.send('error');
      }

    });

  });

  server.use('/', wsRouter);

  MongoClient.connect(dbConnString, {
      useUnifiedTopology: true,
    }, (err, client) => {
    
      if (err) {
        return console.error(err);
      }
      console.log('Connected to CCU DB');
    
      const db = client.db('ccu');
      server.use(router({db}));
    },
  );

  server.listen(port, () => {
    console.log(`CCU server started on port ${port} :)`);
  });
};

module.exports = {
  startCCUServer,
};
