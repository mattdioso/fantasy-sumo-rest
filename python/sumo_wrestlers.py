#!/usr/bin/env python3

import requests
from bs4 import BeautifulSoup
import json
import os
import datetime
from google.cloud import storage

def convert_date(date_string):
  d = datetime.datetime.strptime(date_string, '%B %d, %Y')
  d.strftime('%Y-%m-%d')
  return d.date()

def strip_height(height):
  return height.split('.')[0]

def strip_weight(weight):
  return weight.split('.')[0]

def upload_avatar(uri, name):
  base_url = "https://sumo.or.jp"
  print('requesting.... ' + base_url + uri)
  page = requests.get(base_url + uri, headers=sumo_headers)
  storage_client = storage.Client()
  bucket = storage_client.bucket("fantasy-sumo-409406.appspot.com")
  blob = bucket.blob('sumo_avatars/' + name + '.jpg')
  data = page.content
  if not blob.exists():
    blob.upload_from_string(data)
  with open("./sumo_pics/" + name + '.jpg', 'wb') as file:
    file.write(page.content)

def upload_icon(uri, name):
  base_url = "https://www.sumo.or.jp/img/sumo_data/rikishi/60x60/"
  sumo_filename = uri.split("/")
  sumo_filename = sumo_filename[len(sumo_filename) -1]
  print('requesting.... ' + base_url + sumo_filename)
  page = requests.get(base_url + uri, headers=sumo_headers)
  storage_client = storage.Client()
  bucket = storage_client.bucket("fantasy-sumo-409406.appspot.com")
  blob = bucket.blob('sumo_icons/' + name + '_icon.jpg')
  data = page.content
  if not blob.exists():
    blob.upload_from_string(data)
  with open("./sumo_icons/" + name + '.jpg', 'wb') as file:
    file.write(page.content)

def scrape_sumo_info(uri, name):
  page = requests.get(base_url + uri, headers=sumo_headers)
  soup = BeautifulSoup(page.content, 'html.parser')
  body = soup.find(id="mainContent").find_all(class_="mdColSet1")
  #print(body)
  try:
    img_uri = body[0].find("img")["src"]
  except:
    img_uri = ""
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
  """
  try:
    print(ring_name.split(' ')[0] + "\tFamily Name: " + names[1]+ "\tGiven Name: " + names[0] + "\t"  + rank + "\t" + dob + "\t" + pob + "\t" + height + "\t" + weight)
  except:
    print("ERROR")
    print(" ".join(names) + "\t" + ring_name)
  """
  if len(names) > 1:
    familyname = names[1]
    givenname = names[0]
  else:
    familyname = ""
    givenname=""
    print(ring_name.split(' ')[0] + "\tFamily Name: " + familyname+ "\tGiven Name: " + givenname + "\t"  + rank + "\t" + dob + "\t" + pob + "\t" + height + "\t" + weight)

  post_data = {
    "familyname": familyname,
    "givenname": givenname,
    "ringname": name,
    "birthdate": dob,
    "birthplace": pob,
    "height": int(height),
    "weight": int(weight),
    "retired": False,
    "avatar_store": "https://storage.googleapis.com/fantasy-sumo-409406.appspot.com/sumo_avatars/<ringname>.jpg".replace("<ringname>", name),
    "icon_store": "https://storage.googleapis.com/fantasy-sumo-409406.appspot.com/sumo_icons/<ringname>_icon.jpg".replace("<ringname>", name)
  }

  response = requests.post('https://fantasy-sumo-409406.uw.r.appspot.com/api/wrestlers', json=post_data)
  print(response.text)
  if not "exists" in response.text and img_uri != "":
    upload_avatar(img_uri, name)
    upload_icon(img_uri, name)

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
        'p': 1,
        'v': 50,
        'kakuzuke_id': 1
    }
)
soup = BeautifulSoup(page.content, 'html.parser')

count_p = 1
global_p = 10
num_sumo_wrestlers = 0
for i in range(6, 7):
    print("kakuzuke_id: " + str(i))
    count_p = 1
    while count_p <= global_p:
        print("page: " + str(count_p))
        page = requests.post(base_url + '/EnSumoDataRikishi/search/', headers=sumo_headers,
            files = {
                'p': (None, count_p),
                'v': 50,
                'kakuzuke_id': (None, i)
            }
        )
        soup = BeautifulSoup(page.content, 'html.parser')
        global_p = int(soup.find("span", class_="resSearch").get_text().split("pages:")[1].split(")")[0])
        count_p += 1

        rows = soup.find("table", class_="mdTable3").find_all("tr")
        #res = soup.find("span", class_="resSearch").get_text().split("pages:")[1].split(")")[0]
        for row in rows:
            data = row.find_all("td")
            wrestler = data[0].get_text().replace('\n', '')
            href = data[0].find("a")['href']
            print(wrestler + "\t" + href)
            num_sumo_wrestlers += 1
            scrape_sumo_info(href, wrestler)

print("total wrestlers processed: " + str(num_sumo_wrestlers))

