from flask import Flask, jsonify
from flask_cors import CORS
from routes.summarization import summarization_bp  # Import the blueprint

app = Flask(__name__)
CORS(app)

# Register Blueprints
app.register_blueprint(summarization_bp)

@app.route("/")
def home():
    return jsonify({"message": "Welcome to AI-Powered Document Summarizer Backend!"})

if __name__ == "__main__":
    app.run(debug=True)
