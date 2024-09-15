import json

with open('stocks_daily.json', 'r') as file:
    data = json.load(file)

for item in data['features']:
    if item['symbol'] not in data:
        data[item['symbol']] = []
    
    data[item['symbol']].append(item)
    # proppel the properties filed as feature itself
    # feature.update(feature.pop('properties'))
    # del feature['type']
    # del feature['geometry']
del data['features']

with open('stocks_daily_modified.json', 'w') as file:
    json.dump(data, file, indent=2)

print("JSON process finished stocks_daily_modified.json")