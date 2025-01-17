from flask import Blueprint, request, jsonify
import openai
import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set up MongoDB connection
mongo_url = os.getenv("MONGO_URI")

# Debugging: Check if MongoDB URI is loaded correctly
if not mongo_url:
    print("❌ ERROR: MONGO_URI is not set properly in the .env file.")

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

        # Debugging: Print the summary before storing
        print(f"✅ Generated Summary: {summary}")

        # Save summary in MongoDB
        insert_result = summaries_collection.insert_one({"original_text": text, "summary": summary})

        # Debugging: Check if the insert was successful
        print(f"✅ MongoDB Inserted ID: {insert_result.inserted_id}")

        return jsonify({"summary": summary})

    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return jsonify({"error": str(e)}), 500
