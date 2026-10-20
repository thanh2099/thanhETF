with open('app/src/views/DetailView.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "What this fund is" in line or "How it's constructed" in line or "holds covered-call ETFs" in line:
        print(f"Line {i+1}: {line.strip()}")
