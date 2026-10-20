import os
import sys
import time
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')
OUT_DIR = r"C:\Users\Thanh\.gemini\antigravity\brain\4827b377-2a37-4680-9110-298ecb95283e\scratch\etf_audits"
os.makedirs(OUT_DIR, exist_ok=True)

tickers = ['HYLD.TO', 'XUS.TO', 'XEQT.TO', 'HMAX.TO']

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 1100})

    for ticker in tickers:
        print(f"Auditing {ticker} on ThanhETF at 127.0.0.1:5173...")
        
        # 1. Overview
        page.goto(f"http://127.0.0.1:5173/#etf/{ticker}/overview", wait_until="networkidle")
        page.wait_for_timeout(1000)
        page.screenshot(path=os.path.join(OUT_DIR, f"{ticker}_thanhetf_overview.png"), full_page=True)
        print(f"Saved {ticker}_thanhetf_overview.png")
        
        # 2. Performance (1Y, then click MAX)
        page.goto(f"http://127.0.0.1:5173/#etf/{ticker}/performance", wait_until="networkidle")
        page.wait_for_timeout(1000)
        page.screenshot(path=os.path.join(OUT_DIR, f"{ticker}_thanhetf_perf_1y.png"), full_page=True)
        print(f"Saved {ticker}_thanhetf_perf_1y.png")
        
        try:
            page.locator("button:text-is('MAX')").click()
            page.wait_for_timeout(600)
            page.screenshot(path=os.path.join(OUT_DIR, f"{ticker}_thanhetf_perf_max.png"), full_page=True)
            print(f"Saved {ticker}_thanhetf_perf_max.png")
        except Exception as e:
            print(f"Error clicking MAX on {ticker}: {e}")
            
        # 3. Holdings
        page.goto(f"http://127.0.0.1:5173/#etf/{ticker}/holdings", wait_until="networkidle")
        page.wait_for_timeout(1000)
        page.screenshot(path=os.path.join(OUT_DIR, f"{ticker}_thanhetf_holdings.png"), full_page=True)
        print(f"Saved {ticker}_thanhetf_holdings.png")
        
        # 4. Income & Tax
        page.goto(f"http://127.0.0.1:5173/#etf/{ticker}/tax", wait_until="networkidle")
        page.wait_for_timeout(1000)
        page.screenshot(path=os.path.join(OUT_DIR, f"{ticker}_thanhetf_tax.png"), full_page=True)
        print(f"Saved {ticker}_thanhetf_tax.png")

    browser.close()
    print("All 4 ETFs audited and screenshotted successfully!")
