from bs4 import BeautifulSoup
import re

with open('scout_data/article_bond_etf.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

print("Images:")
for img in soup.find_all('img'):
    print(img.get('src'), img.get('alt'))

# Let's search for mentions of tickers in the text
tickers = set(re.findall(r'\b[A-Z]{3,5}(?:\.TO)?\b', html))
print("\nTickers found:", tickers)

# Let's see if there are links to ETFs in the article
for a in soup.find_all('a'):
    href = a.get('href', '')
    if '/etf/' in href or 'decodeetf.com' in href:
        print(a.get_text(strip=True), "->", href)
