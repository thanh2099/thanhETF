import sys
sys.stdout.reconfigure(encoding='utf-8')
from bs4 import BeautifulSoup

for t in ['XUS.TO', 'XEQT.TO', 'HYLD.TO', 'HMAX.TO']:
    p = f'scout_data/etf_pages/{t}.html'
    with open(p, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    h_sec = soup.find(id='holdings')
    if h_sec:
        print(f"=== {t} HOLDINGS TEXT ===")
        print(h_sec.get_text('\n', strip=True)[:1500])
