import { readFileSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";

const svg = readFileSync("/workspace/public/favicon.svg", "utf8");
const wrap = (size) => svg.replace("<svg", `<svg width="${size}" height="${size}"`);
const html = `<!doctype html><html><body style="margin:0;background:#111">
<div id="i16" style="width:16px;height:16px">${wrap(16)}</div>
<div id="i32" style="width:32px;height:32px;margin-top:8px">${wrap(32)}</div>
<div id="i128" style="width:128px;height:128px;margin-top:8px">${wrap(128)}</div>
</body></html>`;
const htmlPath = "/workspace/.grok/favicon-preview.html";
writeFileSync(htmlPath, html);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 200, height: 220 } });
await page.goto(pathToFileURL(htmlPath).href);
await page.locator("#i16").screenshot({ path: "/workspace/.grok/favicon-16.png" });
await page.locator("#i32").screenshot({ path: "/workspace/.grok/favicon-32.png" });
await page.locator("#i128").screenshot({ path: "/workspace/.grok/favicon-128.png" });
await browser.close();
console.log("rasterized");
