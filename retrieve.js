var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = function(url) {
    var request = new XMLHttpRequest();
    
    request.open("GET", url);
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            var scraper_config = JSON.parse(this.responseText)
            return scraper_config;
        }
    }
    request.send(null);
};

