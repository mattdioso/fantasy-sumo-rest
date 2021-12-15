#!/usr/bin/env python3

import requests


sumo_headers = {
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Connection": "keep-alive",
  "Host": "sumo.or.jp",
  "Referer": "https://sumo.or.jp/EnSumoDataRikishi/search/search",
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36"
}

page = requests.get('https://sumo.or.jp/img/sumo_data/rikishi/270x474/20110008.jpg', headers=sumo_headers)
with open('20110008.jpg', 'wb') as file:
  file.write(page.content)

