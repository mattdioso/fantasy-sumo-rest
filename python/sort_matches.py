#!/usr/bin/env python3
import json
import requests

fantasy_tournament = "1faf296f-1e65-4572-8ad5-7d977c200cc5"
res = requests.get('http://localhost:5000/api/tournaments/' + fantasy_tournament)
json_res = res.json()
matches = json_res['matches'];
print(len(matches))

res = requests.get('http://localhost:5000/api/fantasy_matchups')
fantasy_matchups = res.json()
print(len(fantasy_matchups))
num_matches = 0
matches_set = set()
for matchup in fantasy_matchups:
    matchup_id = matchup['id']
    day1 = matchup['day1']
    day2 = matchup['day2']
    day3 = matchup['day3']
    team1 = matchup['team1']
    team2 = matchup['team2']
    print(team1['teamname'] + " vs. " + team2['teamname'] + " " + matchup_id)
    json_matches = matches
    day1_matches = [x for x in json_matches if x['day'] == day1]
    day2_matches = [x for x in json_matches if x['day'] == day2]
    day3_matches = [x for x in json_matches if x['day'] == day3]
    #print(len(day1_matches))
    #print(len(day2_matches))
    #print(len(day3_matches))
    team1_wrestlers = team1['wrestlers']
    team2_wrestlers = team2['wrestlers']
#    matches_set = set()
    process_matches = []
    #print(team1_wrestlers)
    #print(team2_wrestlers)
    for wrestler in team1_wrestlers:
        wrestler_id = wrestler['id']
        wrestler_day1_matches = [x for x in day1_matches if x['idWrestler1'] == wrestler_id or x['idWrestler2'] == wrestler_id]
        wrestler_day2_matches = [x for x in day2_matches if x['idWrestler1'] == wrestler_id or x['idWrestler2'] == wrestler_id]
        wrestler_day3_matches = [x for x in day3_matches if x['idWrestler1'] == wrestler_id or x['idWrestler2'] == wrestler_id]
        all_matches = wrestler_day1_matches + wrestler_day2_matches + wrestler_day3_matches
        print(len(all_matches))
        for match in all_matches:
            if match['id'] not in matches_set:
                process_matches.append(match)
                matches_set.add(match['id'])
    for wrestler in team2_wrestlers:
        wrestler_id = wrestler['id']
        wrestler_day1_matches = [x for x in day1_matches if x['idWrestler1'] == wrestler_id or x['idWrestler2'] == wrestler_id]
        wrestler_day2_matches = [x for x in day2_matches if x['idWrestler1'] == wrestler_id or x['idWrestler2'] == wrestler_id]
        wrestler_day3_matches = [x for x in day3_matches if x['idWrestler1'] == wrestler_id or x['idWrestler2'] == wrestler_id]
        all_matches = wrestler_day1_matches + wrestler_day2_matches + wrestler_day3_matches
        
        for match in all_matches:
            if match['id'] not in matches_set:
                process_matches.append(match)
                matches_set.add(match['id'])
    print(len(process_matches))
    matches_payload = {
        "matches": process_matches
    }
    #print(len(process_matches))
    num_matches += len(process_matches)
    #res = requests.put('http://localhost:5000/api/fantasy_matchups/' + matchup_id, json=matches_payload)

print(num_matches)

