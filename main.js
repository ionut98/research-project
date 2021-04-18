const { startCCUServer } = require("./centralCommandUnit");
const { startPoleServer } = require("./pole");
const { startPCUServer } = require("./polesCommandUnit");

const PORT = 30401;
const STREETS_NUMBER = 5;

startCCUServer(PORT);

// to be added street length

for (let indexStreet = 1; indexStreet <= STREETS_NUMBER; indexStreet++) {
  
  const currentStreetIndex = indexStreet + 10 * indexStreet;
  startPCUServer(PORT + currentStreetIndex);

  for (let indexPole = 1; indexPole <= 10; indexPole++) {
    
    const currentPoleIndex = currentStreetIndex + indexPole;
    startPoleServer(PORT + currentPoleIndex);
    
  }

}