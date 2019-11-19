const request = require('request');

const API_ENDPOINT = 'https://lagler.devicp.eu';
const TOKEN_API = '/sgrapio_api/api-token-auth/';
const PLATFORM_METADATA = '/sgrapio_api/admin_tools/platform_metadata/';
const SCRAPER = 'allegro';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRoZXJ0enNjaCIsInVzZXJfaWQiOjE1ODEsImVtYWlsIjoiZGF2aWQuaGVydHpzY2hAaW5jb3Byb2lwLmNvbSIsImV4cCI6MTU3NDIwNjMyOX0.6yDx78pqtQNRziHcfntCokvsbK3-DFp6ksLJIktLfQY';

module.exports = {}

module.exports.getConfig = function(scraper, callback) {
    const CONFIG_PATH = 'https://lagler.devicp.eu/sgrapio_api/scraper_config/'
    console.log("Fetching config");
    request(CONFIG_PATH + scraper, { json: true }, (err, res, body) => {
        if (err) { callback(err, body); }
        //callback(null, body);
        console.log("Callback is");
        console.log(callback);
        callback(body);
    });
};


// var getConfig = require('./retrieve.js')

// getConfig(SCRAPER, getScraperSettings);

// function handleMetadata (error, response, body) {
//     if (!error && response.statusCode == 200) {
//         var metadata = JSON.parse(body)
//         console.log(metadata['format_string'])
//     } else {
//         console.log(error, response.statusCode);
//         //console.log(body);
//     }
// }

module.exports.getFormatString = function(scraper_id, done) {
    console.log("fetch format");
    getToken(function(token){

        var options = {
            url: API_ENDPOINT + PLATFORM_METADATA + SCRAPER,
            headers: {
                'Authorization': 'JWT ' + token,
                'Content-Type': 'application/json'
            }
        }

        request(options, function(error, repsonse, body){
            console.log(done);
            var metadata = JSON.parse(body)
            done(metadata['format_string']);
        });
    });
};


const getToken = function(callback) {
    request.post(
    API_ENDPOINT + TOKEN_API,
    {
        json: {
            'username': 'puppeteer',
            'password': 'Incopro_000'
        }
    },
    function(error, repsonse, body){
        if (error){
            console.log(error);
        }else{
            callback(body.token);
        }
    }
)};



