import sys
sys.stdout.reconfigure(encoding='utf-8')
import json

with open('scout_data/target_etfs_summary.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for ticker in ['HYLD.TO', 'XUS.TO', 'XEQT.TO', 'HMAX.TO']:
    print(f"=== {ticker} ===")
    print("Holdings raw from DecodeETF:")
    for h in data[ticker].get('holdings_raw', []):
        print("  ", h)
