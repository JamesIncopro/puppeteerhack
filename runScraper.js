const allegro = require('./allegro.json');
const async = require('async');
const puppeteer = require('puppeteer');
const retrieve = require('./retrieve.js');
const MongoClient = require('mongodb').MongoClient;
  // Set up the connection to the local db

var exports = module.exports = {};
var amqp = require('amqplib/callback_api');

const indexScrape = async function(page, url, payload, callback) {
  //await page.goto('https://allegro.pl/listing?string=iphone&bmatch=baseline-cl-dict42-ele-1-5-1024');
  console.log(url);
  await page.goto(url);
  try{
    await page.addScriptTag({path: './bundle.js'});
    const wait = await page.evaluate(config => {
        return window.parseScrapeInstruction("getItemUrls", config, {});
    }, payload);
    const itemUrls = await page.evaluate( () => {
       return window.results;
    });
    console.log(itemUrls["item_urls"]);
    callback(itemUrls["item_urls"]);
  }
  catch(error){
    console.log(error);
  } 
};

const itemScrapes = async function(page, items, config, save){

  async.forEachOfSeries(items, async function(item, index, callback){
    console.log("going to " + item + " index is " + index)

    const randomPath = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); 
    const rPath = `images/${randomPath}.png`
    await page.screenshot({path: rPath});
    await page.goto(item);
    await page.addScriptTag({path: './bundle.js'});
    
    const wait = await page.evaluate(payload => {
      return window.parseScrapeInstruction("getItemDetails", payload, {});
    }, config);
    
    const itemResult = await page.evaluate( () => {
      return window.results;
    }); 
    console.log(itemResult);
    console.log(callback);
    save(itemResult);
  });
};

const saveScrape = function(item, done){
  MongoClient.connect("mongodb://localhost:27017/", function(err, client){
    var db = client.db("data");
    db.collection('items').insertOne(item, function(err, result) {
      client.close();
      console.log(done)
    });
  });
}

const getConfigData = function(scraperId, callback){
 retrieve.getConfig(scraperId, function(config){
   retrieve.getFormatString(scraperId, function(formatString){
     formatString = formatString.replace("{PTYPE}", "");
     formatString = formatString.replace("{PNAME}", "");
     formatString = formatString.replace("{MODIFIER}", "");
     formatString = formatString.replace("{BRAND}", "iphone");
     formatString = formatString.replace("{NUM}", "1");
     callback(config, formatString);
   });
 })
};

module.run = async function(){
  const browser = await puppeteer.launch();
  const page = await browser.newPage(); 

  console.log("running"); 
  amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function(error, channel) {
      if (error) {
        console.log("Error with creating channel");
        throw error;
      }
      var queue = 'scrapes';

      channel.assertQueue(queue, {
        durable: false
      });
      
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
      
      channel.consume(queue, function(msg) {
        const scraperId = msg.content.toString();
        console.log(` [x] Received  ${scraperId}`);
        getConfigData(scraperId, function(config, formatString){
          console.log(config);
          console.log(formatString);
          indexScrape(page, formatString, config, function(items){
            itemScrapes(page, items, allegro, saveScrape)
          })
        })
      }), {
        noAck: true
      }});
    });
  };


module.run();
