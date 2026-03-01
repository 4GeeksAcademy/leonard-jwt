# Import Flask request object for accessing incoming request data
from flask import request, jsonify, Blueprint
# Import CORS decorator for cross-origin resource sharing support
from flask_cors import CORS
# Import SQLAlchemy database instance and User model for database operations
from api.models import db, User
# Import password hashing utility (for user registration)
from werkzeug.security import generate_password_hash
# Import PyJWT library for creating and verifying JSON Web Tokens
import jwt
# Import datetime module for calculating token expiration timestamps
import datetime
# Import os module for accessing environment variables
import os
import logging

# Create a Blueprint named 'api' to organize and group related routes
# A blueprint is a reusable collection of routes that can be registered with the Flask app
api = Blueprint('api', __name__)

# Enable CORS for this blueprint to allow requests from different origins (frontend)
CORS(api)

# Retrieve the secret key from environment variables for JWT token signing
# If FLASK_SECRET_KEY is not set, use "default-secret-key" as fallback (insecure for production)
SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "default-secret-key")
logger = logging.getLogger(__name__)

# Simple health check endpoint to verify the API is running


@api.route('/hello', methods=['GET'])
def handle_hello():
    # Return a simple JSON message confirming backend is operational
    return jsonify({"message": "Hello from backend!"}), 200

# User registration endpoint - creates new user account with email and password


@api.route('/signup', methods=['POST'])
def signup():
    # Wrap endpoint in try-except to catch and handle any unexpected errors gracefully
    try:
        # Get JSON data from request body (sent by frontend)
        data = request.get_json(silent=True) or {}

        # Extract email from data, default to empty string if missing
        # Strip whitespace from both ends and convert to lowercase for consistency
        email = data.get("email", "").strip().lower()

        # Extract password from data, default to empty string if missing
        # Strip whitespace from both ends
        password = data.get("password", "").strip()

        # Validate that both email and password fields are provided and not empty
        if not email or not password:
            # Return 400 Bad Request with error message if validation fails
            return jsonify({"success": False, "msg": "Email and password required"}), 400

        # Query database to check if user with this email already exists
        if User.query.filter_by(email=email).first():
            # Return 409 Conflict if email is already registered
            return jsonify({"success": False, "msg": "Email already exists"}), 409

        # Create new User object with the provided email
        new_user = User(email=email)

        # Set the password using the hybrid_property setter (automatically hashes it)
        new_user.password = password

        # Add the new user object to the database session (pending save)
        db.session.add(new_user)

        # Commit the transaction to permanently save the user to database
        db.session.commit()

        # Return success response with 201 Created HTTP status code
        return jsonify({
            "success": True,
            "msg": "User created successfully",
            "email": email
        }), 201

    # Catch any unexpected exceptions that occur during registration
    except Exception as e:
        # Rollback the database transaction to undo any partial/incomplete changes
        db.session.rollback()
        logger.exception("Signup failed: %s", e)
        # Return 500 Internal Server Error with generic error message
        return jsonify({"success": False, "msg": "Registration failed"}), 500

# User login endpoint - authenticates user and generates JWT token


@api.route('/login', methods=['POST'])
def login():
    # Wrap endpoint in try-except to handle unexpected errors
    try:
        # Get JSON data from request body (sent by frontend with credentials)
        data = request.get_json(silent=True) or {}

        # Extract email from data, default to empty string
        # Normalize by converting to lowercase and trimming whitespace
        email = data.get("email", "").strip().lower()

        # Extract password from data, default to empty string
        # Trim whitespace from both ends
        password = data.get("password", "").strip()

        # Validate that both email and password are provided (not empty)
        if not email or not password:
            # Return 400 Bad Request if validation fails
            return jsonify({"success": False, "msg": "Email and password required"}), 400

        # Query database for user record matching the provided email
        user = User.query.filter_by(email=email).first()

        # Verify that user exists AND provided password matches stored hashed password
        if not user or not user.check_password(password):
            # Return 401 Unauthorized if user not found or password is incorrect
            return jsonify({"success": False, "msg": "Invalid credentials"}), 401

        # Create JWT token with user information embedded in the payload
        token = jwt.encode({
            # Include user's database ID in token (used to identify user on backend)
            "user_id": user.id,
            # Include user's email in token (useful for quick access without DB lookup)
            "email": user.email,
            # Set token expiration time to 2 hours from current UTC time
            # After this time, token becomes invalid and user must log in again
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
            # Sign token with SECRET_KEY using HS256 algorithm
        }, SECRET_KEY, algorithm="HS256")

        # Return successful login response with token and user data
        return jsonify({
            "success": True,
            "msg": "Login successful",
            "token": token,  # Include JWT token for client to store and use in future requests
            "user": {
                "id": user.id,
                "email": user.email
            }
        }), 200

    # Catch any unexpected exceptions during login process
    except Exception as e:
        logger.exception("Login failed: %s", e)
        # Return 500 Internal Server Error with generic error message
        return jsonify({"success": False, "msg": "Login failed"}), 500

# Protected endpoint requiring valid JWT token (currently without verification)


@api.route('/private', methods=['GET'])
def private():
    # NOTE: This endpoint should verify JWT token from Authorization header in production
    # Currently returns dummy data (TODO: implement actual token verification)

    # Return protected/private data that should only be accessible to authenticated users
    return jsonify({
        "msg": "This is a protected route",
        "user": {
            "email": "test@example.com"  # TODO: Extract actual email from verified JWT token
        }
    }), 200









