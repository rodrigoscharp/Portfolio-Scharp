// Usage: NODE_PATH=<npx-cache>/node_modules node scripts/verify-shot.mjs <url> <out.png> [width] [selector]
import { chromium } from 'playwright';

const [url, out, width = '1440', selector] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: parseInt(width), height: 900 } });
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push(String(e)));
await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }).catch(e => console.log('goto:', e.message));
if (selector) { await page.locator(selector).scrollIntoViewIfNeeded(); }
await page.waitForTimeout(800);
await page.screenshot({ path: out });
await browser.close();
console.log('saved', out);
if (errors.length) { console.log('CONSOLE ERRORS:\n' + errors.join('\n')); process.exit(1); }
console.log('no console errors');
