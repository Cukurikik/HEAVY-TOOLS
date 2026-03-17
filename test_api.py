import os
import requests

key = "AQ.Ab8RN6IcjBXv7QN0-mKrhbRpn-qrLvJ25H4qWIJf2FJ1YtqBkg"

# Try Anthropic
try:
    headers = {"x-api-key": key, "anthropic-version": "2023-06-01"}
    r = requests.get("https://api.anthropic.com/v1/models", headers=headers)
    print("Anthropic:", r.status_code)
except Exception as e:
    print("Anthropic Error:", e)

# Try Gemini
try:
    r = requests.get(f"https://generativelanguage.googleapis.com/v1beta/models?key={key}")
    print("Gemini:", r.status_code)
except Exception as e:
    print("Gemini Error:", e)

# Try OpenAI
try:
    headers = {"Authorization": f"Bearer {key}"}
    r = requests.get("https://api.openai.com/v1/models", headers=headers)
    print("OpenAI:", r.status_code)
except Exception as e:
    print("OpenAI Error:", e)
