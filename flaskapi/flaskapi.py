from flask import Flask, g, jsonify, request
import sqlite3
from scraper import create_tables, get_historical_data, get_quote_data
from flask_cors import CORS
import requests

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "*"}})



# Initialize SQLite connection and cursor for each thread
def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect('db.sqlite3')
    return db

# Check if table exists in db
def table_exists(cursor, table_name):
    cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name=?", (table_name,))
    return cursor.fetchone() is not None

def check_hist(cursor, symbol):
    # check table exists first
    if not table_exists(cursor, f'historical_data_{symbol}'):
        create_tables(cursor, symbol)
    # always scrape again for now
    get_historical_data(cursor, symbol)

def check_quote(cursor, symbol):
    # check table exists first
    if not table_exists(cursor, f'quote_data_{symbol}'):
        create_tables(cursor, symbol)
    # always scrape again for now
    get_quote_data(cursor, symbol)

# Get column names
def get_column_names(cursor, table_name):
    cursor.execute(f"PRAGMA table_info({table_name})")
    columns = cursor.fetchall()
    return [column[1] for column in columns]

# Get data from db
def get_data(cursor, symbol, data_type):
    table_name = f"{data_type}_data_{symbol}"
    cursor.execute(f"SELECT * FROM {table_name}")
    data = cursor.fetchall()

    column_names = get_column_names(cursor, table_name)

    result = []
    for row in data:
        result.append(dict(zip(column_names, row)))

    return result

# API call for historical data
@app.route('/api/historical_data', methods=['GET'])
def get_historical_data_api():
    symbol = request.args.get('symbol')
    
    if not symbol:
        return jsonify({'error': 'Symbol is required. Please provide a valid stock symbol.'}), 400

    conn = get_db()
    cursor = conn.cursor()

    check_hist(cursor, symbol)

    historical_data = get_data(cursor, symbol, 'historical')

    conn.close()

    data = {
        'symbol': symbol,
        'historical_data': historical_data,
    }

    return jsonify(data)

# API call for quote data
@app.route('/api/quote_data', methods=['GET'])
def get_quote_data_api():
    symbol = request.args.get('symbol')
    
    if not symbol:
        return jsonify({'error': 'Symbol is required. Please provide a valid stock symbol.'}), 400

    conn = get_db()
    cursor = conn.cursor()

    check_quote(cursor, symbol)

    quote_data = get_data(cursor, symbol, 'quote')

    conn.close()

    data = {
        'symbol': symbol,
        'quote_data': quote_data,
    }

    return jsonify(data)

# API call for chart data
@app.route('/api/chart_data', methods=['GET'])
def get_chart_data_api():
    symbol = request.args.get('symbol')
    interval = request.args.get('interval')
    range = request.args.get('range')

    url = f'https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?region=US&lang=en-US&includePrePost=false&interval={interval}&useYfid=true&range={range}&corsDomain=finance.yahoo.com&.tsrc=finance'
    
    if not symbol:
        return jsonify({'error': 'Symbol is required. Please provide a valid stock symbol.'}), 400

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }

    response = requests.get(url, headers=headers)

    return response.text

# API call for yahoo hidden api (this will take load off scraper)
@app.route('/api/hidden_quote_data', methods=['GET'])
def get_hidden_quote_data_api():
    symbol = request.args.get('symbol')
    url = f'https://query1.finance.yahoo.com/v7/finance/quote?&symbols={symbol}&fields=currency,fromCurrency,toCurrency,exchangeTimezoneName,exchangeTimezoneShortName,gmtOffSetMilliseconds,regularMarketChange,regularMarketChangePercent,regularMarketPrice,regularMarketTime,preMarketTime,postMarketTime,extendedMarketTime&crumb=rGgWb3MtRp/&formatted=false&region=US&lang=en-US'
    # https://query1.finance.yahoo.com/v7/finance/quote?fields=longName%2CregularMarketPrice%2CregularMarketChange%2CregularMarketChangePercent%2CshortName&formatted=true&imgHeights=50&imgLabels=logoUrl&imgWidths=50&symbols=OSK%2CVSCO%2C%5EGSPC&lang=en-US&region=US&crumb=rGgWb3MtRp%2F
    if not symbol:
        return jsonify({'error': 'Symbol is required. Please provide a valid stock symbol.'}), 400

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Cookie': 'gam_id=y-jXxbY1ZE2uL1UJsoL19lHhhWjSshc3Ge~A; tbla_id=f99c236b-7cd5-436b-9009-0a39919f3744-tuct8305701; GUC=AQEBCAFlhfhlt0IdkgSP&s=AQAAABJH4d3g&g=ZYSxtg; A1=d=AQABBNsyNWECELOer7sWjFpoXpiM6MlGEZ0FEgEBCAH4hWW3ZdxY0iMA_eMBAAcI2zI1YclGEZ0&S=AQAAAvEjCcZzDWykPUJIdMKPujI; A3=d=AQABBNsyNWECELOer7sWjFpoXpiM6MlGEZ0FEgEBCAH4hWW3ZdxY0iMA_eMBAAcI2zI1YclGEZ0&S=AQAAAvEjCcZzDWykPUJIdMKPujI; axids=gam=y-jXxbY1ZE2uL1UJsoL19lHhhWjSshc3Ge~A&dv360=eS1IUTA5eS45RTJ1R2JOc2dGakt3eTNPRHdtQjlycTgyRn5B&ydsp=y-TC_bu3dE2uKfpzxd1UkB9Agz7yYuViZ3~A; gpp=DBAA; gpp_sid=-1; A1S=d=AQABBNsyNWECELOer7sWjFpoXpiM6MlGEZ0FEgEBCAH4hWW3ZdxY0iMA_eMBAAcI2zI1YclGEZ0&S=AQAAAvEjCcZzDWykPUJIdMKPujI; cmp=t=1705181541&j=0&u=1YNN; PRF=newChartbetateaser%3D1%26t%3DGOOG%252BNVDA%252BAAPL%252BOSK%252BVSCO%252BTSLA%252B%255EGSPC'
    }

    response = requests.get(url, headers=headers)
    
    return response.text


# Close connection when the app stops
def close_conn(exception=None):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

if __name__ == '__main__':
    with app.app_context():
        conn = get_db()
        cursor = conn.cursor()
        close_conn()
    app.run(host='0.0.0.0', port=5000, debug=True)
