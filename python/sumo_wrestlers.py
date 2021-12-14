#!/usr/bin/env python3

import requests
from bs4 import BeautifulSoup
import json

sumo_headers = {
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Connection": "keep-alive",
  "Host": "sumo.or.jp",
  "Referer": "https://sumo.or.jp/EnSumoDataRikishi/search/search",
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36"
}

sumo_data = {
  "p": 1,
  "v": 50,
  "kakuzuke_id": 1
}

page = requests.post('https://sumo.or.jp/EnSumoDataRikishi/search/', headers=sumo_headers,
  files = {
    'p': (None, sumo_data['p']),
    'v': (None, sumo_data['v']),
    'kakuzuke_id': (None, sumo_data['kakuzuke_id'])
  }
)

soup = BeautifulSoup(page.content, 'html.parser')
rows = soup.find("table", class_="mdTable3").find_all("tr")
for row in rows:
  data = row.find_all("td")
  wrestler = data[0].get_text().replace('\n', '')
  href = data[0].find("a")['href']
  #print(wrestler + "\t" + href)

page = requests.get('https://sumo.or.jp/EnSumoDataRikishi/profile/3321/index.php/', headers=sumo_headers)
print(page.text)
