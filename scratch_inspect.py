import json

with open('app/src/data/etfHistoricalMonthly.json', 'r', encoding='utf-8') as f:
    hist = json.load(f)

hmax_raw = hist['HMAX.TO']['series']
hmax_points = []
for pt in hmax_raw:
    hmax_points.append({
        'd': pt['date'],
        't': pt['adjClose'],
        'p': pt['close']
    })

hist['HMAX.TO'] = hmax_points

with open('app/src/data/etfHistoricalMonthly.json', 'w', encoding='utf-8') as f:
    json.dump(hist, f, indent=2)

print(f"Normalized HMAX.TO to {len(hmax_points)} points. First: {hmax_points[0]}, Last: {hmax_points[-1]}")
