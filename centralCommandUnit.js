const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on('connection', (socket, req) => {

    //connection is up, let's add a simple simple event
    socket.on('message', (message) => {

      //log the received message and send it back to the client
      console.log('received: %s', message);
      socket.send(`Hello, you sent -> ${message}`);
    });

    socket.on('close', () => {
      console.log('closed');
    });
  
    //send immediatly a feedback to the incoming connection    
    socket.send(`You are client ${req.connection.remoteAddress}`);
});

//start our server
const startCCUServer = () => {
  server.listen(process.env.PORT || 30401, () => {
    console.log(`Server started on port ${server.address().port} :)`);
  });
};

module.exports = {
  startCCUServer,
};
