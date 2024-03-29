#!/usr/bin/env python3
import json
import requests
from dateutil import parser
from datetime import date
from datetime import datetime
import sys
from bs4 import BeautifulSoup


sumo_headers = {
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Connection": "keep-alive",
  "Host": "sumo.or.jp",
  "Referer": "https://sumo.or.jp/EnSumoDataRikishi/search/search",
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36"
}
def find_wrestler_id(wrestler):
  #print(wrestler)
  search_url = "https://rest-api-dot-fantasy-sumo-409406.uw.r.appspot.com/api/wrestlers/search"
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

def find_technique_id(technique):
  #print(technique)
  search_url="https://rest-api-dot-fantasy-sumo-409406.uw.r.appspot.com/api/techniques/search"
  json_body = {
    "technique": technique
  }
  res = requests.post(search_url, json=json_body)
  #print(res)
  return res.json()['id']

def create_match(east_id, east_win, west_id, west_win, technique_id, forfeit_one, forfeit_two, match_num, day, tournament_id):
  match_url = "https://rest-api-dot-fantasy-sumo-409406.uw.r.appspot.com/api/matches"
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
  
  res = requests.post(match_url, json=match_body)
  print(res.json())
  return res.json()['id']
#  return ""

def create_day(day_num, matches):
  day_url = "https://rest-api-dot-fantasy-sumo-409406.uw.r.appspot.com/api/days"
  day_body = {
    "day_num": day_num,
    "matches": matches
  }
  res = requests.post(day_url, json=day_body)
  return res.json()['id']


def process_tr(tr, match_num, day_num, tournament_id):
  west_won = False
  east_won = False
  td = tr.find_all("td")
  if 'shiro' in td[0].img['src']:
    east_won = True
  else:
    west_won = True
  east_wrestler = td[1].center.a.text
  west_wrestler = td[3].center.a.text
  technique = td[2]
  for a in technique('a'):
    a.decompose()
  #print(east_wrestler.strip() + "\t" + west_wrestler.strip() + "\t" + technique.text.strip())
  east_wrestler_id = find_wrestler_id(east_wrestler.strip())
  west_wrestler_id = find_wrestler_id(west_wrestler.strip())
  technique_id = find_technique_id(technique.text.strip())
  forfeit_one = False
  forfeit_two = False
  match_id = ""
  if east_won:
    if technique == "fusen":
      forfeit_one = True
    print("%s beat %s using %s"% (east_wrestler, west_wrestler, technique.text))
    match_id = create_match(east_wrestler_id, True, west_wrestler_id, False, technique_id, forfeit_one, forfeit_two, match_num, day_num, tournament_id)
    return match_id
  else:
    if technique == "fusen":
      forfeit_two = True
    print("%s beat %s using %s"% (west_wrestler, east_wrestler, technique.text))
    match_id = create_match(east_wrestler_id, False, west_wrestler_id, True, technique_id, forfeit_one, forfeit_two, match_num, day_num, tournament_id)
    return match_id

tournament_start_date = "2024-01-14"
start_date_df = parser.parse(tournament_start_date)
df = datetime.strptime(tournament_start_date, "%Y-%m-%d").date()
today = date.today()
days_to_process = abs(today - df).days
month = df.month
year = df.year
tournament_query_string = str(year) + str(month).zfill(2)
tournament_api_url = "https://rest-api-dot-fantasy-sumo-409406.uw.r.appspot.com/api/tournaments"
page = requests.get(tournament_api_url)
tournament_json = page.json()
tournament_id = ""
for tournament in tournament_json:
  if tournament_start_date == tournament['datestart']:
    tournament_id = tournament['id']
    break

if not tournament_id:
  sys.exit("tournament not found")
  

print(tournament_id)
day = 1
tournament_url = "http://sumodb.sumogames.de/Results.aspx?b=<QUERY>&d=<DAY>"
days = []
s = requests.Session()
matches = []
if days_to_process > 15:
  days_to_process = 15
print(days_to_process)
for i in range(day, days_to_process + 1):
  print(i)
  referer = "http://sumodb.sumogames.de/Results.aspx?b=<QUERY>&d=<DAY>"
  ajax_headers = {
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Host": "sumodb.sumogames.de",
    "Referer": referer.replace("<DAY>", str(i)),
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36"
  }

  page = s.post(tournament_url.replace("<QUERY>", tournament_query_string).replace("<DAY>", str(i)), headers = ajax_headers)
  soup = BeautifulSoup(page.content, 'html.parser')
  tables = soup.find_all(class_="tk_table")[0].find_all("tr")
  for x in range(1, len(tables)):
    match_id = process_tr(tables[x], len(matches) + 1, i, tournament_id)
    matches.append({"id": match_id})

tournament_update = {
  "matches": matches
}
res = requests.put(tournament_api_url + '/' + tournament_id, json=tournament_update)
print(res.status_code)
print("done")