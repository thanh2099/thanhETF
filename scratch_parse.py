from bs4 import BeautifulSoup
import re

with open('scout_data/article_bond_etf.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

article = soup.find('article')

# Let's inspect all text and structure inside article
lines = []
for el in article.descendants:
    if el.name in ['h1', 'h2', 'h3', 'p', 'figcaption']:
        text = el.get_text(' ', strip=True)
        if text and text not in lines:
            lines.append(f"[{el.name.upper()}] {text}")

print(f"Total elements: {len(lines)}")
with open('article_text_dump.txt', 'w', encoding='utf-8') as out:
    out.write('\n\n'.join(lines))

print("Dumped to article_text_dump.txt. First 1500 chars:")
print('\n\n'.join(lines[:10]))
