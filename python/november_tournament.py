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

def find_wrestler_id(wrestler):
  search_url = "http://localhost:3000/api/wrestlers/search"
  json_body = {
    "ringname": wrestler
  }
  res = requests.post(search_url, headers=sumo_headers, json=json_body)
  return res.json()['id']

def find_technique_id(technique):
  search_url="http://localhost:3000/api/techniques/search"
  json_body = {
    "technique": technique
  }
  res = requests.post(search_url, headers=sumo_headers, json=json_body)
  return res.json()['id']

def create_match(east_id, east_win, west_id, west_win, technique_id, forfeit_one, forfeit_two, match_num):
  match_url = "http://localhost:3000/api/matches"
  match_body = {
    "idWrestler1": east_id,
    "win1": east_win,
    "winByForfeit1": forfeit_one,
    "idWrestler2": west_id,
    "win2": west_win,
    "winByForfeit2": forfeit_two,
    "winTechnique": technique_id,
    "matchNum": match_num
  }
  res = requests.post(match_url, json=match_body)
  return res.json()['id']

def create_day(day_num, matches):
  day_url = "http://localhost:3000/api/days"
  day_body = {
    "day_num": day_num,
    "matches": matches
  }
  res = requests.post(day_url, json=day_body)
  return res.json()['id']

api_url = "http://localhost:3000/api"

page = requests.get(api_url + "/tournaments")
tournament_json = page.json()
tournament_id = tournament_json[0]['id']
print(tournament_id)

day = 1
tournament_url = "https://www.sumo.or.jp/EnHonbashoMain/torikumi_ajax/1/"
matches = []
for i in range(1, 15):
  print(i)
  tournament_payload = {
    "basho_id": 608,
    "day": i
  }
  page = requests.post(tournament_url + str(i) + "/", headers=sumo_headers, json=tournament_payload)
  #soup = BeautifulSoup(page.content, 'html.parser')
  tournament_json = page.json()['TorikumiData']
  for result in tournament_json:
    res = result['judge']
    east_wrestler = result['east']['shikona_eng']
    west_wrestler = result['west']['shikona_eng']
    technique = result['technic_name_eng']
    forfeit_one = 1
    forfeit_two = 1
    if int(res) == 1:
      if technique == "fusen":
        forfeit_one = 0
      print("%s beat %s using %s"% (east_wrestler, west_wrestler, technique))
      match_id = create_match(find_wrestler_id(east_wrestler), 0, find_wrestler_id(west_wrestler), 1, find_technique_id(technique), forfeit_one, forfeit_two, len(matches) + 1)
    else:
      if technique == "fusen":
        forfeit_two = 1
      print("%s beat %s using %s"% (west_wrestler, east_wrestler, technique))
      match_id = create_match(find_wrestler_id(east_wrestler), 1, find_wrestler_id(west_wrestler), 0, find_technique_id(technique), forfeit_one, forfeit_two, len(matches) + 1)
    matches.append({ "id": match_id})
  print(matches)
  day_id = create_day(day, matches)
  print(day_id)
