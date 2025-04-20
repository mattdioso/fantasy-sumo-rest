#!/usr/bin/env python3
import requests
import json
from bs4 import BeautifulSoup
import datetime
import time

BASE_URL = "https://fantasy-sumo-rest-api-dot-fantasy-sumo-409406.uw.r.appspot.com"
MATCHES_URL = "http://sumodb.sumogames.de/Results.aspx?b={year:d}{month:02d}&d={day:d}"
SUMODB_BASE_URL = "https://sumodb.sumogames.de/"

SUMO_PROPERTY_DICT = {
    "Real Name": "givenname\tfamilyname",
    "Birth Date": "birthdate",
    "Shusshin": "birthplace",
    "Height and Weight": "height\tweight"
}

def convert_date(date_string):
  d = datetime.datetime.strptime(date_string, '%B %d, %Y')
  return d.strftime('%Y-%m-%d')

def create_wrestler(wrestler_name, href):
    print(href)
    page = requests.get(SUMODB_BASE_URL + href)
    soup = BeautifulSoup(page.content, 'html.parser')
    layoutright = soup.find_all(class_="layoutright")[0]
    rikshi_data = layoutright.find_all(class_="rikishidata")[0]
    rikshi_data_inner = rikshi_data.find_all(class_="rikishidata")[0]
    rows = rikshi_data_inner.find_all("tr")
    payload = {
        "ringname": wrestler_name,
        "retired": False
    }
    for row in rows:
        td_cat = row.find(class_="cat")
        td_val = row.find(class_="val")
        cat = td_cat.getText()
        if cat in SUMO_PROPERTY_DICT.keys():
            val = td_val.getText()
            if cat == "Real Name":
                parts = val.split(" ")
                given_name = parts[0]
                family_name = parts[1]
                payload['givenname'] = given_name[0].upper() + given_name[1:].lower()
                payload['familyname'] = family_name[0].upper() + family_name[1:].lower()
            elif cat == "Height and Weight":
                [height, _, weight, _] = val.split(" ")
                payload['weight'] = int(weight)
                payload['height'] = int(height)
            elif cat == "Birth Date":
                payload[SUMO_PROPERTY_DICT[cat]] = convert_date(val.split(" (")[0])
            else:
                payload[SUMO_PROPERTY_DICT[cat]] = val
    res = requests.post(BASE_URL + "/api/wrestlers", json=payload)
    if res.status_code != 200:
        print(res.text)
    else:
        print('created ' + wrestler_name)
    return res.json()['id']


def find_wrestler_id(wrestler):
    search_url = BASE_URL + "/api/wrestlers/search"
    json_body = {
        "ringname": wrestler
    }
    res = requests.post(search_url, json=json_body)
    results = res.json()
    wrestler_id = ""
    for wrestler_json in results:
        if wrestler_json["ringname"] == wrestler:
            wrestler_id = wrestler_json["id"]
    return wrestler_id

def find_technique_id(technique):
    search_url = BASE_URL + "/api/techniques/search"
    json_body = {
        "technique": technique
    }
    res = requests.post(search_url, json=json_body)
    return res.json()['id']

def check_match_exists(tournament_id, east_wrestler, west_wrestler, day):
    tournament_matches_url = BASE_URL + "/api/matches"
    res = requests.get(tournament_matches_url)
    matches = res.json()    
    day_matches = [m for m in matches if m.day == day]
    exists = [d for d in day_matches if (d.wrestler1 == east_wrestler or d.wrestler1 == west_wrestler) and (d.wrestler2 == east_wrestler or d.wrestler2 == west_wrestler)]
    print(len(exists) > 0)


def create_match(east_id, east_win, west_id, west_win, technique_id, forfeit_one, forfeit_two, match_num, day, tournament_id):
    match_url = BASE_URL + "/api/matches"
    match_body = {
        "wrestler1": east_id,
        "win1": east_win,
        "winByForfeit1": forfeit_one,
        "wrestler2": west_id,
        "win2": west_win,
        "winByForfeit2": forfeit_two,
        "winTechniqueId": technique_id,
        "matchNum": match_num,
        "day": day,
        "tournament": tournament_id
    }
    # check if match exists
    #check_match_exists(tournament_id, east_id, west_id, day)
    res = requests.post(match_url, json=match_body)
    if res.status_code != 200:
        print(res.text)
        return ""
    return res.json()['id']

def process_tr(row, match_num, day_num, tournament_id):
    west_won = False
    east_won = False
    td = row.find_all("td")
    if 'shiro' in td[0].img['src']:
        east_won = True
    else:
        west_won = True
    east_wrestler = td[1].center.a.text
    west_wrestler = td[3].center.a.text
    technique = td[2]
    for a in technique('a'):
        a.decompose()
    east_wrestler_id = find_wrestler_id(east_wrestler.strip())
    west_wrestler_id = find_wrestler_id(west_wrestler.strip())
    technique_id = find_technique_id(technique.text.strip())
    if east_wrestler_id == "":
        east_wrestler_id = create_wrestler(east_wrestler, td[1].center.a['href'])
    if west_wrestler_id == "":
        west_wrestler_id = create_wrestler(west_wrestler, td[3].center.a['href'])
    forfeit_one = 1
    forfeit_two = 1
    if east_won:
        if technique == "fusen":
            forfeit_one = 1
        print("%s beat %s using %s" % (east_wrestler, west_wrestler, technique.text))
        match_id = create_match(east_wrestler_id, True, west_wrestler_id, False, technique_id, forfeit_one, forfeit_two, match_num, day_num, tournament_id)
        return match_id
    else:
        if technique == "fusen":
            forfeit_two = 1
        print("%s beat %s using %s" % (west_wrestler, east_wrestler, technique.text))
        match_id = create_match(east_wrestler_id, False, west_wrestler_id, True, technique_id, forfeit_one, forfeit_two, match_num, day_num, tournament_id)
        return match_id

def sync_matches():
    res = requests.get(BASE_URL + "/api/tournaments")
    ts = res.json()
    filtered_ts = [t for t in ts if t['matches'] == []]
    for t in filtered_ts:
        t_id = t['id']
        res = requests.get(BASE_URL + "/api/tournaments/" + t_id)
        t = res.json()
        month_year = t['month_year']
        [ month, year ] = month_year.split("-")
        print(t_id + " " + month + " " + year)
        matches = []
        for i in range(1, 16):
            page = requests.get(MATCHES_URL.format(year=int(year), month=int(month), day=int(i)))
            soup = BeautifulSoup(page.content, 'html.parser')
            layoutright = soup.find_all(class_="layoutright")[0]
            tables = layoutright.find_all(class_="tk_table")
            # each table is a division
            for table in tables:
                trs = table.find_all("tr")
                # each row is a matchup within division
                for x in range(1, len(trs)):
                    match_id = process_tr(trs[x], len(matches), i, t_id)
                    if match_id != "":
                        matches.append({ "id": match_id })
        tournament_update = {
            "matches": matches
        }
        res = requests.put(BASE_URL + "/api/tournaments/" + t_id, json=tournament_update)
        print(res.json())
    print("done")



    

if __name__ == "__main__":
    sync_matches()