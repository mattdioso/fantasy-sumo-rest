#!/usr/bin/env python3
import json
import requests

res = requests.get('http://localhost:5000/api/fantasy_matchups')
matchups = res.json()

fantasy_tournament = "1faf296f-1e65-4572-8ad5-7d977c200cc5"
res = requests.get('http://localhost:5000/api/tournaments/' + fantasy_tournament)
matches = res.json()['matches']

res = requests.get('http://localhost:5000/api/teams')
teams = res.json()

for team in teams:
    team_id = team['id']
    name = team['teamname']
    wrestlers = team['wrestlers']
    team_score = 0
    for wrestler in wrestlers:
        wrestler_id = wrestler['id']
        wrestler_matches = [x for x in matches if x['idWrestler1'] == wrestler_id or x['idWrestler2'] == wrestler_id]
        for wrestler_match in wrestler_matches:
            matchup_id = wrestler_match['id']
            res = requests.get('http://localhost:5000/api/matches/' + matchup_id + '/score')
            score = res.json()
            if wrestler_match['idWrestler1'] == wrestler_id and wrestler_match['win1'] == 0:
                team_score += float(score['score'])
            if wrestler_match['idWrestler2'] == wrestler_id and wrestler_match['win2'] == 0:
                team_score += float(score['score'])

    print(team_score)
    team_payload = {
            "total_points": team_score
    }
    requests.put('http://localhost:5000/api/teams/' + team_id, json=team_payload)
    print(res.status_code)
