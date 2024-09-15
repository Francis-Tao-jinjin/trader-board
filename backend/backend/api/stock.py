from flask import (Blueprint, jsonify, request, g)
from .. import db
from ..data_fetcher import (fetch_stock_overview, fetch_stock_daily, add_stock_data)
from ..indicators import (calculate_sma, calculate_ema, calculate_macd)
from .auth import login_required
from .utils.exceptions import APILimitReachedException

stock_api = Blueprint('stock', __name__, url_prefix='/api/stock')

@stock_api.route('/add_stock/<symbol>', methods=('POST',))
@login_required
def add_stock(symbol):
    # For simplicity, we fetch data each time
    # result = fetch_stock_data(symbol)
    db_conn = db.get_db()
    count = db_conn.execute('SELECT COUNT(*) FROM stocks_info WHERE symbol = ?', (symbol,)).fetchone()[0]
    try:
        if count == 0:
            overview_data = fetch_stock_overview(symbol)
            daily_data = fetch_stock_daily(symbol)
            add_stock_data(db_conn, symbol, overview_data, daily_data)
        else:
            daily_data = fetch_stock_daily(symbol)
            add_stock_data(db_conn, symbol, None, daily_data)
    except APILimitReachedException as e:
        return jsonify({
            'error': f'API limit reached from alphavantage: standard API rate limit is 25 requests per day'
        }), 429
    except Exception as e:
        return jsonify({
            'error': f'Error adding data for {symbol}: {e}'
        }), 500
    user_id = g.user['id']
    result = db_conn.execute('SELECT id FROM stocks_info WHERE symbol = ?', (symbol,)).fetchone()
    if result is None:
        return jsonify({
            'error': f'No data found for {symbol}'
        }), 404
    if count == 0:
        stock_id = result['id']
        db_conn.execute('INSERT INTO user_stocks(user_id, stock_id) VALUES (?, ?)', (user_id, stock_id))
        db_conn.commit()
    db_conn.close()
    return jsonify({
        'message': f'Data for {symbol} added successfully',
        'status': 'success'
    }), 201

# get all stocks for a user
@stock_api.route('/user/list', methods=('GET',))
@login_required
def get_user_stock_list():
    user_id = g.user['id']
    db_conn = db.get_db()
    stocks = db_conn.execute('''
        SELECT s.symbol, s.name, s.exchange, s.industry, s.website, s.description, s.sector, s.eps, s.market_capitalization, s.fiftytwo_week_high, s.fiftytwo_week_low
        FROM stocks_info s
        JOIN user_stocks us ON s.id = us.stock_id
        WHERE us.user_id = ?
    ''', (user_id,)).fetchall()
    db_conn.close()
    stocks_list = [dict(stock) for stock in stocks]
    return jsonify({
        'data': stocks_list,
        'status': 'success'
    }), 200

@stock_api.route('/daily/<symbol>', methods=('GET',))
@login_required
def get_user_stock_daily(symbol):
    db_conn = db.get_db()
    stock_data = db_conn.execute('''
        SELECT date, open, high, low, close, volume FROM stocks_daily WHERE symbol = ? ORDER BY date
    ''', (symbol,)).fetchall()
    db_conn.close()
    if not stock_data:
        return jsonify({
            'error': f'No data found for {symbol}'
        }), 404
    daily_record_list = [dict(daily_record) for daily_record in stock_data]
    return jsonify({
        'data': {
            'symbol': symbol,
            'daily_record': daily_record_list
        },
        'status': 'success'
    }), 200


@stock_api.route('/<symbol>/sma', methods=('GET',))
def get_sma(symbol):
    # Default window size is 20
    window = int(request.args.get('window', 20))
    sma_data = calculate_sma(symbol, window)
    if sma_data is None:
        return jsonify({
            'error': f'No data found for {symbol}',
        }), 404
    else: 
        return jsonify({
            'data': sma_data,
            'status': 'success'
        }), 200

@stock_api.route('/<symbol>/ema', methods=('GET',))
def get_ema(symbol):
    # Default window size is 20
    window = int(request.args.get('window', 20))
    ema_data = calculate_ema(symbol, window)
    if ema_data is None:
        return jsonify({
            'error': f'No data found for {symbol}'
        }), 404
    else:
        return jsonify({
            'data': ema_data,
            'status': 'success'
        }), 200

@stock_api.route('/<symbol>/macd', methods=('GET',))
def get_macd(symbol):
    macd_data = calculate_macd(symbol)
    if macd_data is None:
        return jsonify({
            'error': f'No data found for {symbol}'
        }), 404
    else:
        return jsonify({
            'data': macd_data,
            'status': 'success'
        }), 200