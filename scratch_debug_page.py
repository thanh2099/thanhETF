import sys
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 1100})
    
    page.goto("http://localhost:5173/#etf/HYLD.TO/performance", wait_until="networkidle")
    page.wait_for_timeout(1000)
    
    print("Page URL:", page.url)
    print("Page Title:", page.title())
    
    # Check what text is visible on the page
    headings = page.locator("h1, h2, h3").all_text_contents()
    print("Headings:", headings)
    
    buttons = page.locator("button").all_text_contents()
    print("Buttons found:", buttons[:20])
    
    browser.close()
