import lakeside
import time
import random
import json
import os
from flask import Flask, request
from flask_restful import Api, Resource, reqparse
from flask import jsonify
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
load_dotenv(dotenv_path=os.path.join(BASE_DIR, ".env"))

app = Flask(__name__)
CORS(app, resource={r"/light": {"origins": "*"}}) #change once we know the origin we'd post to so we prevent any host from accessing

def get_colors():
  return [random.randint(0,255), random.randint(0,255), random.randint(0, 255)]

def hex_to_rgb(value):
    value = value.lstrip('#')
    lv = len(value)
    return tuple(int(value[i:i + lv // 3], 16) for i in range(0, lv, lv // 3))

def_power = True
def_brightness = 20
def_temperature = 20
def_colors = get_colors()

email = os.getenv("EUFY_EMAIL")
password = os.getenv("EUFY_PASSWORD")
devices = lakeside.get_devices(email, password)
bulb = lakeside.bulb(devices[0]['address'], devices[0]['code'], devices[0]['type'])
bulb.connect()

@app.route('/light', methods=['POST'])
def turnOnBulb():
  power = request.args.get("power", type=str)
  if (power is not None):
    power = power == "True"
  else:
    power = def_power
  brightness = request.args.get("brightness", type=int) or def_brightness
  temperature = request.args.get("temperature", type=int) or def_temperature
  parsed_colors = request.args.get("colors", type=str)
  colors = ""
  if parsed_colors is not None:
    colors = hex_to_rgb(parsed_colors)
  else:
    colors = get_colors()

  bulb.set_state(power=power, brightness=brightness, temperature=temperature, colors=colors)

  return "test", 200

# while True:
#   time.sleep(1)
#   bulb.set_state(power=True, brightness=20, temperature=20, colors=[random.randint(0,255), random.randint(0,255), random.randint(0, 255)])

if __name__ == '__main__':
  app.run(debug=True)