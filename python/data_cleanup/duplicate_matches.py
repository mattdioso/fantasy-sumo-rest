#!/usr/bin/env python3
import requests
import json

tournament_id = "1faf296f-1e65-4572-8ad5-7d977c200cc5"
res = requests.get('https://fantasy-sumo-409406.uw.r.appspot.com/api/tournaments/' + tournament_id)
tournament = res.json()
#print(tournament['matches'])
duplicates = set()
for i in range(1, 16):
    print(i)
    wrestlers = set()
    day_matches = [x for x in tournament['matches'] if x['day'] == i]
    for match in day_matches:
        wrestler1 = match['wrestler1']
        wrestler2 = match['wrestler2']
        if wrestler1['ringname'] == 'Takakeisho' and wrestler2['ringname'] == 'Hokutofuji':
            print(match['id'])
        if wrestler1['ringname'] in wrestlers:
            print('already have a match for: ' + wrestler1['ringname'])
            duplicates.add(match['id'])
        else:
            wrestlers.add(wrestler1['ringname'])

        if wrestler2['ringname'] in wrestlers:
            print('already have a match for: ' + wrestler2['ringname'])
            duplicates.add(match['id'])
        else:
            wrestlers.add(wrestler2['ringname'])

print('deleting dupes now')
for dupe in duplicates:
    print(dupe)
    res = requests.delete('https://fantasy-sumo-409406.uw.r.appspot.com/api/matches/' + dupe)
    print(res.status_code)
print('done')
