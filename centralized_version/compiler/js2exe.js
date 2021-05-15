const { exec } = require('pkg');
exec([
  process.argv[2],
  '--target',
  'host',
  '--output',
  `${process.argv[3]}.exe`
]).then(() => console.log(`Done building ${process.argv[3]}.exe`))
  .catch(console.error);
