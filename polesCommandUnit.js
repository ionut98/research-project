const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const startPCUServer = (port, streetName, ccu) => {
  
  // LOGGING STUFF
  const log4js = require('log4js');
  log4js.configure({
    appenders: { pcuAppender: { type: "file", filename: `PCU-${streetName}.log` } },
    categories: { default: { appenders: ["pcuAppender"], level: "debug" } }
  });

  const logger = log4js.getLogger();

  const messagesQueue = [];

  const printMessagesQueue = () => {
    messagesQueue.forEach(message => {
      logger.debug(JSON.stringify(message));
    });
  };

  const addMessageToQueue = message => {
    const {
      data: {
        timeStamp,
      },
    } = message;

    if (
        !messagesQueue.length ||
        timeStamp >= messagesQueue[messagesQueue.length - 1].data.timeStamp
      ) {
      messagesQueue.push(message);
      return;
    }

    messagesQueue.unshift(message);
  };

  const app = express();

  // initialize a simple http server
  const server = http.createServer(app);

  // initialize the WebSocket server instance for Pole <-> PCU communication
  const wss = new WebSocket.Server({ server });
  // initialize the WebSocket client instance for PCU <-> CCU communication
  const wsClientCCU = new WebSocket(`ws://${ccu.host}:${ccu.port}`);

  wsClientCCU.on('open', () => {
    wsClientCCU.send(`I am PCU from ${streetName}!`);
  });

  wsClientCCU.on('message', message => {
    console.log(`PCU ${streetName} received from CCU: ${message}`);
  });

  wss.on('connection', socket => {

    socket.on('message', message => {

      const parsedMessage = JSON.parse(message);

      switch (parsedMessage.type) {
        case 'info':
          console.log(`PCU ${streetName}: Pole ${parsedMessage.message.poleId} connected!`);
          break;
        case 'sensorsData':
          // console.log(`PCU ${streetName}: Pole ${parsedMessage.message.poleId} sent: ${JSON.stringify(parsedMessage.message.data)}`);
          addMessageToQueue(parsedMessage.message);
          console.log(`PCU ${streetName}: `);
          printMessagesQueue();
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
