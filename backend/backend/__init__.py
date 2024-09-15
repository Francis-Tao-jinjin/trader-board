import os
from flask import Flask
from flask_cors import CORS
from datetime import timedelta

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'backend.sqlite'),
    )
    
    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)
    
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    CORS(app, resources={r'/api/*': {
            'origins': '*',             # allow all origins for now
            'allow_headers': '*',
        }}, supports_credentials=True)  # allow setting cookies to different domain
    app.config.update(
        SESSION_TYPE='filesystem',
        SESSION_COOKIE_SAMESITE='None',
        SESSION_COOKIE_SECURE=True,
        SESSION_COOKIE_HTTPONLY=True
    )
    app.permenant_session_lifetime = timedelta(days=7)
    @app.route('/hello')
    def index():
        return '- Hello, World! -'
    
    from . import db
    db.init_app(app)

    from .api import auth
    app.register_blueprint(auth.auth_api)

    from .api import stock
    app.register_blueprint(stock.stock_api)

    from .api import debugg
    app.register_blueprint(debugg.stock_api)

    return app