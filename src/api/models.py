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
    _password = db.Column("password", db.String(256), nullable=False)

    # Active flag expected by existing migrations/schema
    is_active = db.Column(db.Boolean(), nullable=False, default=True)

    @hybrid_property
    def password(self):
        return self._password

    @password.setter
    def password(self, plain_password):
        self._password = generate_password_hash(plain_password)

    def check_password(self, plain_password):
        return check_password_hash(self._password, plain_password)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "is_active": self.is_active,
        }









