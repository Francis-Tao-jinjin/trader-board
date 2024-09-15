DROP TABLE IF EXISTS stocks_daily;
DROP TABLE IF EXISTS stocks_hourly;
DROP TABLE IF EXISTS stocks_info;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS user_stocks;
DROP TABLE IF EXISTS user_setting;

CREATE TABLE stocks_daily (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    symbol TEXT NOT NULL,
    date TEXT NOT NULL,
    open REAL,
    high REAL,
    low REAL,
    close REAL,
    volume INTEGER,
    UNIQUE(symbol, date)
);

CREATE TABLE stocks_hourly (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    symbol TEXT NOT NULL,
    date TEXT NOT NULL,
    open REAL,
    high REAL,
    low REAL,
    close REAL,
    volume INTEGER,
    UNIQUE(symbol, date)
);

CREATE TABLE stocks_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    symbol TEXT NOT NULL,
    name TEXT NOT NULL,
    exchange TEXT NOT NULL,
    industry TEXT NOT NULL,
    website TEXT NOT NULL,
    description TEXT NOT NULL,
    sector TEXT NOT NULL,
    eps REAL NOT NULL,
    market_capitalization INTEGER NOT NULL,
    fiftytwo_week_high REAL NOT NULL,
    fiftytwo_week_low  REAL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(symbol)
);

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE user_stocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    stock_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(stock_id) REFERENCES stocks_info(id),
    UNIQUE(user_id, stock_id)
);

CREATE TABLE user_setting (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    setting_key TEXT NOT NULL,
    setting_value TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id),
    UNIQUE(user_id, setting_key)
)