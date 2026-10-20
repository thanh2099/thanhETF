with open(r'C:\Users\Thanh\.gemini\antigravity\brain\77cd9115-b93b-4bea-b7b7-f82943b198cd\scratch\save_report.py', 'r', encoding='utf-8-sig') as f:
    text = f.read()

start_marker = 'report_content = """'
end_marker = '"""'

start_idx = text.find(start_marker) + len(start_marker)
end_idx = text.rfind(end_marker)

if start_idx != -1 and end_idx != -1:
    content = text[start_idx:end_idx]
    with open('scout_data/scout_agent_2_report.md', 'w', encoding='utf-8') as out:
        out.write(content)
    print(f"Successfully saved scout_data/scout_agent_2_report.md with {len(content)} bytes!")
else:
    print("Could not find markers")
