import urllib.request

for host in ['127.0.0.1:5173', 'localhost:5173', '[::1]:5173']:
    try:
        url = f'http://{host}/'
        with urllib.request.urlopen(url, timeout=2) as resp:
            content = resp.read().decode('utf-8')
            title = 'No Title'
            if '<title>' in content:
                title = content.split('<title>')[1].split('</title>')[0]
            print(f'{host} -> Title: {title}')
    except Exception as e:
        print(f'{host} -> Error: {e}')
