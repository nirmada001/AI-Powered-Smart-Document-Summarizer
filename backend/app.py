from flask import Flask, jsonify
from flask_cors import CORS
from routes.summarization import summarization_bp  # Import the blueprint
from flask_jwt_extended import JWTManager
from routes.users import users_bp
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)

# Load environment variables
load_dotenv()
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

# Initialize JWT Manager
jwt = JWTManager(app)

# Register Blueprints
app.register_blueprint(summarization_bp)

app.register_blueprint(users_bp, url_prefix="/api/users")

@app.route("/")
def home():
    return jsonify({"message": "Welcome to AI-Powered Document Summarizer Backend!"})

if __name__ == "__main__":
    app.run(debug=True)
