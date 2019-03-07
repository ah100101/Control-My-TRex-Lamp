# Control My T-Rex Lamp

Turn my office lamp on or off from the web

## Getting started 

Get Python installed (2 or 3 should work)
Create a `.env` file in the same directory as the python file (`/agent`) with the following: `EUFY_EMAIL` and `EUFY_PASSWORD`
Run `pip install -U flask flask_cors flask_restful python-dotenv`
Run `python light.py` - default port is 5000