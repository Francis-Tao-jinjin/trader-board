import pandas as pd
import math
from . import db

def convert_nan_to_none(records):
    for item in records:
        for key, value in item.items():
            if pd.isna(value):
                item[key] = None
    return records

def calculate_sma(symbol, window):
    db_conn = db.get_db()
    query = f"SELECT date, close FROM stocks_daily WHERE symbol = '{symbol}' ORDER BY date"
    # data frame from Pandas
    df = pd.read_sql(query, db_conn, parse_dates=['date'])
    db_conn.close()
    if df.empty:
        return None
    else:
        df.set_index('date', inplace=True)
        df[f'SMA'] = df['close'].rolling(window=window).mean()
        result = df.reset_index().to_dict('records')
        convert_nan_to_none(result)
        return result
    
def calculate_ema(symbol, window):
    db_conn = db.get_db()
    query = f"SELECT date, close FROM stocks_daily WHERE symbol = '{symbol}' ORDER BY date"
    df = pd.read_sql(query, db_conn, parse_dates=['date'])
    db_conn.close()
    if df.empty:
        return None
    else:
        df.set_index('date', inplace=True)
        df[f'EMA'] = df['close'].ewm(span=window, adjust=False).mean()
        result = df.reset_index().to_dict('records')
        convert_nan_to_none(result)
        return result

def calculate_macd(symbol):
    db_conn = db.get_db()
    query = f"SELECT date, close FROM stocks_daily WHERE symbol = '{symbol}' ORDER BY date"
    df = pd.read_sql(query, db_conn, parse_dates=['date'])
    db_conn.close()
    if df.empty:
        return None
    else:
        df.set_index('date', inplace=True)
        df['26_EMA'] = df['close'].ewm(span=26, adjust=False).mean()
        df['12_EMA'] = df['close'].ewm(span=12, adjust=False).mean()
        df['MACD'] = df['12_EMA'] - df['26_EMA']
        df['Signal'] = df['MACD'].ewm(span=9, adjust=False).mean()
        df['Histogram'] = df['MACD'] - df['Signal']
        result = df.reset_index().to_dict('records')
        convert_nan_to_none(result)
        return result
