#!/usr/bin/env python33
import requests
import json

matchups = {
    "matchups": [
        {
            "matchup_1" : [
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
        },
        {
            "matchup_2" : [
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
            "matchup_3" : [
                {
                    "team1": "alexozkan",
                    "team2": "maxwellcromett",
                    "team1_score": 14.3,
                    "team2_score": 13.7
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
            "matchup_4" : [
                {
                    "team1": "alexozkan",
                    "team2": "johndickey",
                    "team1_score": 11.6,
                    "team2_score": 9.6
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
            "matchup_5" : [
                {
                    "team1": "alexozkan",
                    "team2": "jamesteban",
                    "team1_score": 14.6,
                    "team2_score": 9.8
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
