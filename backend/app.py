import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env

app = Flask(__name__)
CORS(app)

# MongoDB Connection
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["doc_summarizer"]

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to AI Document Summarizer API!"})

if __name__ == "__main__":
    app.run(debug=True)
