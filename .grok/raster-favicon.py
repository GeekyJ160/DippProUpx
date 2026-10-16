from pathlib import Path
from playwright.sync_api import sync_playwright

svg = Path("/workspace/public/favicon.svg").read_text()
svg16 = svg.replace("<svg", '<svg width="16" height="16"', 1)
svg32 = svg.replace("<svg", '<svg width="32" height="32"', 1)
svg128 = svg.replace("<svg", '<svg width="128" height="128"', 1)
html = (
    '<!doctype html><html><body style="margin:0;background:#111">'
    f'<div id="i16" style="width:16px;height:16px">{svg16}</div>'
    f'<div id="i32" style="width:32px;height:32px;margin-top:8px">{svg32}</div>'
    f'<div id="i128" style="width:128px;height:128px;margin-top:8px">{svg128}</div>'
    "</body></html>"
)
path = Path("/workspace/.grok/favicon-preview.html")
path.write_text(html)
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 200, "height": 220})
    page.goto(path.as_uri())
    page.locator("#i16").screenshot(path="/workspace/.grok/favicon-16.png")
    page.locator("#i32").screenshot(path="/workspace/.grok/favicon-32.png")
    page.locator("#i128").screenshot(path="/workspace/.grok/favicon-128.png")
    browser.close()
print("rasterized")
