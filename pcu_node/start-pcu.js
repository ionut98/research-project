const { startPCUServer } = require("./polesCommandUnit");

const [_, __, pcuPort, streetName, port, host] = process.argv;

const ccu = {
  port: port,
  host: host
};

startPCUServer(pcuPort, streetName, ccu);
