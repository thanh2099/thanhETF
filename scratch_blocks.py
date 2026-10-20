import re

with open('scout_data/article_bond_etf.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find all data-archive-block occurrences
blocks = re.findall(r'data-archive-block\\\":\\\"([^\\\"]+)\\\"', html)
print("Unique block types:", set(blocks))
print("Block sequence:", blocks)

# Also let's extract all components or tables/charts embedded in the next_f pushes
matches = re.findall(r'(\"data-archive-block\"[^\}]+})', html)
for m in matches[:10]:
    print(m)
