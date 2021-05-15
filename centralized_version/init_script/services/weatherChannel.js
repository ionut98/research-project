const axios = require('axios').default;

const channelWeather = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5/onecall',
  timeout: 10000,
});

channelWeather.interceptors.response.use(
  (response) => {
    return response;
  }, 
  (error) => {
    return {
      success: false,
    };
  }
);

module.exports = {
  channelWeather,
};
