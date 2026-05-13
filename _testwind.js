const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const windLogs = [];
  page.on('console', msg => {
    const t = msg.text();
    if (t.includes('WIND') || t.includes('wind')) windLogs.push(t);
  });
  page.on('pageerror', err => windLogs.push('ERR: ' + err.message));
  
  // Inject a log into the wind sequencer
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForTimeout(8000);
  
  // Inject wind trigger log
  await page.evaluate(() => {
    // Access the module's internals isn't possible from outside an IIFE
    // Instead, let's just see if the page is alive
    return 'ok';
  });

  console.log('Wind logs:', windLogs.length > 0 ? windLogs.join('\n') : 'none');
  await browser.close();
})();
