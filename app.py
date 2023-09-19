from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    session,
    redirect,
    url_for
)
from pymongo import MongoClient
import jwt
from datetime import datetime, timedelta
import hashlib
import os
import shutil

app = Flask(__name__)

SECRET_KEY = 'persia'

client = MongoClient(
    'mongodb+srv://admin:admin@cluster0.tiysqrl.mongodb.net/')
db = client.dapurdenisa

TOKEN_KEY = 'mytoken'

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')


if __name__ == "__main__":
    app.run("0.0.0.0", port=5000, debug=True)