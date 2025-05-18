#!/usr/bin/env python3
import requests
from bs4 import BeautifulSoup
import json
import os
import datetime
import calendar
import uuid
from requests.adapters import HTTPAdapter, Retry

#BASE_URL = "https://fantasy-sumo-rest-api-dot-fantasy-sumo-409406.uw.r.appspot.com"
BASE_URL = "http://localhost:8080"
s = requests.Session()
retries = Retry(total=3, backoff_factor=1, status_forcelist=[502, 503, 504])
s.mount('http://', HTTPAdapter(max_retries=retries))
tournament_data = {}
fantasy_tournament_data = {}
user_data = {}
wrestler_data = {}

def get_all_wrestlers():
    wrestler_url = BASE_URL + "/api/wrestlers"
    res = s.get(wrestler_url)
    global wrestler_data
    wrestler_data = res.json()

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
    fantasy_tournament_url = BASE_URL + "/api/fantasy_tournaments/" + basho_id
    res = s.get(fantasy_tournament_url)
    w_j = res.json()
    if w_j['winner'] is None:
        payload = {
            'winner': u_id
        }
        res = s.put(fantasy_tournament_url, json=payload)
        return res.json()
    return w_j['winner']['id']

def create_team(team_data, f_id):
    fantasy_tournament_url = BASE_URL + "/api/fantasy_tournaments/" + f_id
    team_url = BASE_URL + "/api/teams"
    f_res = s.get(fantasy_tournament_url)
    f_teams = f_res.json()['teams']
    f_t_exists = any(t['teamname'] == team_data['teamname'] for t in f_teams)
    if not f_t_exists:
        wrestler_ids = []
        for wrestler in team_data['wrestlers']:
            w_id = [w for w in wrestler_data if w['ringname'] == wrestler][0]['id']
            print(wrestler + "\t" + w_id)
            wrestler_ids.append(w_id)
        team_data['wrestlers'] = wrestler_ids
        team_data['fantasy_tournament'] = f_id
        u_id = get_user_id(team_data['teamname'])
        team_data['user'] = u_id
        res = s.post(team_url, json=team_data)
        print(json.dumps(team_data))
        return res.json()['id']
    return [t for t in f_teams if t['teamname'] == team_data['teamname']][0]['id']
            

    

def create_matchup(matchup_data, f_id):
    fantasy_tournament_url = BASE_URL + "/api/fantasy_tournaments/" + f_id
    return
    # get the teams


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
        apply_winner(f_id, u_id)
        # create the teams
        fantasy_tournament = s.get(BASE_URL + "/api/fantasy_tournaments/" + f_id)
        if len(fantasy_tournament.json()['teams']) == 0:
            print("creating teams")
            team_data = tournament['teams']
            teams = []
            for t in team_data:
                t_id = create_team(t, f_id)
                print("created team: " + t_id)
                teams.append(t_id)

        
    return

if __name__ == "__main__":
    get_all_tournaments()
    get_all_fantasy_tournaments()
    get_all_users()
    get_all_wrestlers()
    sync_fantasy_tournament_data()
