const { startPoleNode } = require("./pole");
const { buildPoleId } = require("./utils");

// TO TAKE CONFIG FROM PCU AT CONNECTION

const [_, __, globalIndexPole, streetName, pcuPort, pcuHost, interval] = process.argv;

// const globalIndexPole = 1;
// const streetName = 'Traian Vuia';
// const pcuPort = 30402;

startPoleNode(
  buildPoleId(globalIndexPole, streetName),
  interval,
  {
    streetName,
    host: pcuHost,
    port: pcuPort,
  }
);
