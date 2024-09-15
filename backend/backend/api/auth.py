import functools
from backend.contanst import NO_LOGIN, INVALID_USERNAME, INVALID_PASSWORD
from flask import (
    Blueprint, flash, g, redirect, jsonify,
    render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash
from backend.db import get_db

auth_api = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_api.route('/register', methods=('POST',))
def register():
    username = request.json['username']
    password = request.json['password']
    db = get_db()
    error = None

    if not username:
        error = 'Username is required.'
    elif not password:
        error = 'Password is required.'
    elif db.execute(
        'SELECT id FROM users WHERE username = ?', (username,)
    ).fetchone() is not None:
        error = f'User {username} is already registered.'

    if error is None:
        db.execute(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            (username, generate_password_hash(password))
        )
        db.commit()
        return {
            'message': f'User {username} created successfully.',
            'status': 'success'
          }, 201

    return {'error': error}, 400

@auth_api.route('/login', methods=('POST',))
def login():
    username = request.json['username']
    password = request.json['password']
    db = get_db()
    error = None
    error_code = None
    user = db.execute(
        'SELECT * FROM users WHERE username = ?', (username,)
    ).fetchone()

    if user is None:
        error = 'Incorrect username.'
        error_code = INVALID_USERNAME
    elif not check_password_hash(user['password'], password):
        error = 'Incorrect password.'
        error_code = INVALID_PASSWORD
    if error is None:
        session.clear()
        session['user_id'] = user['id']
        session.permanent = True
        return {
            'message': f'User {username} logged in successfully.',
            'status': 'success'
          }, 200

    return {
        'error': error,
        'error_code': error_code
    }, 400

@auth_api.route('/logout', methods=('POST',))
def logout():
    session.clear()
    return {
        'message': 'User logged out successfully.',
        'status': 'success'
      }, 200

@auth_api.route('/user', methods=('GET',))
def user():
    if 'user_id' not in session:
        return jsonify({
            'error': 'Login required',
            'error_code': NO_LOGIN
        }), 200
    else:
        user = get_db().execute('SELECT * FROM users WHERE id = ?', (session['user_id'],)).fetchone()
        return jsonify({
            'id': user['id'],
            'username': user['username']
        }), 200

@auth_api.before_app_request
def load_logged_in_user():
    user_id = session.get('user_id')

    if user_id is None:
        g.user = None
    else:
        g.user = get_db().execute(
            'SELECT * FROM users WHERE id = ?', (user_id,)
        ).fetchone()

def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return jsonify({
                'error': 'Login required',
                'error_code': NO_LOGIN
            }), 401
        return view(**kwargs)
    return wrapped_view