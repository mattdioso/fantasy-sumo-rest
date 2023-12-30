#!/usr/bin/env python3
import requests
import json

avatar_url = "https://storage.googleapis.com/fantasy-sumo-409406.appspot.com/user_pics/<lastname>.jpg"

res = requests.get('http://localhost:8080/api/users')
users = res.json()

for user in users:
    print(user['lastname'])
    user_id = user['id']
    user_lastname = user['lastname']
    payload = {
            "avatar_store": avatar_url.replace("<lastname>", user_lastname),
    }
    res = requests.put('http://localhost:8080/api/users/' + user_id, json=payload)
    print(res.status_code)
