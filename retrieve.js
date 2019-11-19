const request = require('request');

module.exports = function(scraper, callback) {
    const CONFIG_PATH = 'https://lagler.devicp.eu/sgrapio_api/scraper_config/'
    request(CONFIG_PATH + scraper, { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        callback(null, body);
    });
};

