import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('PAGE ERROR:', msg.text());
        }
    });

    page.on('pageerror', error => {
        console.log('UNCAUGHT PAGE ERROR:', error.message);
    });

    try {
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
    } catch (e) {
        console.log('Navigation failed:', e);
    }

    await browser.close();
})();
