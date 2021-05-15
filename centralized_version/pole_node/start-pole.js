const { startPoleNode } = require("./pole");
const { buildPoleId } = require("./utils");

const [_, __, globalIndexPole, streetName, ccuPort, ccuHost, interval] = process.argv;

// const globalIndexPole = 1;
// const streetName = 'Traian Vuia';
// const pcuPort = 30402;

startPoleNode(
  buildPoleId(globalIndexPole, streetName),
  streetName,
  interval,
  {
    streetName,
    host: ccuHost,
    port: ccuPort,
  }
);
