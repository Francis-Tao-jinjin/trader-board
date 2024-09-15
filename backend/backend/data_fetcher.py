import requests
import certifi
import os
import logging
from . import db
from .api.utils.exceptions import APILimitReachedException

ALPHA_VANTAGE_API_KEY = os.environ.get('API_KEY')
BASE_URL = 'https://www.alphavantage.co/query'

def check_is_api_limit_reached(data):
    if 'Information' in data and '25 requests' in data['Information']:
        return True
    return False

def fetch_stock_overview(symbol):
    params = {
        'function': 'OVERVIEW',
        'symbol': symbol,
        'apikey': ALPHA_VANTAGE_API_KEY
    }
    try:
        response = requests.get(BASE_URL, params=params, verify=False)
        response.raise_for_status()
        data = response.json()
        
        if check_is_api_limit_reached(data):
            raise APILimitReachedException('API limit reached')
        return data
    except APILimitReachedException as e:
        raise e
    except requests.exceptions.RequestException as e:
        logging.error(f'HTTP Request failed for {symbol} overview: {e}')
        return None
    except requests.exceptions.SSLError as e:
        logging.error(f'SSL Error for {symbol} overview: {e}')
        return None
    except Exception as e:
        logging.error(f'Error fetching stock data for {symbol} overview: {e}')
        return None
    

def fetch_stock_daily(symbol):
    params = {
        'function': 'TIME_SERIES_DAILY',
        'symbol': symbol,
        'apikey': ALPHA_VANTAGE_API_KEY
    }
    try:
        response = requests.get(BASE_URL, params=params, verify=False)
        response.raise_for_status()
        data = response.json()
        return data.get('Time Series (Daily)', {})
    except requests.exceptions.RequestException as e:
        logging.error(f'HTTP Request failed for {symbol} daily: {e}')
        return None
    except requests.exceptions.SSLError as e:
        logging.error(f'SSL Error for {symbol} daily: {e}')
        return None
    except Exception as e:
        logging.error(f'Error fetching stock data for {symbol} daily: {e}')
        return None

def add_stock_data(db_conn, symbol, overview_data, daily_data):
    try:
        if overview_data is not None:
            db_conn.execute(
                '''INSERT INTO stocks_info(
                    symbol, 
                    name, 
                    exchange, 
                    industry, 
                    website, 
                    description, 
                    sector, 
                    eps, 
                    market_capitalization, 
                    fiftytwo_week_high, 
                    fiftytwo_week_low)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                (   symbol,
                    overview_data.get('Name'),
                    overview_data.get('Exchange'),
                    overview_data.get('Industry'),
                    overview_data.get('OfficialSite'),
                    overview_data.get('Description'),
                    overview_data.get('Sector'),
                    overview_data.get('EPS'),
                    overview_data.get('MarketCapitalization'),
                    overview_data.get('52WeekHigh'),
                    overview_data.get('52WeekLow')
                )
            )
        
        all_dates_record = db_conn.execute('''
            SELECT date FROM stocks_daily WHERE symbol = ? ORDER BY date
            ''', (symbol,)).fetchall()
        all_dates = [record['date'] for record in all_dates_record]
        new_entries = []
        for date, values in daily_data.items():
            if date not in all_dates:
                new_entries.append((symbol, date, values['1. open'], values['2. high'], values['3. low'], values['4. close'], values['5. volume']))
        if new_entries:
            db_conn.executemany(
                '''INSERT INTO stocks_daily(symbol, date, open, high, low, close, volume)
                VALUES (?, ?, ?, ?, ?, ?, ?)''', new_entries)
        db_conn.commit()
    except Exception as e:
        logging.error(f'Error inseting stock data for {symbol} into database: {e}')


# Old code for reference
def fetch_stock_data(symbol):
    params = {
        'function': 'TIME_SERIES_DAILY',
        'symbol': symbol,
        'apikey': ALPHA_VANTAGE_API_KEY
    }
    try: 
        # print('Using certifi:', certifi.where())
        response = requests.get(BASE_URL, params=params, verify=False)
        response.raise_for_status() 
        data = response.json()
        # date is key, values is dict of data
        if 'Time Series (Daily)' in data:
            save_to_db(symbol, data['Time Series (Daily)'])
            return data['Time Series (Daily)']
        else:
            logging.error(f'Error fetching stock data for {symbol}: {data}')
            return None
    except requests.exceptions.RequestException as e:
        logging.error(f'HTTP Request failed for {symbol}: {e}')
        return None
    except requests.exceptions.SSLError as e:
        logging.error(f'SSL Error for {symbol}: {e}')
        return None
    except Exception as e:
        logging.error(f'Error fetching stock data for {symbol}: {e}')
        return None


# Example of time_series:
# {
#     "Time Series (Daily)": {
#             "2024-09-13": {
#                 "1. open": "223.5800",
#                 "2. high": "224.0400",
#                 "3. low": "221.9100",
#                 "4. close": "222.5000",
#                 "5. volume": "36766619"
#             },
#             "2024-09-12": {
#                 "1. open": "222.5000",
#                 "2. high": "223.5500",
#                 "3. low": "219.8200",
#                 "4. close": "222.7700",
#                 "5. volume": "37498225"
#             },
#     }
# }

def save_to_db(symbol, time_series):
    try:
        db_conn = db.get_db()

        all_dates_record = db_conn.execute('''
            SELECT date FROM stocks_daily WHERE symbol = ? ORDER BY date
            ''', (symbol,)).fetchall()
        all_dates = [record['date'] for record in all_dates_record]
        # print('>>>> all_dates:', all_dates)
        new_entries = []
        for date, values in time_series.items():
            if date not in all_dates:
                new_entries.append((symbol, date, values['1. open'], values['2. high'], values['3. low'], values['4. close'], values['5. volume']))
        # print('>>>> new_entries:', new_entries)
        if new_entries:
            db_conn.executemany(
                '''INSERT INTO stocks_daily(symbol, date, open, high, low, close, volume)
                VALUES (?, ?, ?, ?, ?, ?, ?)''', new_entries)
        # for date, values in time_series.items():
        #     db_conn.execute(
        #         '''INSERT INTO stocks_daily(symbol, date, open, high, low, close, volume)
        #         VALUES (?, ?, ?, ?, ?, ?, ?)''',
        #         (symbol, date, values['1. open'], values['2. high'], values['3. low'], values['4. close'], values['5. volume']))
        db_conn.commit()
        db_conn.close()
    except Exception as e:
        logging.error(f'Error inseting stock data for {symbol} into database: {e}')
    finally:
        db_conn.close()
