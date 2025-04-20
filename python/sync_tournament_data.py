#!/usr/bin/env python3
import requests
from bs4 import BeautifulSoup
import json
import os
import datetime
import uuid

BASE_URL = "https://fantasy-sumo-rest-api-dot-fantasy-sumo-409406.uw.r.appspot.com"

def convert_date(datestring):
    return datetime.datetime.strptime(datestring, "%B %d, %Y").strftime("%Y-%m-%d")

def process_record(record):
    parts = record.split("-")
    wins = parts[0]
    losses = parts[1]
    ret = {
        "wins": wins,
        "losses": losses
    }
    return ret

def tournament_exists(tournament_dates, location):
    datestart = convert_date(tournament_dates[0])
    dateend = convert_date(tournament_dates[1])
    dateobj = datetime.datetime.strptime(dateend, "%Y-%m-%d")
    
    month_year_filter = "{month:02d}-{year:d}".format(month=dateobj.month, year=dateobj.year)
    res = requests.get(BASE_URL + "/api/tournaments")
    ts = res.json()
    t = next((tournament for tournament in ts if tournament['month_year'] == month_year_filter), None)
    t_id = None
    if t is not None:
        t_id = t["id"]
    else:
        tournament_payload = {
            "name": "{month} {year:d} Tournament".format(month=dateobj.strftime("%B"), year=dateobj.year),
            "month_year": month_year_filter,
            "datestart": datestart,
            "dateend": dateend,
            "cancelled": 1,
            "location": location,
            "banzuke_id": str(uuid.uuid4())
        }
        res = requests.post(BASE_URL + "/api/tournaments", json=tournament_payload)
        t = res.json()
        t_id = t["id"]
    return t_id

def find_wrestler_id(wrestler):
  search_url= BASE_URL + "/api/wrestlers/search"
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

def create_ranking(tournament_id, rank, wins, losses, division, wrestler):
    wrestler_id = find_wrestler_id(wrestler)
    rank_payload = {
        "rank": rank,
        "idTournament": tournament_id,
        "wins": wins,
        "losses": losses,
        "division": division,
        "idWrestler": wrestler_id
    }
    rank_url = BASE_URL + "/api/rankings"
    res = requests.post(rank_url, json=rank_payload)
    print(res.json())

def sync_tournament(month, year):
    page = requests.get(banzuke_url.format(year=year, month=month))
    soup = BeautifulSoup(page.content, 'html.parser')
    layoutright = soup.find_all(class_="layoutright")[0]
    dates = layoutright.select("h3")
    if len(dates) > 0:
        dates = dates[0]
        ds = dates.text.split(" - ")
        loc = layoutright.select("h2")[0].text.split(",")[0]
        t_id = tournament_exists(ds, loc)
        tables = soup.find_all(class_="banzuke")
        #print(soup)
        # makuuchi (0) to Jonukuchi (6)
        for i in range(0, 6):
            body = tables[i].select("tbody")[0]
            rows = body.find_all("tr")
            for row in rows:
                tds = row.find_all("td")
                rank = tds[2].text
                if tds[0].text and tds[1].text:
                    try:
                        west_record = tds[0].a.text.split(" ")[0]
                        west_name = tds[1].a.text
                        west_json_record = process_record(west_record)
                    except:
                        west_record = tds[3].a.text.split(" ")[0]
                        west_name = tds[2].a.text
                        west_json_record = process_record(west_record)
                    print(west_name + "\t wins: " + west_json_record['wins'] + "\t losses: " + west_json_record['losses'])
                    create_ranking(t_id, rank, west_json_record['wins'], west_json_record['losses'], "west", west_name)
                if len(tds) > 4:
                    east_name = tds[3].a.text
                    east_record = tds[4].a.text.split(" ")[0]
                    east_json_record = process_record(east_record)
                    print(east_name + "\t wins: " + east_json_record['wins'] + "\t losses: " + west_json_record['losses'])
                    create_ranking(t_id, rank, east_json_record['wins'], east_json_record['losses'], "east", east_name)

if __name__ == "__main__":
    banzuke_url = "http://sumodb.sumogames.de/Banzuke.aspx?b={year:d}{month:02d}&heya=-1&shusshin=-1"
    years = [2024, 2025]
    months = [1, 3, 5, 7, 9, 11]
    for y in years:
        for m in months:
            if y == 2024 and m == 1:
                continue
            sync_tournament(m, y)