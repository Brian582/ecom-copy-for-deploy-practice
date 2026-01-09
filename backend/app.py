from flask import Flask, request, jsonify
from flask_cors import CORS 
from flask_pymongo import PyMongo
from pymongo.errors import PyMongoError
from werkzeug.security import generate_password_hash, check_password_hash
import os

from payment import paypal_bp
from cart_items import cart_items_bp
from cart_totalprice import totalprice_bp

app = Flask(__name__)
app.register_blueprint(paypal_bp) 

app.register_blueprint(cart_items_bp)
app.register_blueprint(totalprice_bp)

CORS(app)

app.config["MONGO_URI"] = os.getenv("MONGO_URI") #from env file
mongo = PyMongo(app)


#adds user to database
@app.route('/addUser', methods=['POST'])
def add_user():
  try:
    username = request.json.get('username')
    password = request.json.get('password')

    if check_username(username): #checks if username is already in the database
      authenticated = False
      return jsonify({'active': authenticated})
    
    hashed_password = generate_password_hash(password) #hashes password
    mongo.db.users.insert_one({ "username": username , "password": hashed_password })

    authenticated = True #user is inserted into the database
    return jsonify({'added': authenticated})
  
  except PyMongoError:
    return jsonify({"error": "Database error"}), 500

#gets username to signin user
@app.route("/getUser", methods=['POST'])
def get_user():
  try:
    username = request.json.get('username')
    user_data = mongo.db.users.find_one({"username": username}) #returns python dictionary

    if not user_data:
      return jsonify({'username': False, 'authenticated': False})
      # return jsonify({"error": "User not found"}), 404
    
    password = request.json.get('password')
    stored_hashed_password = user_data.get('password') #gets password from user_data dictionary

    if check_password_hash(stored_hashed_password, password) or stored_hashed_password == password :
      authenticated = True
    else: authenticated = False

    return jsonify({'username': username, 'authenticated': authenticated })
    
  except PyMongoError as e:
    return jsonify({"error": "Database operation failed"}), 500
  
#checks if user is in the database
def check_username(username):
  try:
      user = mongo.db.users.find_one({"username": username})
      if not user: return False
      return True
  except PyMongoError as e:
      return jsonify({"error": "User not found"}), 404
  
#checks if password is in the database
# def check_password(password):
#   try:
#       password = mongo.db.users.find_one({"password": password})
#       if not password: return False
#       return True
#   except PyMongoError as e:
#       return jsonify({"error": "User not found"}), 404
if __name__ == '__main__':
  app.run(debug=True)