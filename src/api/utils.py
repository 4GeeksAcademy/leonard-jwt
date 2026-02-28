# Import Flask's jsonify for converting Python objects to JSON responses
from flask import jsonify, url_for

# Custom exception class for API error responses - inherits from Python's Exception base class
class APIException(Exception):
    # Default HTTP status code for exceptions (400 Bad Request)
    status_code = 400

    # Constructor method to initialize the exception with message and optional status code
    def __init__(self, message, status_code=None, payload=None):
        # Call parent Exception class constructor to properly initialize exception
        Exception.__init__(self)
        
        # Store the error message provided by the caller
        self.message = message
        
        # If custom status code is provided, override the default status code
        if status_code is not None:
            self.status_code = status_code
        
        # Store optional additional error context/payload (additional error details)
        self.payload = payload

    # Method to convert exception instance to dictionary for JSON serialization
    def to_dict(self):
        # Create dictionary from the payload (or empty dict if payload is None)
        # This preserves any additional error context information
        rv = dict(self.payload or ())
        
        # Add the error message to the dictionary with 'message' key
        rv['message'] = self.message
        
        return rv

# Helper function to determine if a URL rule can be accessed without parameters
def has_no_empty_params(rule):
    # Get the default parameter values from the rule (empty tuple if none exist)
    defaults = rule.defaults if rule.defaults is not None else ()
    
    # Get the names of required parameters from the rule (empty tuple if none)
    arguments = rule.arguments if rule.arguments is not None else ()
    
    # Return True if number of defaults >= number of arguments
    # This means all parameters have defaults, so route can be accessed without params
    return len(defaults) >= len(arguments)

# Function to generate HTML sitemap showing all accessible API endpoints
def generate_sitemap(app):
    # Initialize links list with admin panel as the first item
    links = ['/admin/']
    
    # Iterate through all URL rules (routes) registered in the Flask application
    for rule in app.url_map.iter_rules():
        # Only include routes that support GET method AND have no required parameters
        # This filters out POST/PUT/DELETE routes and routes with required path parameters
        if "GET" in rule.methods and has_no_empty_params(rule):
            # Use Flask's url_for function to generate the full URL for this route
            url = url_for(rule.endpoint, **(rule.defaults or {}))
            
            # Exclude admin routes from the sitemap (they're not public API endpoints)
            if "/admin/" not in url:
                # Add this URL to the links list
                links.append(url)

    # Create HTML list item elements for each link with clickable anchor tags
    links_html = "".join(["<li><a href='" + y + "'>" + y + "</a></li>" for y in links])
    
    # Return formatted HTML page displaying the sitemap with welcome message and links
    return """
        <div style="text-align: center;">
        <img style="max-height: 80px" src='https://storage.googleapis.com/breathecode/boilerplates/rigo-baby.jpeg' />
        <h1>Rigo welcomes you to your API!!</h1>
        <p>API HOST: <script>document.write('<input style="padding: 5px; width: 300px" type="text" value="'+window.location.href+'" />');</script></p>
        <p>Start working on your project by following the <a href="https://start.4geeksacademy.com/starters/full-stack" target="_blank">Quick Start</a></p>
        <p>Remember to specify a real endpoint path like: </p>
        <ul style="text-align: left;">"""+links_html+"</ul></div>"









