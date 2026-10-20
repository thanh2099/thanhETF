import json

with open('app/src/data/canadianEtfRegistry.json', 'r', encoding='utf-8') as f:
    reg = json.load(f)

tickers_reg = [x['symbol'] for x in reg]
print('Registry count:', len(tickers_reg))

with open('app/src/data/etfHistoricalMonthly.json', 'r', encoding='utf-8') as f:
    hist = json.load(f)

print('Historical keys:', list(hist.keys()))

with open('app/src/data/etfData.ts', 'r', encoding='utf-8') as f:
    ts = f.read()

for t in ['HYLD.TO', 'XUS.TO', 'XEQT.TO', 'HMAX.TO']:
    in_reg = t in tickers_reg
    in_hist = t in hist
    in_ts = (f'"{t}"' in ts) or (f"'{t}'" in ts)
    print(f'{t} -> in registry: {in_reg}, in historical monthly: {in_hist}, in etfData.ts: {in_ts}')
