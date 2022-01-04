#!/usr/bin/env python3
import requests
import json
import time
import http
from bs4 import BeautifulSoup
#http.client.HTTPConnection.debuglevel = 1

sumo_headers = {
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Connection": "keep-alive",
  "Host": "sumo.or.jp",
  "Referer": "https://sumo.or.jp/EnSumoDataRikishi/search/search",
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36"
}
def find_wrestler_id(wrestler):
  print(wrestler)
  search_url = "http://localhost:5000/api/wrestlers/search"
  json_body = {
    "ringname": wrestler
  }
  res = requests.post(search_url, headers=sumo_headers, json=json_body)
  return res.json()['id']

def find_technique_id(technique):
  print(technique)
  search_url="http://localhost:5000/api/techniques/search"
  json_body = {
    "technique": technique
  }
  res = requests.post(search_url, headers=sumo_headers, json=json_body)
  return res.json()['id']

def create_match(east_id, east_win, west_id, west_win, technique_id, forfeit_one, forfeit_two, match_num):
  match_url = "http://localhost:5000/api/matches"
  match_body = {
    "idWrestler1": east_id,
    "win1": east_win,
    "winByForfeit1": forfeit_one,
    "idWrestler2": west_id,
    "win2": west_win,
    "winByForfeit2": forfeit_two,
    "winTechniqueId": technique_id,
    "matchNum": match_num
  }
  res = requests.post(match_url, json=match_body)
  print(res.json())
  return res.json()['id']

def create_day(day_num, matches):
  day_url = "http://localhost:5000/api/days"
  day_body = {
    "day_num": day_num,
    "matches": matches
  }
  res = requests.post(day_url, json=day_body)
  return res.json()['id']


def process_tr(tr, match_num):
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
  forfeit_one = 1
  forfeit_two = 1
  if east_won:
    if technique == "fusen":
      forfeit_one = 0
    print("%s beat %s using %s"% (east_wrestler, west_wrestler, technique.text))
    match_id = create_match(east_wrestler_id, 0, west_wrestler_id, 1, technique_id, forfeit_one, forfeit_two, match_num)
    return match_id
  else:
    if technique == "fusen":
      forfeit_two = 1
    print("%s beat %s using %s"% (west_wrestler, east_wrestler, technique.text))
    match_id = create_match(east_wrestler_id, 1, west_wrestler_id, 0, technique_id, forfeit_one, forfeit_two, match_num)
    return match_id


api_url = "http://localhost:5000/api"

page = requests.get(api_url + "/tournaments")
tournament_json = page.json()
tournament_id = tournament_json[0]['id']
print(tournament_id)

day = 1
tournament_url = "http://sumodb.sumogames.de/Results.aspx?b=202111&d=<DAY>"
days = []
s = requests.Session()

for i in range(1, 16):
  matches=[]
  print(i)
  tournament_payload = {
    "basho_id": 608,
    "day": i
  }

  referer = "http://sumodb.sumogames.de/Results.aspx?b=202111&d=<DAY>"
  ajax_headers = {
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Host": "sumodb.sumogames.de",
    "Referer": referer.replace("<DAY>", str(i)),
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36"
  }


  page = s.post(tournament_url.replace("<DAY>", str(i)), headers=ajax_headers)
  soup = BeautifulSoup(page.content, 'html.parser')
  tables=soup.find_all(class_="tk_table")[0].find_all("tr")
  for x in range(1, len(tables)):
    match_id = process_tr(tables[x], len(matches) + 1)
    matches.append({ "id": match_id})
  print(matches)
  day_id = create_day(i, matches)
  days.append({ "id": day_id })

tournament_update = {
  "days": days
}
res = requests.put(api_url + "/tournaments/" + tournament_id, json=tournament_update)
print(res.json())


