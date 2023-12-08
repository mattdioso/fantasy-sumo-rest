#!/usr/bin/env python3
import requests
import json

fantasy_tournament = "26ab9b5a-d45d-4fa2-8373-933475fdf92f"
users = {
    "mattdioso": "8751360b-338e-463b-a067-4d118ae270a8",
    "maxwellcromett": "daf81bfd-0f9e-438b-9114-93a15c3d2f89",
    "alexozkan": "bd2de46a-a0d5-4dfe-b670-f9275138a1de",
    "jamesteban": "8426bf1f-d43e-48a6-b04c-08dc25cb2834",
    "karina": "e1d81928-203d-49eb-bb9e-ccd4decf0c60",
    "johndickey": "d2d8c6f5-4a51-4b8f-8cbd-d0c01f91e106"
}

matchups = {
    "matchups": [
        {
            "name": "matchup_1",
            "start_day": 1,
            "end_day": 3,
            "pairs" : [
                {
                    "team1": "alexozkan",
                    "team2": "mattdioso",
                    "team1_score": 11.7,
                    "team2_score": 11.1,
                    "winner": "alexozkan"
                },
                {
                    "team1": "maxwellcromett",
                    "team2": "johndickey",
                    "team1_score": 6.6,
                    "team2_score": 8.4,
                    "winner": "johndickey"
                },
                {
                    "team1": "karina",
                    "team2": "jamesteban",
                    "team1_score": 7.2,
                    "team2_score": 6.4,
                    "winner": "karina"
                }
            ]
        },
        {
            "name": "matchup_2",
            "start_day": 4,
            "end_day": 6,
            "pairs" : [
                {
                    "team1": "alexozkan",
                    "team2": "karina",
                    "team1_score": 12.5,
                    "team2_score": 9.7,
                    "winner": "alexozkan"
                },
                {
                    "team1": "johndickey",
                    "team2": "jamesteban",
                    "team1_score": 8.3,
                    "team2_score": 11.1,
                    "winner": "jamesteban"
                },
                {
                    "team1": "maxwellcromett",
                    "team2": "mattdioso",
                    "team1_score": 9.5,
                    "team2_score": 10.1,
                    "winner": "mattdioso"
                }

            ]
        },
        {
            "name": "matchup_3",
            "start_day": 7,
            "end_day": 9,
            "pairs" : [
                {
                    "team1": "alexozkan",
                    "team2": "maxwellcromett",
                    "team1_score": 14.3,
                    "team2_score": 13.7,
                    "winner": "alexozkan"
                },
                {
                    "team1": "jamesteban",
                    "team2": "mattdioso",
                    "team1_score": 6.2,
                    "team2_score": 7.8,
                    "winner": "mattdioso"
                },
                {
                    "team1": "johndickey",
                    "team2": "karina",
                    "team1_score": 7.3,
                    "team2_score": 6.3,
                    "winner": "johndickey"
                }

            ]
        },
        {
            "name": "matchup_4",
            "start_day": 10,
            "end_day": 12,
            "pairs" : [
                {
                    "team1": "alexozkan",
                    "team2": "johndickey",
                    "team1_score": 11.6,
                    "team2_score": 9.6,
                    "winner": "alexozkan"
                },
                {
                    "team1": "mattdioso",
                    "team2": "karina",
                    "team1_score": 13.5,
                    "team2_score": 9.1,
                    "winner": "mattdioso"
                },
                {
                    "team1": "jamesteban",
                    "team2": "maxwellcromett",
                    "team1_score": 10.2,
                    "team2_score": 7.3,
                    "winner": "jamesteban"
                }
            ]
        },
        {
            "name": "matchup_5",
            "start_day": 13,
            "end_day": 15,
            "pairs" : [
                {
                    "team1": "alexozkan",
                    "team2": "jamesteban",
                    "team1_score": 14.6,
                    "team2_score": 9.8,
                    "winner": "alexozkan"
                },
                {
                    "team1": "karina",
                    "team2": "maxwellcromett",
                    "team1_score": 8.4,
                    "team2_score": 9.6,
                    "winner": "maxwellcromett"
                },
                {
                    "team1": "mattdioso",
                    "team2": "johndickey",
                    "team1_score": 11.6,
                    "team2_score": 7.6,
                    "winner": "mattdioso"
                }
            ]
        }

    ]
}

for matchup in matchups['matchups']:
    print(matchup['name'] + ": days: " + str(matchup['start_day']) + " - " + str(matchup['end_day']))
    days = []
    for i in range(matchup['start_day'], matchup['end_day']+1):
        days.append(i)
    for pair in matchup['pairs']:
        print(pair['team1'] + ' vs. ' + pair['team2'])
        matchup_payload = {
            "fantasy_tournament": fantasy_tournament,
            "day1": days[0],
            "day2": days[1],
            "day3": days[2],
            "team1": users[pair['team1']],
            "team2": users[pair['team2']],
            "team1_score": 0,
            "team2_score": 0,
            "matches": []
        }
