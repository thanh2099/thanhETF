import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('app/src/data/etfData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Find each ETF block
import re
etf_blocks = re.findall(r'\{\s*symbol:\s*[\'\"]([^\'\"]+)[\'\"].*?holdings:\s*\[(.*?)\]\s*,', text, re.DOTALL)
for sym, holdings_block in etf_blocks:
    items = [h.strip() for h in holdings_block.split('},') if 'symbol:' in h]
    print(f"ETF {sym}: {len(items)} holdings in array")
