const { startCCUServer } = require("./centralCommandUnit");
const { startPoleNode } = require("./pole");
const { startPCUServer } = require("./polesCommandUnit");
const { getNumberOfPolesForStreetLength, buildPoleId } = require("./utils");
const {
  streets,
  ccu,
} = require('./config');

const { getWeatherData } = require("./services/getWeatherService");

getWeatherData();

// startCCUServer(ccu.port);

// let globalIndexPole = 1;
// for (let indexStreet = 1; indexStreet <= streets.length; indexStreet++) {
  
//   const { streetName, length } = streets[indexStreet - 1];
//   startPCUServer(ccu.port + indexStreet, streetName, ccu);
//   const currentGlobalIndexPole = globalIndexPole;

//   for (
//     ;
//     globalIndexPole < currentGlobalIndexPole + getNumberOfPolesForStreetLength(length);
//     globalIndexPole++
//   ) {
    
//     startPoleNode(
//       buildPoleId(globalIndexPole, streetName),
//       3000,
//       {
//         streetName,
//         host: 'localhost',
//         port: ccu.port + indexStreet,
//       });
    
//   }

// }
