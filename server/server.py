import requests
import os
import pytz
import time
from datetime import datetime, timedelta
from dotenv import load_dotenv
from opencage.geocoder import OpenCageGeocode
from flask_socketio import SocketIO
from flask import Flask, request, render_template, abort
import threading
from flask_cors import CORS

load_dotenv()

OPEN_WEATHER_API_KEY = os.getenv("OPEN_WEATHER_API_KEY")
OPEN_WEATHER_ENDPOINT = os.getenv("OPEN_WEATHER_ENDPOINT")
OPEN_CAGE_API_KEY = os.getenv("OPEN_CAGE_API_KEY")

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

clients = []


class User():

    def __init__(self, sid):
        self.sid = sid
        self.query = None
        self.update_frequency = 3600  # 30 Minutes
        self.last_updated = datetime.utcnow()

    def __str__(self):
        return f'{self.sid} - {self.query}'

    def __repr__(self):
        return f'{self.sid} - {self.query}'


def parser(data):
    now = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

    weatherObject = {
        'summary': data['current']['weather'][0]['description'].capitalize(),
        'temperature': int(data['current']['temp']),
        # 'forecastMessage': data['daily']['summary'],
        'address': data['address'],
        'icon': data['current']['weather'][0]['icon'],
        'timezone': data['timezone'],
        'last_updated': now
    }

    return weatherObject


def get_weather(query):
    geocoder = OpenCageGeocode(OPEN_CAGE_API_KEY)
    lat = lon = 0
    try:
        results = geocoder.geocode(query)
        lat, lon = (results[0]['geometry']['lat'],
                    results[0]['geometry']['lng'])
    except Exception:
        return None

    url = f"{OPEN_WEATHER_ENDPOINT}?lat={lat}&lon={lon}&units=metric&exclude=minutely,hourly&appid={OPEN_WEATHER_API_KEY}"

    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        data['address'] = results[0]['formatted']
        data = parser(data)
        return data
    else:
        return None


def update():
    while True:
        for user in clients:
            if user.query:
                now = datetime.utcnow()
                if now >= user.last_updated + timedelta(seconds=user.update_frequency):
                    data = get_weather(user.query)
                    if data:
                        socketio.emit('update', data, json=True, room=user.sid)
                        user.last_updated = now
        time.sleep(5)


@app.route('/')
def home():
    return 'Hello World'


@app.route('/api/search')
def search():
    city = request.args.get('city', None)

    data = get_weather(query=city)
    if data:
        return data
    abort(404)

# SOCKET METHODS


@socketio.on('connected')
def connected():
    user = User(request.sid)
    clients.append(user)


@socketio.on('weather')
def weather(query):
    sid = request.sid
    user = next((client for client in clients if client.sid == sid), None)
    if user:
        user.query = query


@socketio.on('disconnect')
def disconnect():
    sid = request.sid
    user = next((client for client in clients if client.sid == sid), None)
    if user:
        clients.remove(user)
        del user


if __name__ == '__main__':
    thread = threading.Thread(target=update, daemon=True)
    thread.start()
    socketio.run(app, debug=True)
