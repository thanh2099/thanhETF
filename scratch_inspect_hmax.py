import sys
sys.stdout.reconfigure(encoding='utf-8')
from bs4 import BeautifulSoup

path = 'scout_data/etf_pages/HMAX.TO.html'
with open(path, 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

fund_struct = soup.find(id='fund-structure')
if fund_struct:
    print("=== HMAX FUND STRUCTURE ===")
    print(fund_struct.get_text('\n', strip=True))

const_sec = soup.find(id='construction')
if const_sec:
    print("=== HMAX CONSTRUCTION ===")
    print(const_sec.get_text('\n', strip=True))
