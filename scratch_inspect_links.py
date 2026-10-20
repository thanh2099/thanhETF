import sys
sys.stdout.reconfigure(encoding='utf-8')
from bs4 import BeautifulSoup

all_links = set()
for t in ['HYLD.TO', 'XUS.TO', 'XEQT.TO', 'HMAX.TO']:
    p = f'scout_data/etf_pages/{t}.html'
    with open(p, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    for a in soup.find_all('a'):
        href = a.get('href', '')
        if href and not href.startswith('http') and not href.startswith('#'):
            all_links.add(href)

print(f"Total unique internal links across 4 target ETFs: {len(all_links)}")
for l in sorted(all_links):
    print("  ", l)
