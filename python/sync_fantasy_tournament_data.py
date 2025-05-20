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
#BASE_URL = "http://localhost:8080"
s = requests.Session()
retries = Retry(total=3, backoff_factor=1, status_forcelist=[502, 503, 504])
s.mount('http://', HTTPAdapter(max_retries=retries))
tournament_data = {}
fantasy_tournament_data = {}
user_data = {}
wrestler_data = []

def get_all_matches(t_id):
    matches_url = BASE_URL + "/api/tournaments/" + t_id + "/matches"
    res = s.get(matches_url)
    return res.json()

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

def get_wrestler_id(ringname):
    return [w for w in wrestler_data if w['ringname'] == ringname][0]['id']

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
            w_id = get_wrestler_id(wrestler)
            wrestler_ids.append(w_id)
        team_data['wrestlers'] = wrestler_ids
        team_data['fantasy_tournament'] = f_id
        u_id = get_user_id(team_data['teamname'])
        team_data['user'] = u_id
        res = s.post(team_url, json=team_data)
        return res.json()['id']
    print('team exists')
    return [t for t in f_teams if t['teamname'] == team_data['teamname']][0]['id']
            

    

def create_matchup(matchup_data, teams, f_id, t_id):
    matchup_url = BASE_URL + "/api/fantasy_matchups"
    matchup_data['fantasy_tournament'] = f_id
    team1_name = matchup_data['team1']
    team2_name = matchup_data['team2']
    team1_id = [t for t in teams if t['teamname'] == team1_name][0]['id']
    team2_id = [t for t in teams if t['teamname'] == team2_name][0]['id']
    matchup_data['team1'] = team1_id
    matchup_data['team2'] = team2_id
    matches = []
    matches_set = set()
    tournament_matches = get_all_matches(t_id)
    day1 = matchup_data['day1']
    day2 = matchup_data['day2']
    day3 = matchup_data['day3']
    day1_matches = [x for x in tournament_matches if x['day'] == day1]
    day2_matches = [x for x in tournament_matches if x['day'] == day2]
    day3_matches = [x for x in tournament_matches if x['day'] == day3]
    team1_wrestlers = [t for t in teams if t['teamname'] == team1_name][0]['wrestlers']
    team2_wrestlers = [t for t in teams if t['teamname'] == team2_name][0]['wrestlers']
    for w in team1_wrestlers:
        w_day1_matches = [x for x in day1_matches if x['wrestler1']['id'] == w['id'] or x['wrestler2']['id'] == w['id']]
        w_day2_matches = [x for x in day2_matches if x['wrestler1']['id'] == w['id'] or x['wrestler2']['id'] == w['id']]
        w_day3_matches = [x for x in day3_matches if x['wrestler1']['id'] == w['id'] or x['wrestler2']['id'] == w['id']]
        all_matches = w_day1_matches + w_day2_matches + w_day3_matches
        for m in all_matches:
            if m['id'] not in matches_set:
                matches.append(m)
                matches_set.add(m['id'])
    for w in team2_wrestlers:
        w_day1_matches = [x for x in day1_matches if x['wrestler1']['id'] == w['id'] or x['wrestler2']['id'] == w['id']]
        w_day2_matches = [x for x in day2_matches if x['wrestler1']['id'] == w['id'] or x['wrestler2']['id'] == w['id']]
        w_day3_matches = [x for x in day3_matches if x['wrestler1']['id'] == w['id'] or x['wrestler2']['id'] == w['id']]
        all_matches = w_day1_matches + w_day2_matches + w_day3_matches
        for m in all_matches:
            if m['id'] not in matches_set:
                matches.append(m)
                matches_set.add(m['id'])
    matchup_data['matches'] = matches
    res = s.post(matchup_url, json=matchup_data)
    return res.json()['id']
    #return ""
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
        fantasy_tournament = s.get(BASE_URL + "/api/fantasy_tournaments/" + f_id).json()
        teams = []
        if len(fantasy_tournament['teams']) != 6:
            print("creating teams")
            team_data = tournament['teams']
            
            for t in team_data:
                t_id = create_team(t, f_id)
                print("created team: " + t_id)
                teams.append(t_id)
        else:
            teams = fantasy_tournament['teams']
        matchups = tournament['matchups']
        print(t_id)
        for m in matchups:
            m_id = create_matchup(m, teams, f_id, t_id)
            print("created matchup: " + m_id)
        
    return

if __name__ == "__main__":
    get_all_tournaments()
    get_all_fantasy_tournaments()
    get_all_users()
    get_all_wrestlers()
    sync_fantasy_tournament_data()
