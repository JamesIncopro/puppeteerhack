const API_ENDPOINT = 'https://lagler.devicp.eu';
const TOKEN_API = '/sgrapio_api/api-token-auth/';
const PLATFORM_METADATA = '/sgrapio_api/admin_tools/platform_metadata/';
const SCRAPER = 'allegro';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRoZXJ0enNjaCIsInVzZXJfaWQiOjE1ODEsImVtYWlsIjoiZGF2aWQuaGVydHpzY2hAaW5jb3Byb2lwLmNvbSIsImV4cCI6MTU3NDIwNjMyOX0.6yDx78pqtQNRziHcfntCokvsbK3-DFp6ksLJIktLfQY';

var retrieve = require('./retrieve.js')

const run = async function(scraper_id){
    retrieve.getConfig(SCRAPER, function(result){
        console.log(result);
    });
    
    await retrieve.getFormatString(SCRAPER, function(result){
        console.log(result);
    });
};

run();