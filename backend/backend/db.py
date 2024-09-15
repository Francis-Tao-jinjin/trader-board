import sqlite3

import click
from flask import g, current_app

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row
    return g.db

def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()

def init_db():
    db = get_db()

    with current_app.open_resource('schema.sql') as f:
        db.executescript(f.read().decode('utf8'))

@click.command('init-db')
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()
    click.echo('Initialized the database.')

def migrate_db():
    db = get_db()

    # db.execute('''
    #     CREATE TABLE new_stocks_info (
    #         id INTEGER PRIMARY KEY AUTOINCREMENT,
    #         symbol TEXT NOT NULL,
    #         name TEXT NOT NULL,
    #         exchange TEXT NOT NULL,
    #         industry TEXT NOT NULL,
    #         website TEXT NOT NULL,
    #         description TEXT NOT NULL,
    #         sector TEXT NOT NULL,
    #         eps REAL NOT NULL,
    #         market_capitalization INTEGER NOT NULL,
    #         fiftytwo_week_high REAL NOT NULL,
    #         fiftytwo_week_low  REAL NOT NULL,
    #         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    #         UNIQUE(symbol)
    #     )
    # ''')
    # db.execute('DROP TABLE stocks_info')
    # db.execute('ALTER TABLE new_stocks_info RENAME TO stocks_info')

    db.execute('''
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
        )
    ''')
    db.execute('''
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
        )
    ''')
    db.execute('DROP TABLE sotcks_daily')   # typo in table name
    db.execute('DROP TABLE sotcks_hourly')  # typo in table name
    db.commit()

@click.command('migrate-db')
def migrate_db_command():
    """Migrate the database to fix column names."""
    migrate_db()
    click.echo('Migrated the database.')


def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)
    app.cli.add_command(migrate_db_command)
