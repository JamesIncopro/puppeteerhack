const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://lagler.devicp.eu/sgrapio_api/test_pages/basic');
  await page.screenshot({path: 'example.png'});
  
const prices = await page.evaluate(
    () => document.querySelector('div.priceContainer')
  );  
  

  
  console.log(textOfFirstDiv)
  
  await browser.close();
})();