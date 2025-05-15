#!/usr/bin/env python3
import requests
from bs4 import BeautifulSoup
import json
import os
import datetime
import calendar
import uuid
from requests.adapters import HTTPAdapter, Retry

BASE_URL = "https://fantasy-sumo-rest-api-dot-fantasy-sumo-409406.uw.r.appspot.com"
s = requests.Session()
retries = Retry(total=3, backoff_factor=1, status_forcelist=[502, 503, 504])
s.mount('http://', HTTPAdapter(max_retries=retries))
tournament_data = {}
fantasy_tournament_data = {}
user_data = {}

def get_all_tournaments():
    tournament_url = BASE_URL + "/api/tournaments"
    res = s.get(tournament_url)
    global tournament_data
    tournament_data = res.json()

def get_all_fantasy_tournaments():
    fantasy_tournament_url = BASE_URL + "/api/fantasy_tournaments"
    res = s.get(fantasy_tournament_url)
    global fantasy_tournament_data
    fantasy_tournament_data = res.json()

def get_all_users():
    user_url = BASE_URL + "/api/users"
    res = s.get(user_url)
    global user_data
    user_data = res.json()

def get_user_id(username):
    return [u for u in user_data if u['username'] == username][0]['id']

def check_if_fantasy_tournament_exists(tournament_name):
    return [f for f in fantasy_tournament_data if f['name'] == tournament_name][0]['id']

def create_fantasy_tournament(basho_id, tournament_name):
    f_id = check_if_fantasy_tournament_exists(tournament_name)
    if not f_id:
        fantasy_tournament_url = BASE_URL + "/api/fantasy_tournaments"
        payload = {
            'name': tournament_name,
            'tournament': basho_id
        }
        res = s.post(fantasy_tournament_url, json=payload)
        f_id = res.json()['id']
    return f_id

def apply_winner(basho_id, u_id):
    print(basho_id, u_id)
    fantasy_tournament_url = BASE_URL + "/api/fantasy_tournaments/" + basho_id

    payload = {
        'winner': u_id
    }
    res = s.put(fantasy_tournament_url, json=payload)
    return res.json()

def sync_fantasy_tournament_data():
    try:
        with open('data/fantasy_tournaments.json', 'r') as file:
            data = json.load(file)
    except:
        print("error")

    for tournament_date in list(data.keys()):
        t_id = [t for t in tournament_data if t['month_year'] == tournament_date][0]['id']
        
        [month, year] = tournament_date.split("-")
        fantasy_tournament_name = calendar.month_name[int(month)] + " " + year + " Fantasy Tournament"
        #print(fantasy_tournament_name)
        tournament = data[tournament_date]
        winner = tournament['winner']
        #print(winner + "\t" + get_user_id(winner))
        u_id = get_user_id(winner)
        f_id = create_fantasy_tournament(t_id, fantasy_tournament_name)
        w_res = apply_winner(f_id, u_id)
        print(w_res)

        
    return

if __name__ == "__main__":
    get_all_tournaments()
    get_all_fantasy_tournaments()
    get_all_users()
    sync_fantasy_tournament_data()