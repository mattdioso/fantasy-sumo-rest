#!/usr/bin/env python3
import requests
import json


sumo_headers = {
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Connection": "keep-alive",
  "Host": "sumo.or.jp",
  "Referer": "https://sumo.or.jp/EnSumoDataRikishi/search/search",
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36"
}

fantasy_tournament = "26ab9b5a-d45d-4fa2-8373-933475fdf92f"
users = {
    "mattdioso": "8751360b-338e-463b-a067-4d118ae270a8",
    "maxwellcromett": "daf81bfd-0f9e-438b-9114-93a15c3d2f89",
    "alexozkan": "bd2de46a-a0d5-4dfe-b670-f9275138a1de",
    "jamesteban": "8426bf1f-d43e-48a6-b04c-08dc25cb2834",
    "karina": "e1d81928-203d-49eb-bb9e-ccd4decf0c60",
    "johndickey": "d2d8c6f5-4a51-4b8f-8cbd-d0c01f91e106"
}

teams = [
    {
        "name": "mattdioso",
        "wrestlers": [
            "Kotonowaka",
            "Atamifuji",
            "Tohakuryu",
            "Kinbozan",
            "Wakamotoharu",
            "Tsurugisho"
        ]
    },
    {
        "name": "maxwellcromett",
        "wrestlers": [
            "Hokuseiho",
            "Oho",
            "Nishikifuji",
            "Gonoyama",
            "Nishikigi",
            "Shodai"
        ]
    },
    {
        "name": "alexozkan",
        "wrestlers": [
            "Kirishima", 
            "Churanoumi",
            "Takayasu",
            "Mitakeumi",
            "Ichiyamamoto",
            "Ryuden"
        ]
    },
    {
        "name": "jamesteban",
        "wrestlers": [
            "Hoshoryu",
            "Abi",
            "Roga",
            "Tobizaru",
            "Onosho",
            "Hiradoumi"
        ]
    },
    {
        "name": "karina",
        "wrestlers": [
            "Daieisho",
            "Meisei",
            "Tomokaze",
            "Takanosho",
            "Ura",
            "Myogiryu"
        ]
    },
    {
        "name": "johndickey",
        "wrestlers": [
            "Takakeisho",
            "Kitanowaka",
            "Hokutofuji",
            "Midorifuji",
            "Endo",
            "Takarafuji"
        ]
    }
]

def find_wrestler_id(wrestler):
  search_url = "http://localhost:5000/api/wrestlers/search"
  json_body = {
    "ringname": wrestler
  }
  res = requests.post(search_url, headers=sumo_headers, json=json_body)
  return res.json()['id']

for item in teams:
    print(item['name'])
    name = item['name']
    user_id = users[name]
    wrestlers = item['wrestlers']
    wrestler_payload = []
    for wrestler in wrestlers:
        wrestler_id = find_wrestler_id(wrestler)
        print(wrestler + "\t" + wrestler_id)
        wrestler_payload.append({"id": wrestler_id})
    team_payload = {
        "teamname": name,
        "user": {
            "id": user_id
        },
        "fantasy_tournament": fantasy_tournament,
        "wrestlers": wrestler_payload
    }
    print(team_payload)
    res = requests.post('http://localhost:5000/api/teams', json=team_payload)
    print(res.status_code)
