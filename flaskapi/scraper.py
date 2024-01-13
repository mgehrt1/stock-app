
import csv
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pandas as pd
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from io import StringIO
import sqlite3
from selenium.common.exceptions import NoSuchElementException
import requests

def create_tables(cursor, symbol):

    cursor.execute(f'''
        DROP TABLE IF EXISTS historical_data_{symbol}
    ''')
    # create table for historical data
    cursor.execute(f'''
        CREATE TABLE IF NOT EXISTS historical_data_{symbol} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            open TEXT,
            high TEXT,
            low TEXT,
            close TEXT,
            adj_close TEXT,
            volume TEXT,
            UNIQUE(id)
        )
    ''')

    cursor.execute(f'''
        DROP TABLE IF EXISTS quote_data_{symbol}
    ''')

    # Create table for quote data
    cursor.execute(f'''
        CREATE TABLE IF NOT EXISTS quote_data_{symbol} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            regular_market_price TEXT,
            regular_market_change TEXT,
            regular_market_change_percent TEXT,
            post_market_price TEXT,
            post_market_change TEXT,
            post_market_change_percent TEXT,
            previous_close TEXT,
            open TEXT,
            bid TEXT,
            ask TEXT,
            days_range TEXT,
            fifty_two_wk_range TEXT,
            volume TEXT,
            avg_volume TEXT,
            exchange TEXT,
            display_name TEXT,
            UNIQUE(id)
        )
    ''')



# function to scrape historical data
def get_historical_data(cursor, symbol):
    url = f'https://finance.yahoo.com/quote/{symbol}/history?p={symbol}'
    
    options = Options()
    options.add_argument('--headless')
    
    driver = webdriver.Chrome(options=options)

    driver.get(url)
    tables = driver.find_elements("tag name", "table")
    table = tables[0]
    header_row = table.find_element("tag name", "thead").find_element("tag name", "tr")
    column_names = [col.text for col in header_row.find_elements("tag name", "th")]
    rows = table.find_elements("tag name", "tr")
    array = []
    for row in rows:
        cols = row.find_elements("tag name", "td")
        list = []
        for col in cols:
            list.append(col.text)
        array.append(list)
    scraped_data = pd.DataFrame(array, columns=column_names).dropna(how='all')
    scraped_data = scraped_data.drop(scraped_data.index[-1])

    driver.close()

    # print(scraped_data.values)

    # Insert data into the dynamically named table
    cursor.executemany(f'''
        INSERT OR REPLACE INTO historical_data_{symbol} (date, open, high, low, close, adj_close, volume)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', scraped_data.values)
    
    return scraped_data

# function to scrape quote data
def get_quote_data(cursor, symbol):
    url = f'https://finance.yahoo.com/quote/{symbol}?p={symbol}'

    options = webdriver.ChromeOptions()
    service = Service()
    options.add_argument('--headless')
    options.add_experimental_option(
        "prefs", {
            # block image loading
            "profile.managed_default_content_settings.images": 2,
        }
    )
 
    
    driver = webdriver.Chrome(options=options, service=service)

    driver.get(url)

    regular_market_price = driver.find_element(By.CSS_SELECTOR, f'[data-symbol="{symbol}"][data-field="regularMarketPrice"]').text

    regular_market_change = driver.find_element(By.CSS_SELECTOR, f'[data-symbol="{symbol}"][data-field="regularMarketChange"]').text

    regular_market_change_percent = driver.find_element(By.CSS_SELECTOR, f'[data-symbol="{symbol}"][data-field="regularMarketChangePercent"]').text.replace('(', '').replace(')', '')

    previous_close = driver.find_element(By.CSS_SELECTOR, f'[data-test="PREV_CLOSE-value"]').text

    open = driver.find_element(By.CSS_SELECTOR, f'[data-test="OPEN-value"]').text

    bid = driver.find_element(By.CSS_SELECTOR, f'[data-test="BID-value"]').text

    ask = driver.find_element(By.CSS_SELECTOR, f'[data-test="ASK-value"]').text

    days_range = driver.find_element(By.CSS_SELECTOR, f'[data-test="DAYS_RANGE-value"]').text

    fifty_two_wk_range = driver.find_element(By.CSS_SELECTOR, f'[data-test="FIFTY_TWO_WK_RANGE-value"]').text

    volume = driver.find_element(By.CSS_SELECTOR, f'[data-test="TD_VOLUME-value"]').text

    avg_volume = driver.find_element(By.CSS_SELECTOR, f'[data-test="AVERAGE_VOLUME_3MONTH-value"]').text


    exchange_div = driver.find_element(By.XPATH, "//div[@class='C($tertiaryColor) Fz(12px)']")

    exchange_text = exchange_div.find_element(By.TAG_NAME, "span").text

    exchange = exchange_text.split('-')

    exchange = exchange[0].strip()

    display_name_text = driver.find_element(By.XPATH, "//h1[@class='D(ib) Fz(18px)']").text

    display_name = display_name_text.split('(')

    display_name = display_name[0].strip()

    print(display_name)
    


    try:
        post_market_price = driver.find_element(By.CSS_SELECTOR, f'[data-symbol="{symbol}"][data-field="postMarketPrice"]').text

        post_market_change = driver.find_element(By.CSS_SELECTOR, f'[data-symbol="{symbol}"][data-field="postMarketChange"]').text

        post_market_change_percent = driver.find_element(By.CSS_SELECTOR, f'[data-symbol="{symbol}"][data-field="postMarketChangePercent"]').text.replace('(', '').replace(')', '')

    except NoSuchElementException:
        # Handle the case where post-market information is not available
        post_market_price = None
        post_market_change = None
        post_market_change_percent = None

    quote_data = {
        'regular_market_price': regular_market_price,
        'regular_market_change': regular_market_change,
        'regular_market_change_percent': regular_market_change_percent,
        'post_market_price': post_market_price,
        'post_market_change': post_market_change,
        'post_market_change_percent': post_market_change_percent,
        'previous_close': previous_close,
        'open': open,
        'bid': bid,
        'ask': ask,
        'days_range': days_range,
        'fifty_two_wk_range': fifty_two_wk_range,
        'volume': volume,
        'avg_volume': avg_volume,
        'exchange': exchange,
        'display_name': display_name
    }
    
    driver.close()

    # Convert the quote_data dictionary to a DataFrame
    quote_df = pd.DataFrame([quote_data])

        # Insert data into the dynamically named table
    cursor.executemany(f'''
        INSERT OR REPLACE INTO quote_data_{symbol} (regular_market_price, regular_market_change, 
                                          regular_market_change_percent, post_market_price, 
                                          post_market_change, post_market_change_percent, previous_close, 
                                          open, bid, ask, days_range, fifty_two_wk_range, volume, avg_volume, exchange, display_name)   
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', quote_df.values)

    return quote_df

def drop_all_tables(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Get drop statements
    cursor.execute("SELECT 'DROP TABLE IF EXISTS ' || name || ';' FROM sqlite_master WHERE type = 'table' AND name != 'sqlite_sequence';")
    drop_statements = cursor.fetchall()

    # Execute drop statements
    for statement in drop_statements:
        cursor.execute(statement[0])

    # Commit and close the connection
    conn.commit()
    conn.close()

# # Replace 'your_database_path.db' with the actual path to your SQLite database file
##drop_all_tables('db.sqlite3') this is for changing table structure, must delete otherwise get
    ## error quote_data_### has no column named ""

# symbol = 'NVDA'
# conn = sqlite3.connect('db.sqlite3')

# get_chart_data('AAPL')

# with conn:
#     cursor = conn.cursor()
#     create_tables(cursor, symbol)
#     historical = get_historical_data(cursor, symbol)
#     quote = get_quote_data(cursor, symbol)
#     print(quote)






