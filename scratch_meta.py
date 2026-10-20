from bs4 import BeautifulSoup
import json

with open('scout_data/article_bond_etf.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

# Check script tags with ld+json or metadata
for s in soup.find_all('script', type='application/ld+json'):
    print("LD+JSON:", s.string)

for meta in soup.find_all('meta'):
    if meta.get('name') or meta.get('property'):
        print(meta.get('name') or meta.get('property'), ':', meta.get('content'))
