const WebSocket = require('ws');
const { randomValueBetweenValues } = require('./utils');

const startPoleNode = (poleId, interval, pcu) => {

  // initialize the WebSocket client instance for CCU <-> PCU communication
  const wsClientCCU = new WebSocket(`ws://${pcu.host}:${pcu.port}`);

  let intervalID = null;

  const sendSensorsData = () => {
    wsClientCCU.send(

      JSON.stringify({
        type: 'sensorsData',
        message: {
          poleId,
          data: {
            timeStamp: new Date().getTime(),
            light: randomValueBetweenValues(0, 10), // sunlight
            temperature: randomValueBetweenValues(-25, 40),
            humidity: randomValueBetweenValues(0, 100),
            intensity: randomValueBetweenValues(0, 100), // percent of current electricity
            motionDetected: Boolean(randomValueBetweenValues(0, 1))
          }
        }
      })

    );
  };

  wsClientCCU.on('open', () => {
    
    wsClientCCU.send(
    
      JSON.stringify({
        type: 'poleConnection',
        message: {
          poleId         
        }
      })
    
    );

    intervalID = setInterval(sendSensorsData, interval);
  
  });

  wsClientCCU.on('message', message => {
    console.log(`Pole #${poleId} received from PCU ${pcu.streetName}: ${message}`);
  });

  wsClientCCU.on('close', () => {
    clearInterval(intervalID);
  });

};

module.exports = {
  startPoleNode,
};
