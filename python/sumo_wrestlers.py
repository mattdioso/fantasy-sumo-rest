#!/usr/bin/env python3

import requests
from bs4 import BeautifulSoup
import json
import os
import datetime

def convert_date(date_string):
  d = datetime.datetime.strptime(date_string, '%B %d, %Y')
  d.strftime('%Y-%m-%d')
  return d.date()

def strip_height(height):
  return height.split('.')[0]

def strip_weight(weight):
  return weight.split('.')[0]

def download_avatar(uri, name):
  print('requesting.... ' + base_url + uri)
  page = requests.get(base_url + uri, headers=sumo_headers)
  with open("./sumo_pics/" + name + '.jpg', 'wb') as file:
    file.write(page.content)

def scrape_sumo_info(uri, name):
  page = requests.get(base_url + uri, headers=sumo_headers)
  soup = BeautifulSoup(page.content, 'html.parser')
  body = soup.find(id="mainContent").find_all(class_="mdColSet1")
  img_uri = body[0].find("img")["src"]
  rows = body[0].find_all("tr")
  ring_name = rows[0].find("td").text.replace('\n', '').strip()
  family_name = rows[2].find("td").text.replace('\n', '').strip()
  rank = rows[4].find("td").text.replace('\n', '').strip()
  dob = rows[5].find("td").text.replace('\n', '').strip()
  pob = rows[6].find("td").text.replace('\n', '').strip()
  height = rows[7].find("td").text.replace('\n', '').strip()
  weight = rows[8].find("td").text.replace('\n', '').strip()

  dob = str(convert_date(dob))
  height = strip_height(height)
  weight = strip_weight(weight)
  names = family_name.split(' ')
  print(ring_name.split(' ')[0] + "\tFamily Name: " + names[1]+ "\tGiven Name: " + names[0] + "\t"  + rank + "\t" + dob + "\t" + pob + "\t" + height + "\t" + weight)

  post_data = {
    "familyname": names[1],
    "givenname": names[0],
    "ringname": name,
    "birthdate": dob,
    "birthplace": pob,
    "height": int(height),
    "weight": int(weight),
    "retired": False
  }

  response = requests.post('http://localhost:5000/api/wrestlers', json=post_data)
  print(response.text)
  #download_avatar(img_uri, name)

if not os.path.exists('./sumo_pics'):
  os.makedirs('./sumo_pics')

sumo_headers = {
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Connection": "keep-alive",
  "Host": "sumo.or.jp",
  "Referer": "https://sumo.or.jp/EnSumoDataRikishi/search/search",
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36"
}

"""
kakuzuke_id=1 for Makuuchi Division, kakuzuke_id=2 for Juryo Division
"""
sumo_data = {
  "p": 4,
  "v": 50,
  "kakuzuke_id": 5 
}

base_url = "https://sumo.or.jp"

page = requests.post(base_url + '/EnSumoDataRikishi/search/', headers=sumo_headers,
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
  print(wrestler + "\t" + href)
  scrape_sumo_info(href, wrestler)



