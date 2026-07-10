import urllib.request
import json

url = "https://sanaskills.tech/api/chat"
data = json.dumps({
    "messages": [{"role": "user", "content": "hello"}],
    "model": "openai/gpt-4o-mini"
}).encode('utf-8')

req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        print("Status:", response.status)
        print("Body:", response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("HTTP Error:", e.code)
    print("Body:", e.read().decode('utf-8'))
except Exception as e:
    print("Error:", e)
