from flask import Blueprint, request, jsonify
import openai
import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set up MongoDB connection
mongo_url = os.getenv("MONGO_URI")
client = MongoClient(mongo_url)
db = client["summarizer_db"]
summaries_collection = db["summaries"]

# Set OpenAI API Key
openai.api_key = os.getenv("OPENAI_API_KEY")

# Create a Blueprint for the summarization route
summarization_bp = Blueprint("summarization", __name__)

@summarization_bp.route("/summarize", methods=["POST"])
def summarize_text():
    data = request.json
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": f"Summarize this: {text}"}]
        )
        summary = response["choices"][0]["message"]["content"]

        # Save summary in MongoDB
        summaries_collection.insert_one({"original_text": text, "summary": summary})

        return jsonify({"summary": summary})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
