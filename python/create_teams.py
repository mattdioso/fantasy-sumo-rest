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

#fantasy_tournament = "2ea49be1-cd3c-424c-8cb2-e7c829e34104"
fantasy_tournament = "27a54dcc-50e8-4b2d-91e7-68f34a36754c"
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
            "Hoshoryu",
            "Shimazuumi",
            "Gonoyama",
            "Bushozan",
            "Meisei",
            "Shonannoumi"
        ]
    },
    {
        "name": "maxwellcromett",
        "wrestlers": [
            "Kotonowaka",
            "Asanoyama",
            "Hokuseiho",
            "Kinbozan",
            "Oho",
            "Nishikigi"
        ]
    },
    {
        "name": "alexozkan",
        "wrestlers": [
            "Kirishima", 
            "Onosato",
            "Kotoshoho",
            "Abi",
            "Onosho",
            "Aoiyama"
        ]
    },
    {
        "name": "jamesteban",
        "wrestlers": [
            "Terunofuji",
            "Takayasu",
            "Mitakeumi",
            "Takanosho",
            "Tobizaru",
            "Hiradoumi"
        ]
    },
    {
        "name": "karina",
        "wrestlers": [
            "Atamifuji",
            "Ichiyamamoto",
            "Tsurugisho",
            "Midorifuji",
            "Ryuden",
            "Churanoumi"
        ]
    },
    {
        "name": "johndickey",
        "wrestlers": [
            "Takakeisho",
            "Daieisho",
            "Ura",
            "Wakamotoharu",
            "Hokutofuji",
            "Shodai"
        ]
    }
]

def find_wrestler_id(wrestler):
  #search_url = "https://rest-api-dot-fantasy-sumo-409406.uw.r.appspot.com/api/wrestlers/search"
  search_url = "http://localhost:8080/api/wrestlers/search"
  json_body = {
    "ringname": wrestler
  }
  res = requests.post(search_url, json=json_body)
  results = res.json()
  wrestler_id = ""
  for wrestler_json in results:
      if wrestler_json['ringname'] == wrestler:
          wrestler_id = wrestler_json['id']
  return wrestler_id

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
    #res = requests.post('https://rest-api-dot-fantasy-sumo-409406.uw.r.appspot.com/api/teams', json=team_payload)
    res = requests.post('http://localhost:8080/api/teams', json=team_payload)
    print(res.status_code)
