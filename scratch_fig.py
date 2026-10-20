from bs4 import BeautifulSoup

with open('scout_data/article_bond_etf.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

# Find figure tags or divs near "Figure 1", "Figure 2", "Figure 3"
figures = soup.find_all(['figure', 'div'])
for fig in soup.find_all('figure'):
    print("FIGURE TAG:", fig.prettify()[:500])

# Let's search for text around Figure 1, Figure 2, Figure 3
import re
for match in re.finditer(r'Figure\s+[123]', html, re.IGNORECASE):
    start = max(0, match.start() - 200)
    end = min(len(html), match.end() + 2500)
    print("=== MATCH ===")
    print(html[start:end])
    print("=================")
