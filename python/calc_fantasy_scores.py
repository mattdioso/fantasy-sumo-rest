#!/usr/bin/env python3
import json
import requests

res = requests.get('http://localhost:5000/api/fantasy_matchups')
matchups = res.json()

fantasy_tournament = "1faf296f-1e65-4572-8ad5-7d977c200cc5"
res = requests.get('http://localhost:5000/api/tournaments/' + fantasy_tournament)
matches = res.json()['matches']

### team1 ###
for matchup in matchups:
    team1 = matchup['team1']
    team2 = matchup['team2']
    print(team1['teamname'] + " vs. " + team2['teamname'])
    team1_wrestlers = team1['wrestlers']
    team2_wrestlers = team2['wrestlers']
    day1 = matchup['day1']
    day2 = matchup['day2']
    day3 = matchup['day3']
    team1_score = 0
    team2_score = 0
    for wrestler in team1_wrestlers:
        wrestler_matches = [ x for x in matches if x['idWrestler1'] == wrestler['id'] or x['idWrestler2'] == wrestler['id']]
        #print(wrestler_matches)
        for x in range(day1, day3 + 1):
            #print(x)
            wrestler_day_match = [ a for a in wrestler_matches if a['day'] == x]
            for wrestler_match in wrestler_day_match:
                match_id = wrestler_match['id']
                res = requests.get('http://localhost:5000/api/matches/' + match_id + '/score')
                score_json = res.json()
                wrestler_id = wrestler['id']
                #print(score_json)
                if score_json['match']['idWrestler1'] == wrestler_id and score_json['match']['win1'] == 0:
                    team1_score += float(score_json['score'])
                if score_json['match']['idWrestler2'] == wrestler_id and score_json['match']['win2'] == 0:
                    team1_score += float(score_json['score'])
    for wrestler in team2_wrestlers:
        wrestler_matches = [ x for x in matches if x['idWrestler1'] == wrestler['id'] or x['idWrestler2'] == wrestler['id']]
        #print(wrestler_matches)
        for x in range(day1, day3 + 1):
            #print(x)
            wrestler_day_match = [ a for a in wrestler_matches if a['day'] == x]
            for wrestler_match in wrestler_day_match:
                match_id = wrestler_match['id']
                res = requests.get('http://localhost:5000/api/matches/' + match_id + '/score')
                score_json = res.json()
                wrestler_id = wrestler['id']
                #print(score_json)
                if score_json['match']['idWrestler1'] == wrestler_id and score_json['match']['win1'] == 0:
                    team2_score += float(score_json['score'])
                if score_json['match']['idWrestler2'] == wrestler_id and score_json['match']['win2'] == 0:
                    team2_score += float(score_json['score'])
    print(team1['teamname'] + " score: " + str(team1_score))
    print(team2['teamname'] + " score: " + str(team2_score))
    matchup_id = matchup['id']
    matchup_payload = {
        "team1_score": team1_score,
        "team2_score": team2_score
    }
    res = requests.put('http://localhost:5000/api/fantasy_matchups/' + matchup_id, json=matchup_payload)
    print(res.status_code)
    print(matchup_id)
    print(matchup_payload)