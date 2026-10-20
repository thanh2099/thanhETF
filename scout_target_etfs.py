import os
import sys
import time
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

os.makedirs('scout_data/etf_pages', exist_ok=True)
tickers = ['HYLD.TO', 'XUS.TO', 'XEQT.TO', 'HMAX.TO']

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={'width': 1440, 'height': 1200},
        user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )
    page = context.new_page()

    for ticker in tickers:
        url = f'https://decodeetf.com/etf/{ticker}'
        print(f'Fetching {url}...')
        try:
            resp = page.goto(url, timeout=30000, wait_until='networkidle')
            status = resp.status if resp else "None"
            print(f'{ticker} status: {status}')
            page.wait_for_timeout(2000)
            
            # Save screenshot
            png_path = f'scout_data/etf_pages/{ticker}.png'
            page.screenshot(path=png_path, full_page=True)
            print(f'Saved screenshot {png_path}')
            
            # Save HTML
            html_path = f'scout_data/etf_pages/{ticker}.html'
            with open(html_path, 'w', encoding='utf-8') as f:
                f.write(page.content())
            print(f'Saved HTML {html_path}')
        except Exception as e:
            print(f'Error fetching {ticker}: {e}')

    browser.close()
print('Scouting complete!')
