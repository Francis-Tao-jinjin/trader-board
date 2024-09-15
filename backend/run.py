import os
import json
import subprocess
import shlex

with open('env.json') as f:
    env = json.load(f)
    print(env)
    for key, value in env.items():
        os.environ[key] = value

def run_server():
    command = "flask --app backend:create_app run --debug"
    subprocess.run(shlex.split(command), check=True)

def init_db():
    os.environ['FLASK_APP'] = 'backend:create_app'
    command = "flask init-db"
    subprocess.run(shlex.split(command), check=True)

def migrate_db():
    os.environ['FLASK_APP'] = 'backend:create_app'
    command = "flask migrate-db"
    subprocess.run(shlex.split(command), check=True)
