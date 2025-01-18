from flask import Blueprint, request, jsonify
import openai
import os
from pymongo import MongoClient
from dotenv import load_dotenv
import fitz # PyMuPDF for PDFs
import docx #python docx for DOCs
from werkzeug.utils import secure_filename
import traceback

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

def extract_text_from_pdf(file):
    try:
        # ✅ Read the file as a byte stream
        pdf_document = fitz.open(stream=file.read(), filetype="pdf") 
        text = ""

        # ✅ Extract text from each page
        for page in pdf_document:
            text += page.get_text("text") + "\n"

        return text
    except Exception as e:
        print(f"❌ PDF Extraction Error: {e}")
        return None

def extract_text_from_docx(docx_path):
    """Extracts text from a DOCX file."""
    doc = docx.Document(docx_path)
    return "\n".join([para.text for para in doc.paragraphs])

 # Route to summarize text
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

@summarization_bp.route("/upload", methods=["POST"])
def upload_file():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files["file"]

        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        filename = secure_filename(file.filename)

        # Debugging: Print filename
        print(f"✅ Uploaded File: {filename}")

        # Process PDF or DOCX
        if filename.endswith(".pdf"):
            text = extract_text_from_pdf(file)
        elif filename.endswith(".docx"):
            text = extract_text_from_docx(file)
        else:
            return jsonify({"error": "Unsupported file format"}), 400

        print(f"✅ Extracted Text: {text[:100]}")  # Print first 100 chars for debugging

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": f"Summarize this: {text}"}]
        )
        summary = response["choices"][0]["message"]["content"]

        summaries_collection.insert_one({"original_text": text, "summary": summary})

        return jsonify({"summary": summary})

    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        traceback.print_exc()  # ✅ Logs full error in terminal
        return jsonify({"error": str(e)}), 500