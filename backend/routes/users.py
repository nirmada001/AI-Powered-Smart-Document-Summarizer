from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import datetime

# Load environment variables
load_dotenv()

# MongoDB connection
mongo_url = os.getenv("MONGO_URI")
client = MongoClient(mongo_url)
db = client["summarizer_db"]
users_collection = db["users"]

# Create a Blueprint for the users route
users_bp = Blueprint("users", __name__)

# Route to register a new user
@users_bp.route("/register", methods=["POST"])
def register_user():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    
    # Check if the user already exists
    if users_collection.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 400
    
    # Hash the password
    hashed_password = generate_password_hash(password)

    # Insert the user into the database
    users_collection.insert_one({"name":name,"email": email, "password": hashed_password})

    return jsonify({"message": "User registered successfully"}), 201

# Route to login a user
@users_bp.route("/login",methods=["POST"])
def login_user():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    
    #find user in database
    user = users_collection.find_one({"email": email})

    if not user or not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid email or password"}), 401
    
     # Include user details in JWT
    user_data = {
        "id": str(user["_id"]),  # Convert ObjectId to string
        "email": user["email"],
        "name": user.get("name", "User")  # Ensure 'name' exists, fallback to "User"
    }

    
    # generate JWT token
    access_token = create_access_token(identity=user_data, expires_delta=datetime.timedelta(days=1))

    print("Generated Token Data:", user_data)  # Debugging statement

    return jsonify({"message":"Login successful", "access_token": access_token}), 200