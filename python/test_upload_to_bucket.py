#!/usr/bin/env python3
from google.cloud import storage
import requests

storage_client = storage.Client()
bucket = storage_client.bucket('fantasy-sumo-409406.appspot.com')
blob = bucket.blob('sumo_icons/test.jpg')
sumo_headers = {
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Connection": "keep-alive",
  "Host": "sumo.or.jp",
  "Referer": "https://sumo.or.jp/EnSumoDataRikishi/search/search",
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36"
}
data = requests.get('https://sumo.or.jp/en/images/common/nav4.jpg', headers=sumo_headers).content
blob.upload_from_string(data)
print(data)
