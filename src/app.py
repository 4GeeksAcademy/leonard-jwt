"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
# Import os module to access environment variables and file system operations
import os
# Import Flask components for creating web server and handling HTTP requests
from flask import Flask, request, jsonify, url_for, send_from_directory
# Import Migrate for handling database schema migrations using Alembic
from flask_migrate import Migrate
# Import swagger for API documentation generation (if needed)
from flask_swagger import swagger
# Import CORS to enable Cross-Origin Resource Sharing for frontend requests
from flask_cors import CORS 
# Import custom APIException class and sitemap generator function from utils
from api.utils import APIException, generate_sitemap
# Import SQLAlchemy database instance for ORM functionality
from api.models import db
# Import the API Blueprint containing all route endpoints
from api.routes import api
# Import admin panel setup function
from api.admin import setup_admin
# Import CLI commands setup function for database operations
from api.commands import setup_commands

# Set environment to "development" if FLASK_DEBUG env var is "1", otherwise "production"
ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
# Get the absolute path to the public directory where React build output is stored
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')
# Create Flask application instance with __name__ as the module name
app = Flask(__name__)
# Disable strict trailing slashes on URL routes (allows /route/ and /route to both work)
app.url_map.strict_slashes = False

# Enable CORS for all routes in the Flask app (allows requests from different origins)
CORS(app)

# Retrieve the DATABASE_URL environment variable (for PostgreSQL, MySQL, or SQLite)
db_url = os.getenv("DATABASE_URL")
# Check if DATABASE_URL environment variable was provided
if db_url is not None:
    # Replace old postgres:// protocol with newer postgresql:// protocol
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    # Use SQLite as fallback database if no DATABASE_URL is configured
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

# Disable SQLAlchemy's event listener system to reduce memory usage and improve performance
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# Initialize Migrate with app and db instances for handling database schema migrations
MIGRATE = Migrate(app, db, compare_type=True)
# Initialize SQLAlchemy ORM with the Flask app instance
db.init_app(app)

# Setup Flask-Admin for database management interface (creates /admin route)
setup_admin(app)
# Setup Flask CLI commands for database operations (migrate, upgrade, downgrade)
setup_commands(app)

# Register the API Blueprint with /api prefix (all routes will start with /api)
app.register_blueprint(api, url_prefix='/api')

# Define error handler for custom APIException class
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    # Convert APIException instance to dictionary format and return as JSON response
    # Include the HTTP status code from the exception object
    return jsonify(error.to_dict()), error.status_code

# Root route handler for the application home page
@app.route('/')
def sitemap():
    # Check if running in development mode
    if ENV == "development":
        # In development, generate and display an interactive sitemap of all routes
        return generate_sitemap(app)
    # In production mode, serve the React build's index.html file
    return send_from_directory(static_file_dir, 'index.html')

# Catch-all route handler for serving static files or handling React Router navigation
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    # Construct full path to the requested file in the public directory
    file_path = os.path.join(static_file_dir, path)
    # Check if the requested file actually exists on disk
    if not os.path.isfile(file_path):
        # File doesn't exist, so serve index.html instead (React Router will handle the route)
        path = 'index.html'
    
    # Serve the file from the public directory
    response = send_from_directory(static_file_dir, path)
    
    # Set cache control headers to prevent caching (max_age=0 means expires immediately)
    # This ensures users always get the latest version of the app
    response.cache_control.max_age = 0
    
    return response

# Main entry point when running the Flask application directly (not through a WSGI server)
if __name__ == '__main__':
    # Retrieve PORT from environment variable, default to 3001 if not specified
    PORT = int(os.environ.get('PORT', 3001))
    
    # Run Flask development server on all network interfaces (0.0.0.0)
    # debug=True enables auto-reload on code changes and provides interactive debugger on errors
    app.run(host='0.0.0.0', port=PORT, debug=True)









