with open('app/src/views/DetailView.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "1.25x leverage" in line:
        print(f"Line {i+1}: {line.strip()}")
