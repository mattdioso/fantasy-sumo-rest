#!/usr/bin/env python3

import requests
from bs4 import BeautifulSoup
import json

#page = requests.get('https://sumowrestling.fandom.com/wiki/Kihonwaza')
#page = requests.get('https://sumowrestling.fandom.com/wiki/Nagete')
#page = requests.get('https://sumowrestling.fandom.com/wiki/Kakete')
#page = requests.get('https://sumowrestling.fandom.com/wiki/Hinerite')
#page = requests.get('https://sumowrestling.fandom.com/wiki/Sorite')
#page = requests.get('https://sumowrestling.fandom.com/wiki/Tokushuwaza')
#page = requests.get('https://sumowrestling.fandom.com/wiki/Hiwaza')
#page = requests.get('https://sumowrestling.fandom.com/wiki/Fusensho')
page = requests.get('https://sumowrestling.fandom.com/wiki/Kinjite')
soup = BeautifulSoup(page.content, 'html.parser')

headers = soup.find_all(class_="mw-headline")
paragraphs = soup.select("div p")
i = 0
for i in range(len(headers)):
  header_id = headers[i]['id'].split("_")[0]
  if header_id != 'Match':
    #print(header_id + "\t" + paragraphs[i+1].text)
    post_data = {
      "techniqueType": header_id,
      "techniqueDescr": paragraphs[i+1].text.replace('\n', '')
    }
    print(post_data)
    response = requests.post('http://localhost:3000/api/techniques', json=post_data)
"""
for header in headers:
  id = header['id'].split("_")[0]
  if id != 'Match':
    print(id)


for paragraph in paragraphs:
  if 'Kihonwaza' not in paragraph.text:
    print(paragraph.text)

"""
