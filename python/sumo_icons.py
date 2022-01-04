#!/usr/bin/env python3

import requests
from bs4 import BeautifulSoup
import json
import os
import datetime

sumo_headers = {
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Connection": "keep-alive",
  "Host": "sumo.or.jp",
  "Referer": "https://sumo.or.jp/EnSumoDataRikishi/search/search",
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36"
}

def download_icon(uri, name):
  print('requesting.... ' + icon_url + uri)
  page = requests.get(icon_url + uri, headers=sumo_headers)
  with open("./sumo_icons/" + name + "_icon.jpg", 'wb') as file:
    file.write(page.content)

if not os.path.exists('./sumo_icons'):
  os.makedirs('./sumo_icons')

base_url = "https://sumo.or.jp"
icon_url = "https://www.sumo.or.jp/img/sumo_data/rikishi/60x60/"

sumo_data = {
  "kakuzuke_id": 2,
  "basho_id": 609,
  "page": 1
}

page = requests.post(base_url + '/EnHonbashoBanzuke/index_ajax/2/1', headers=sumo_headers,
  files = {
    'kakuzuke_id': (None, sumo_data['kakuzuke_id']),
    'basho_id': (None, sumo_data['basho_id']),
    'page': (None, sumo_data['page'])
  }
)

banzuke_info = page.json()['BanzukeTable']
for row in banzuke_info:
  if row['shikona'] and row['photo']:
    name = row['shikona']
    filename= row['photo']
    print(name + '\t' + filename)
    download_icon(filename, name)
