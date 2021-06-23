module.exports = {
  streets: [
    {
      streetName: 'Traian Vuia',
      length: 100,
    },
    {
      streetName: 'Calugareni',
      length: 50,
    },
    {
      streetName: 'George Cosbuc',
      length: 300,
    },
  ],
  ccu: {
    port: 30401,
    host: 'localhost',
    mongo: {
      dbConnString: 'mongodb://localhost:27017/ccu'
    }
  },
  weatherParams: {
    lat: '45.443921003588585',
    lon: '28.02725864361724',
    exclude: 'minutely,daily,alerts',
    appid: '1c3c776488ac09378e23f64fbcb7b325',
    units: 'metric',
  }
};
