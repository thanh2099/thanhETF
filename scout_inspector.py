import urllib.request
import re
import json

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5'
}

def fetch(url):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=15) as resp:
        return resp.read().decode('utf-8', errors='ignore')

homepage = fetch('https://decodeetf.com/')

css_urls = re.findall(r'href="([^"]+\.css[^"]*)"', homepage)
print("CSS URLs found:", len(css_urls))
for c in css_urls:
    print(" - CSS:", c)

script_urls = re.findall(r'src="([^"]+\.js[^"]*)"', homepage)
print("Script URLs found:", len(script_urls))
for s in script_urls[:10]:
    print(" - Script:", s)

# Fetch the main CSS files to extract fonts and colors
colors = set()
font_families = set()

for css_path in css_urls:
    full_css_url = css_path if css_path.startswith('http') else f"https://decodeetf.com{css_path}"
    try:
        css_content = fetch(full_css_url)
        # Extract font families
        ffs = re.findall(r'font-family:\s*([^;}]+)', css_content)
        for ff in ffs:
            font_families.add(ff.strip())
        
        # Extract hex colors
        hex_cols = re.findall(r'#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b', css_content)
        for hc in hex_cols:
            colors.add(f"#{hc.upper()}")

        # Extract rgb/rgba / hsl colors
        var_defs = re.findall(r'(--[a-zA-Z0-9_-]+:\s*[^;]+)', css_content)
        print(f"CSS {css_path} vars found: {len(var_defs)}")
        for v in var_defs[:20]:
            print("   Var:", v.strip())
    except Exception as e:
        print(f"Error fetching CSS {css_path}: {e}")

print("\n--- Detected Font Families ---")
for ff in sorted(list(font_families))[:15]:
    print("Font:", ff)

print(f"\n--- Detected Unique Hex Colors: {len(colors)} ---")
sample_colors = sorted(list(colors))[:40]
print("Sample colors:", sample_colors)
