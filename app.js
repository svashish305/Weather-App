const yargs = require('yargs');

const geocode = require('./geocode/geocode');
const weather = require('./weather/weather');

const argv = yargs
  .options({
    a: {
      demand: true,
      alias: 'address',
      describe: 'Address to fetch weather for',
      string: true
    }
  })
  .help()
  .alias('help', 'h')
  .argv;

geocode.geocodeAddress(argv.address, (errorMessage, results) => {
  if (errorMessage) {
    console.log(errorMessage);
  } else {
    console.log(JSON.stringify(results, undefined, 2));
  }
});

 // console.log(argv);
 // console.log(`${argv.address}`);
 // abd014c7f30d086b8edd62e2051e9cd6
 // https://api.darksky.net/forecast/abd014c7f30d086b8edd62e2051e9cd6/17.4358411,78.3467857
