from flask import (Blueprint, jsonify, request, g)
from .. import db
from ..data_fetcher import (fetch_stock_overview, fetch_stock_daily, add_stock_data)
from ..indicators import (calculate_sma, calculate_ema, calculate_macd)
from .auth import login_required

stock_api = Blueprint('debug', __name__, url_prefix='/api/debug')

@stock_api.route('/add_stock/<symbol>', methods=('GET',))
def add_stock(symbol):
    overview = fetch_stock_overview(symbol)
    daily = fetch_stock_daily(symbol)
    return jsonify({
        'overview': overview,
        'daily': daily
    })
