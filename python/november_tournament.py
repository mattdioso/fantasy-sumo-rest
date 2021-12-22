#!/usr/bin/env python3
import requests
import json
import time
import http

http.client.HTTPConnection.debuglevel = 1

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
  search_url = "http://localhost:3000/api/wrestlers/search"
  json_body = {
    "ringname": wrestler
  }
  res = requests.post(search_url, headers=sumo_headers, json=json_body)
  return res.json()['id']

def find_technique_id(technique):
  print(technique)
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
days = []
s = requests.Session()

for i in range(1, 16):
  matches=[]
  print(i)
  tournament_payload = {
    "basho_id": 608,
    "day": i
  }

  referer = "https://sumo.or.jp/EnHonbashoMain/torikumi/1/<DAY>/"
  ajax_headers = {
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Content-Length": str(32),
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Host": "sumo.or.jp",
    "Referer": referer.replace("<DAY>", str(i)),
    "X-Requested-With": "XMLHttpRequest",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "macOS",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36"
  }


  page = s.post(tournament_url + str(i) + "/", headers=ajax_headers, json=tournament_payload)
  #soup = BeautifulSoup(page.content, 'html.parser')
  try :
    tournament_json = page.json()['TorikumiData']
  except:
    page = requests.post(tournament_url + str(i) + "/", headers=ajax_headers, json=tournament_payload)
    try :
      tournament_json= page.json()['TorikumiData']
    except:
      print("ERROR")
      print(tournament_json)
      print(ajax_headers)
      exit(1)
  for result in tournament_json:
    res = result['judge']
    east_wrestler = result['east']['shikona_eng']
    west_wrestler = result['west']['shikona_eng']
    technique = result['technic_name_eng']

    east_wrestler_id = find_wrestler_id(east_wrestler)
    west_wrestler_id = find_wrestler_id(west_wrestler)
    technique_id = find_technique_id(technique)

    forfeit_one = 1
    forfeit_two = 1
    if int(res) == 1:
      if technique == "fusen":
        forfeit_one = 0
      print("%s beat %s using %s"% (east_wrestler, west_wrestler, technique))
      match_id = create_match(east_wrestler_id, 0, west_wrestler_id, 1, technique_id, forfeit_one, forfeit_two, len(matches) + 1)
    else:
      if technique == "fusen":
        forfeit_two = 1
      print("%s beat %s using %s"% (west_wrestler, east_wrestler, technique))
      match_id = create_match(east_wrestler_id, 1, west_wrestler_id, 0, technique_id, forfeit_one, forfeit_two, len(matches) + 1)
    matches.append({ "id": match_id})
  print(matches)
  day_id = create_day(i, matches)
  days.append({ "id": day_id })

tournament_update = {
  "days": days
}
res = requests.put(api_url + "/tournaments/" + tournament_id, json=tournament_update)
print(res.json())
