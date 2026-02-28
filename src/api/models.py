# Import SQLAlchemy ORM for database abstraction and object-relational mapping
from flask_sqlalchemy import SQLAlchemy
# Import hybrid_property decorator for creating computed database properties
from sqlalchemy.ext.hybrid import hybrid_property
# Import password hashing functions: one to hash plaintext, one to verify
from werkzeug.security import generate_password_hash, check_password_hash

# Create SQLAlchemy database instance (will be initialized with Flask app in app.py)
db = SQLAlchemy()

# Define User database model class that inherits from db.Model
class User(db.Model):
    # Specify the name of the database table this model represents
    __tablename__ = "user"
    
    # Primary key column - auto-incrementing integer that uniquely identifies each user
    id = db.Column(db.Integer, primary_key=True)
    
    # Email column - VARCHAR(256), must be unique (no duplicate emails), cannot be NULL
    email = db.Column(db.String(256), unique=True, nullable=False)
    
    # Private password column - stores hashed password (prefixed with _ to indicate internal use)
    # Uses VARCHAR(256) to accommodate hashed passwords, cannot be NULL
    _password = db.Column(db.String(256), nullable=False)

    # Hybrid property getter - allows reading password via user.password syntax
    @hybrid_property
    def password(self):
        # Return the stored hashed password from _password column
        return self._password

    # Hybrid property setter - allows setting password via user.password = plaintext syntax
    @password.setter
    def password(self, plain_password):
        # Hash the plain text password using werkzeug's secure hashing algorithm
        # This creates a one-way hash that cannot be reversed
        self._password = generate_password_hash(plain_password)

    # Method to verify if a provided plain text password matches the stored hash
    def check_password(self, plain_password):
        # Use werkzeug's check_password_hash to compare plain password with stored hash
        # Returns True if passwords match, False if they don't
        return check_password_hash(self._password, plain_password)

    # String representation of User object for debugging and logging purposes
    def __repr__(self):
        # Return a readable string representation showing the user's email
        return f"<User {self.email}>"

    # Method to convert User object to JSON-serializable dictionary for API responses
    def serialize(self):
        # Return dictionary with only safe, non-sensitive user data (exclude password)
        return {
            # Include email in response (safe to expose to clients)
            "email": self.email
        }









