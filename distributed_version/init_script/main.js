const child_process = require('child_process');
const { getNumberOfPolesForStreetLength } = require('./utils');

const {
  ccu: {
    port: ccuPort,
    host: ccuHost
  },
  streets
} = require('../config.json');

const openDirectoryCommand = 'F: & cd "F:\\Master\\MasterAn2Sem2\\proiect cercetare\\executables\\" & ';

let commands = [
  openDirectoryCommand + `start ccu.exe ${ccuPort}`,
];

const runCommand = (command) => setTimeout(() => child_process.exec(command), 500);

const initPCUs = () => {
  streets.forEach((street, index) => {
    const command = openDirectoryCommand + `start pcu.exe `;
    const params = `${ ccuPort + index + 1} "${ street.streetName }" ${ ccuPort } ${ ccuHost }`;
    commands.push(command + params);
  });
};

const initPoles = () => {
  let globalIndexPole = 1;
  streets.forEach((street, streetIndex) => {
    const requiredNrOfPoles = getNumberOfPolesForStreetLength(street.length);
    for (
      let poleIndex = 0;
      poleIndex < requiredNrOfPoles;
      poleIndex++
    ) {
      const command = openDirectoryCommand + `start pole.exe `;
      const params = `${globalIndexPole} "${street.streetName}" ${ccuPort + streetIndex + 1} ${street.pcuHost} ${street.poleInterval}`;
      commands.push(command + params);
      globalIndexPole++;
    }
  });
};

const main = () => {
  
  initPCUs();
  commands.forEach(command => runCommand(command));
  commands = [];
  initPoles();
  commands.forEach(command => setTimeout(() => runCommand(command), 1000));
  
  // commands.forEach(command => console.log(command));
};

// const { getWeatherData } = require("./services/getWeatherService");

// getWeatherData();

main();
