#!/usr/bin/env python3

import requests
import json
import os
from bs4 import BeautifulSoup
from requests.adapters import HTTPAdapter, Retry
import calendar

def process_record(record):
  parts = record.split("-")
  wins = parts[0]
  losses = parts[1]
  ret = {
    "wins": wins,
    "losses": losses
  }
  return ret

def create_ranking(rank, wins, losses, division, wrestler):
  wrestler_id = find_wrestler_id(wrestler)
  rank_payload = {
    "rank": rank,
    "idTournament": "eef17dc9-f019-435d-84e3-759549f6ab6a",
    "wins": wins,
    "losses": losses,
    "division": division,
    "idWrestler": wrestler_id
  }
  rank_url = "https://fantasy-sumo-rest-api-dot-fantasy-sumo-409406.uw.r.appspot.com/api/rankings"
  res = requests.post(rank_url, json=rank_payload)
  print(res.json())

def find_wrestler_id(wrestler):
  search_url="https://fantasy-sumo-rest-api-dot-fantasy-sumo-409406.uw.r.appspot.com/api/wrestlers/search"
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

BASE_URL = "https://fantasy-sumo-rest-api-dot-fantasy-sumo-409406.uw.r.appspot.com"
#BASE_URL = "http://localhost:8080"
s = requests.Session()
retries = Retry(total=3, backoff_factor=1, status_forcelist=[502, 503, 504])
s.mount('http://', HTTPAdapter(max_retries=retries))

try:
  with open('data/fantasy_tournaments.json', 'r') as file:
    data = json.load(file)
except:
  print("error")

tournament_url = BASE_URL + "/api/tournaments"
res = s.get(tournament_url)
tournament_data = res.json()

for tournament_date in list(data.keys()):
  t_id = [t for t in tournament_data if t['month_year'] == tournament_date][0]['id']
        
  [month, year] = tournament_date.split("-")
  fantasy_tournament_name = calendar.month_name[int(month)] + " " + year + " Fantasy Tournament"
  banzuke_url = "http://sumodb.sumogames.de/Banzuke.aspx?b={year:d}{month:02d}&heya=-1&shusshin=-1"
  page = requests.get(banzuke_url.format(year=year, month=month))
  soup = BeautifulSoup(page.content, 'html.parser')
  tables = soup.find_all(class_="banzuke")
  for i in range(0, 6):
      body = tables[i].select("tbody")[0]
      rows = body.find_all("tr")
      for row in rows:
          tds = row.find_all("td")
          rank = tds[2].text
          #  print(rank)
          if tds[0].text and tds[1].text:
          #    print(tds[2].a)
              try:
                  west_record = tds[0].a.text.split(" ")[0]
                  west_name = tds[1].a.text
                  west_json_record = process_record(west_record)
              except:
                  west_record = tds[3].a.text.split(" ")[0]
                  west_name = tds[2].a.text
                  west_json_record = process_record(west_record)
              print(west_name + "\t wins: " + west_json_record['wins'] + "\t losses: " + west_json_record['losses'])
              #create_ranking(rank, west_json_record['wins'], west_json_record['losses'], "west", west_name)
          if len(tds) > 4:
              east_name = tds[3].a.text
              east_record = tds[4].a.text.split(" ")[0]
              east_json_record = process_record(east_record)
              print(east_name + "\t wins: " + east_json_record['wins'] + "\t losses: " + west_json_record['losses'])
              #create_ranking(rank, east_json_record['wins'], east_json_record['losses'], "east", east_name)
