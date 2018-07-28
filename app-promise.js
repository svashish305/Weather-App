const yargs = require('yargs');
const axios = require('axios');
const tuc = require('temp-units-conv');

const argv = yargs
  .options({
    a: {
      demand: true,
      alias: 'address',
      describe: 'Address to fetch weather for',
      string: true,
      default: '500032'
    }
  })
  .help()
  .alias('help', 'h')
  .argv;

var encodedAddress = encodeURIComponent(argv.address);
var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

axios.get(geocodeUrl).then((response) => {
  if (response.data.status === 'ZERO_RESULTS') {
    const err = new Error('Unable to find that address.');
    console.error(err.message);
  }

  var lat = response.data.results[0].geometry.location.lat;
  var lng = response.data.results[0].geometry.location.lng;
  var weatherUrl = `https://api.darksky.net/forecast/abd014c7f30d086b8edd62e2051e9cd6/${lat},${lng}`;
  console.log(response.data.results[0].formatted_address);
  return axios.get(weatherUrl);
}).then((response) => {
  var temperature = response.data.currently.temperature;
  var apparentTemperature = response.data.currently.apparentTemperature;
  var tempC = tuc.fahrenheitToCelsius(temperature).toFixed(2);
  var appTempC = tuc.fahrenheitToCelsius(apparentTemperature).toFixed(2);
  var curSummary = response.data.currently.summary;
  var hrsSummary = response.data.hourly.summary;
  var dailySummary = response.data.daily.summary;
  console.log(`It's currently ${temperature} °F i.e. ${tempC} °C. It feels like ${apparentTemperature} °F i.e. ${appTempC} °C.`);
  console.log(`Current Weather : ${curSummary}`);
  console.log(`Today's Forecast : ${hrsSummary}`);
  console.log(`Weekly Forecast: ${dailySummary}`);
}).catch((e) => {
  if (e.code === 'ENOTFOUND') {
    console.log('Unable to connect to API servers.');
  } else {
    console.log(e.messsage);
  }
});
