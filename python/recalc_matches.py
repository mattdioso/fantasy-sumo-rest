#!/usr/bin/env python3
import requests
import json

matches_api = 'http://localhost:5000/api/matches'
res = requests.get(matches_api)
matches = res.json()

match_score_api = 'http://localhost:5000/api/matches/<ID>/score'

for match_i in matches:
    res = requests.put(match_score_api.replace("<ID>", match_i['id']))
    print(res.status_code)
