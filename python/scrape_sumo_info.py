#!/usr/bin/env python3
import requests
from bs4 import BeautifulSoup
import json
import datetime

def convert_date(date_string):
  d = datetime.datetime.strptime(date_string, '%B %d, %Y')
  d.strftime('%Y-%m-%d')
  return d.date()

def strip_height(height):
  return height.split('.')[0]

def strip_weight(weight):
  return weight.split('.')[0]

sumo_headers = {
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Connection": "keep-alive",
  "Host": "sumo.or.jp",
  "Referer": "https://sumo.or.jp/EnSumoDataRikishi/search/search",
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36"
}

page = requests.get('https://sumo.or.jp/EnSumoDataRikishi/profile/3012/index.php', headers=sumo_headers)
soup = BeautifulSoup(page.content, 'html.parser')
body = soup.find(id="mainContent").find_all(class_="mdColSet1")
img_uri = body[0].find("img")["src"]
print(img_uri)
rows = body[0].find_all("tr")
ring_name=rows[0].find("td").text.replace('\n', '').strip()

family_name=rows[2].find("td").text.replace('\n', '').strip()

rank=rows[4].find("td").text.replace('\n', '').strip()

dob=rows[5].find("td").text.replace('\n', '').strip()

pob=rows[6].find("td").text.replace('\n', '').strip()

height=rows[7].find("td").text.replace('\n', '').strip()

weight=rows[8].find("td").text.replace('\n', '').strip()
dob=str(convert_date(dob))
height = strip_height(height)
weight = strip_weight(weight)
names = family_name.split(' ')
print(ring_name.split(' ')[0] + "\tFamily Name: " + names[1]+ "\tGiven Name: " + names[0] + "\t"  + rank + "\t" + dob + "\t" + pob + "\t" + height + "\t" + weight)


