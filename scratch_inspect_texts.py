import sys
sys.stdout.reconfigure(encoding='utf-8')
from bs4 import BeautifulSoup

for t in ['HYLD.TO', 'XUS.TO', 'XEQT.TO']:
    p = f'scout_data/etf_pages/{t}.html'
    with open(p, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    
    print('='*50)
    print(f'TICKER: {t}')
    f_struct = soup.find(id='fund-structure')
    if f_struct:
        print("Fund Structure:", f_struct.get_text(' | ', strip=True)[:200])
    c_sec = soup.find(id='construction')
    if c_sec:
        print("Construction:", c_sec.get_text(' | ', strip=True)[:200])
