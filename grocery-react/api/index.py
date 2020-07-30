from flask import Flask, Response
from datetime import datetime
app = Flask(__name__)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
# def home():
#     return "Hello, Flask!"
def catch_all(path):
    now = datetime.now()
    formatted_now = now.strftime("%A, %d %B, %Y at %X")
    return Response("It's currently " + formatted_now)