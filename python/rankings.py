#!/usr/bin/env python3

import requests
import json
import os
from bs4 import BeautifulSoup

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
    "idTournament": "857bc3fa-c100-4952-b5bf-3114471cba55",
    "wins": wins,
    "losses": losses,
    "division": division,
    "idWrestler": wrestler_id
  }
  rank_url = "http://localhost:5000/api/rankings"
  res = requests.post(rank_url, json=rank_payload)
  print(res.json())

def find_wrestler_id(wrestler):
  search_url="http://localhost:5000/api/wrestlers/search"
  json_body = {
    "ringname": wrestler
  }
  res = requests.post(search_url, json=json_body)
  return res.json()['id']

banzuke_url = "http://sumodb.sumogames.de/Banzuke.aspx?b=202111&heya=-1&shusshin=-1"
page = requests.get(banzuke_url)
soup = BeautifulSoup(page.content, 'html.parser')
tables = soup.find_all(class_="banzuke")
body = tables[0].select("tbody")[0]
rows = body.find_all("tr")
for row in rows:
  tds = row.find_all("td")
  rank = tds[2].text
  print(rank)
  if tds[0].text and tds[1].text:
    west_record = tds[0].a.text.split(" ")[0]
    west_name = tds[1].a.text
    west_json_record = process_record(west_record)
    print(west_name + "\t wins: " + west_json_record['wins'] + "\t losses: " + west_json_record['losses'])
    create_ranking(rank, west_json_record['wins'], west_json_record['losses'], "west", west_name)
  if len(tds) > 4:
    east_name = tds[3].a.text
    east_record = tds[4].a.text.split(" ")[0]
    east_json_record = process_record(east_record)
    print(east_name + "\t wins: " + east_json_record['wins'] + "\t losses: " + west_json_record['losses'])
    create_ranking(rank, east_json_record['wins'], east_json_record['losses'], "east", east_name)
