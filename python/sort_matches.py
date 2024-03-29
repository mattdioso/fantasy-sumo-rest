#!/usr/bin/env python3
import json
import requests

tournament = "eef17dc9-f019-435d-84e3-759549f6ab6a"
fantasy_tournament = "2ea49be1-cd3c-424c-8cb2-e7c829e34104"
res = requests.get('https://rest-api-dot-fantasy-sumo-409406.uw.r.appspot.com/api/tournaments/' + tournament)
json_res = res.json()
matches = json_res['matches'];
print(len(matches))

res = requests.get('https://rest-api-dot-fantasy-sumo-409406.uw.r.appspot.com/api/fantasy_tournaments/' + fantasy_tournament + '/matches')
fantasy_matchups = res.json()
print(len(fantasy_matchups))
num_matches = 0
matches_set = set()
query = "6be98de5-5b37-4a61-afe5-2e1d672789ff"
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
        wrestler_day1_matches = [x for x in day1_matches if x['wrestler1']['id'] == wrestler_id or x['wrestler2']['id'] == wrestler_id]
        wrestler_day2_matches = [x for x in day2_matches if x['wrestler1']['id'] == wrestler_id or x['wrestler2']['id'] == wrestler_id]
        wrestler_day3_matches = [x for x in day3_matches if x['wrestler1']['id'] == wrestler_id or x['wrestler2']['id'] == wrestler_id]
        all_matches = wrestler_day1_matches + wrestler_day2_matches + wrestler_day3_matches
        for match in all_matches:
            if match['id'] not in matches_set:
                process_matches.append(match)
                matches_set.add(match['id'])
    for wrestler in team2_wrestlers:
        wrestler_id = wrestler['id']
        wrestler_day1_matches = [x for x in day1_matches if x['wrestler1']['id'] == wrestler_id or x['wrestler2']['id'] == wrestler_id]
        wrestler_day2_matches = [x for x in day2_matches if x['wrestler1']['id'] == wrestler_id or x['wrestler2']['id'] == wrestler_id]
        wrestler_day3_matches = [x for x in day3_matches if x['wrestler1']['id'] == wrestler_id or x['wrestler2']['id'] == wrestler_id]
        all_matches = wrestler_day1_matches + wrestler_day2_matches + wrestler_day3_matches
        for match in all_matches:
            if match['id'] not in matches_set:
                process_matches.append(match)
                matches_set.add(match['id'])
    print("sorted this many matches: " + str(len(process_matches)))
    matches_payload = {
        "matches": process_matches
    }
    #print(len(process_matches))
    num_matches += len(process_matches)
    res = requests.put('https://rest-api-dot-fantasy-sumo-409406.uw.r.appspot.com/api/fantasy_matchups/' + matchup_id, json=matches_payload)
    json_res = res.json()
    print(len(json_res['matches']))
    print(len(process_matches))
    if len(process_matches) != len(json_res['matches']):
        print("this is fucked up: " + json_res['id'])
#print(len(matches_set))
#print(num_matches)
#missing_matches = [x for x in matches if x['id'] not in matches_set]
#print(missing_matches)
#if query in matches_set:
#    print("it has the match")
