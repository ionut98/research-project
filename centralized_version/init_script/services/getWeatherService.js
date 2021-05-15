const { channelWeather } = require('./weatherChannel');
const { weatherParams } = require('../config');

const getWeatherData = async () => {
  
  const result = await channelWeather.get('', {
    params: weatherParams,
  });

  const {
    data,
  } = result;

  const weatherData = data['hourly'].map(
    hourData => ({
      hour: new Date(hourData.dt * 1000).getHours(),
      temperature: hourData.temp,
      visibility: hourData.visibility,
      pressure: hourData.pressure,
      humidity: hourData.humidity,
      windSpeed: hourData.wind_speed
    })
  )

  return weatherData;
};

module.exports = {
  getWeatherData,
};
