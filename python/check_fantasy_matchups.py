#!/usr/bin/env python3
import requests
import json

fantasy_matchup = 'http://localhost:5000/api/fantasy_matchups'
res = requests.get(fantasy_matchup)
json = res.json()

print(len(json))
for matchup in json:
    matchup_id = matchup['id']
    matches = matchup['matches']
    print("number of matches for: " + matchup_id + ": " + str(len(matches)))
