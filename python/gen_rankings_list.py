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
    "idTournament": "1faf296f-1e65-4572-8ad5-7d977c200cc5",
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
  results = res.json()
  wrestler_id = ""
  for wrestler_json in results:
      if wrestler_json['ringname'] == wrestler:
          wrestler_id = wrestler_json['id']
  return wrestler_id

banzuke_url = "http://sumodb.sumogames.de/Banzuke.aspx?b=202311&heya=-1&shusshin=-1#J"
page = requests.get(banzuke_url)
soup = BeautifulSoup(page.content, 'html.parser')
tables = soup.find_all(class_="banzuke")
ranks = []
for i in range(0, 6):
    body = tables[i].select("tbody")[0]
    rows = body.find_all("tr")
    for row in rows:
        tds = row.find_all("td")
        rank = tds[2].text
        ranks.append(rank)

print(ranks)
