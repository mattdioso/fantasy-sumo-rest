#!/usr/bin/env python3
import requests
import json

avatar_url = "https://storage.googleapis.com/fantasy-sumo-409406.appspot.com/sumo_avatars/<ringname>.jpg"
icon_url = "https://storage.googleapis.com/fantasy-sumo-409406.appspot.com/sumo_icons/<ringname>_icon.jpg"

res = requests.get('http://localhost:8080/api/wrestlers')
wrestlers = res.json()

for wrestler in wrestlers:
    print(wrestler['ringname'])
    wrestler_id = wrestler['id']
    ringname = wrestler['ringname']
    payload = {
            "avatar_store": avatar_url.replace("<ringname>", ringname),
            "icon_store": icon_url.replace("<ringname>", ringname)
    }
    res = requests.put('http://localhost:8080/api/wrestlers/' + wrestler_id, json=payload)
    print(res.status_code)
