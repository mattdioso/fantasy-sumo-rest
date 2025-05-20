#!/usr/bin/env python3
import requests
import json

url = 'https://rest-api-dot-fantasy-sumo-409406.uw.r.appspot.com/api/fantasy_matchups'
res = requests.get(url)
j = res.json()

for matchup in j:
    print(matchup['id'])
    m_id = matchup['id']
    r = requests.delete('http://rest-api-dot-fantasy-sumo-409406.uw.r.appspot.com/api/fantasy_matchups/' + m_id)
    print(r.status_code)
