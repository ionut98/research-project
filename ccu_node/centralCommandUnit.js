const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on('connection', socket => {

  //connection is up, let's add a simple simple event
  socket.on('message', message => {

    //log the received message and send it back to the client
    console.log(`CCU received from PCU: ${message}`);
    socket.send(`OK, ready for communication!`);
  });

  socket.on('close', () => {
    console.log('closed');
  });

  //send immediatly a feedback to the incoming connection    
  console.log('CCU: New PCU connected!');
});

//start our server
const startCCUServer = port => {
  server.listen(port, () => {
    console.log(`CCU server started on port ${server.address().port} :)`);
  });
};

module.exports = {
  startCCUServer,
};
