import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('app/src/data/etfData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
symbols = re.findall(r'symbol:\s*[\'\"]([^\'\"]+)[\'\"]', text)
print(f"Total symbol occurrences: {len(symbols)}")
print("Sample:", symbols[:15])
