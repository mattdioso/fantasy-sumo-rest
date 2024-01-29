#!/usr/bin/env python3
import json
import requests

tournament_api_url = "https://rest-api-dot-fantasy-sumo-409406.uw.r.appspot.com/api/tournaments"
match_api_url = "https://rest-api-dot-fantasy-sumo-409406.uw.r.appspot.com/api/matches"
valid_matches = set()
res = requests.get(tournament_api_url)
print(res.status_code)
tournaments = res.json()
for tournament in tournaments:
    matches = tournament['matches']
    for match in matches:
        match_id = match['id']
        valid_matches.add(match_id)
print(len(valid_matches))

res = requests.get(match_api_url)
deleted = 0
print(len(res.json()))
for match in res.json():
    if match['id'] not in valid_matches:
        deleted += 1

print("need to delete: " + str(deleted) + " matches")
