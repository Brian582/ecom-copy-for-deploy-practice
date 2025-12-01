from flask import jsonify, request, Blueprint
from werkzeug.security import generate_password_hash, check_password_hash
import os

import json
from dotenv import load_dotenv
from pathlib import Path

json_bp = Blueprint("json", __name__)

load_dotenv()

##### Maybe delete this function
@json_bp.route("/readJsonMenu/")
def read_jsonMenu():
  try:
    #gets the path of env. file
    # basedir = os.path.abspath(os.path.dirname(__file__))
    # load_dotenv(os.path.join(basedir, '.env'))

    # #gets the path from the environment variable
    # relative_path_from_env = os.getenv("MY_PATH")
    # if relative_path_from_env:
    #   file_path = os.path.join(basedir, relative_path_from_env)

    # else: return jsonify({"error": "Can't open Json file"})

    # Get the path from .env
    path_rel = os.getenv("JSON_MENUFILE"," ")        
    path_abs = Path(path_rel).resolve() 
    print(f"path {path_abs}")
      
    # 1. Read the JSON file
    with open(path_abs, 'r') as f:
      data = json.load(f)

    return jsonify(data)
  
  except json.JSONDecodeError as e:
    return jsonify({"error": f"Error decoding JSON: {e}"}), 500
  except FileNotFoundError as e:
    return jsonify({"error": f"File not found: {e}"}), 500
   
@json_bp.route("/getItemPrices/")
def get_ItemPrices():
  try:
    path_rel = os.getenv("JSON_COSTFILE"," ")        
    path_abs = Path(path_rel).resolve() 
    print(f"path {path_abs}")
      
    with open(path_abs, 'r') as f:
      data = json.load(f)

    return jsonify(data)
  
  except json.JSONDecodeError as e:
    return jsonify({"error": f"Error decoding JSON: {e}"}), 500
  except FileNotFoundError as e:
    return jsonify({"error": f"File not found: {e}"}), 500

#gets a user's cart items 
@json_bp.route("/getCartItems/")
def get_CartItems():
  try:
    #constructs absolute path by getting relative path from env file
    path_rel = os.getenv("JSON_CARTFILE"," ")        
    path_abs = Path(path_rel).resolve() 
    print(f"path {path_abs}")
      
    with open(path_abs, 'r') as f:
      data = json.load(f)

    cartItems = data['cart-Items'] 
    print(f"get cartitems {cartItems}")
    return jsonify(cartItems)
  
  except json.JSONDecodeError as e:
    return jsonify({"error": f"Error decoding JSON: {e}"}), 500
  except FileNotFoundError as e:
    return jsonify({"error": f"File not found: {e}"}), 500


#updates user's cart items in json file
@json_bp.route("/updateCartItems/", methods=['PUT'])
def update_cartItems():
  try:
    path_rel = os.getenv("JSON_CARTFILE"," ")        
    path_abs = Path(path_rel).resolve() 
    print(f"the file path {path_abs}")
      
    with open(path_abs, 'r') as f:
      data = json.load(f)

    cartItems = request.get_json().get("updateItems")
    print(f"cartitems {cartItems}")
    if cartItems:
      data["cart-Items"] = cartItems
    # data.setdefault("cart-items", []).append(newcartItem)

    with open(path_abs, 'w') as f:
      json.dump(data, f, indent=2)
    
    return "Successfully Update cart items", 200
  
  except json.JSONDecodeError as e:
    return jsonify({"error": f"Error decoding JSON: {e}"}), 500
  except FileNotFoundError as e:
    return jsonify({"error": f"File not found: {e}"}), 500

############
#removes user's cart item from json file
# @json_bp.route("/removeCartItem/", methods=['PUT'])
# def remove_CartItem():

# #clears user's cart item from json file
@json_bp.route("/clearCartItems/", methods=['PUT'])
def clear_CartItem():
  try:
    path_rel = os.getenv("JSON_CARTFILE"," ")        
    path_abs = Path(path_rel).resolve() 
    print(f"the file path {path_abs}")
      
    with open(path_abs, 'r') as f:
      data = json.load(f)

    cartItems = request.get_json().get("clearItems")
    print(f"cartitems {cartItems}")
    if cartItems is not None:
      data["cart-Items"] = cartItems
    # data.setdefault("cart-items", []).append(newcartItem)

    with open(path_abs, 'w') as f:
      json.dump(data, f, indent=2)
    
    return "Successfully Update cart items", 200
  
  except json.JSONDecodeError as e:
    return jsonify({"error": f"Error decoding JSON: {e}"}), 500
  except FileNotFoundError as e:
    return jsonify({"error": f"File not found: {e}"}), 500


#gets user's total price of their cart items
@json_bp.route("/getTotalPrice/")
def get_TotalPrice():
  try:
    # path_rel = os.getenv("JSON_CARTFILE"," ")
    path_rel = os.getenv("JSON_TOTALPRICEFILE"," ")         
    path_abs = Path(path_rel).resolve() 
    print(f"price path {path_abs}")
      
    with open(path_abs, 'r') as f:
      data = json.load(f)

    totalPrice = data['totalPrice'] 
    print(f"get price {totalPrice}")
    return jsonify(totalPrice)
  
  except json.JSONDecodeError as e:
    return jsonify({"error": f"Error decoding JSON: {e}"}), 500
  except FileNotFoundError as e:
    return jsonify({"error": f"File not found: {e}"}), 500


#updates user's total price
@json_bp.route("/updateTotalPrice/", methods=['PUT'])
def update_TotalPrice():
  try:
    # path_rel = os.getenv("JSON_CARTFILE"," ")
    path_rel = os.getenv("JSON_TOTALPRICEFILE"," ")        
    path_abs = Path(path_rel).resolve() 
    print(f"price path {path_abs}")
      
    with open(path_abs, 'r') as f:
      data = json.load(f)

    content = request.get_json()
    newTotalPrice = content.get("totalPrice")
    print(f"update price {newTotalPrice}")

    if newTotalPrice:
      data['totalPrice'] = newTotalPrice

    with open(path_abs, 'w') as f:
      json.dump(data, f, indent=2)
    
    return "Successfully Update Total Price", 200
  
  except json.JSONDecodeError as e:
    return jsonify({"error": f"Error decoding JSON: {e}"}), 500
  except FileNotFoundError as e:
    return jsonify({"error": f"File not found: {e}"}), 500

#resets user's total price
@json_bp.route("/resetTotalPrice/", methods=['PUT'])
def reset_TotalPrice():
  try:
    # path_rel = os.getenv("JSON_CARTFILE"," ")
    path_rel = os.getenv("JSON_TOTALPRICEFILE"," ")        
    path_abs = Path(path_rel).resolve() 
    print(f"reset price path {path_abs}")
      
    with open(path_abs, 'r') as f:
      data = json.load(f)

    content = request.get_json()
    resetTotalPrice = content.get("cleartotalPrice") #I dont think i need to have this in this function
    print(f"reset price {resetTotalPrice}")

    if resetTotalPrice is not None:
      data['totalPrice'] = 0

    with open(path_abs, 'w') as f:
      json.dump(data, f, indent=2)
    
    return "Successfully Update Total Price", 200
  
  except json.JSONDecodeError as e:
    return jsonify({"error": f"Error decoding JSON: {e}"}), 500
  except FileNotFoundError as e:
    return jsonify({"error": f"File not found: {e}"}), 500
  

#later change this function to be used for updating user's cart items
@json_bp.route("/updateJsonfile/<keys>/<values>", methods=['PUT'])
def update_json(keys,values):
  try:
    #gets the path of env. file
    basedir = os.path.abspath(os.path.dirname(__file__))
    load_dotenv(os.path.join(basedir, '.env'))

    #gets the path from the environment variable
    relative_path_from_env = os.getenv("MY_PATH")
    if relative_path_from_env:
      file_path = os.path.join(basedir, relative_path_from_env)

    else: return jsonify({"error": "Can't open Json file"})
      
    # 1. Read the JSON file
    with open(file_path, 'r') as f:
        data = json.load(f)

    # 2. Modify the data

    for key,value in zip(keys,values):
      data[key] = value

    # data['name'] = 'New Name'  # Update an existing value
    # data['city'] = 'New City'  # Add a new key-value pair

    # 3. Convert back to JSON and 4. Write to file
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=4) # indent for pretty-printing
      
    return "json file updated"
  except Exception as e:
    return jsonify({"error": f"An error occurred: {e}"}), 500 

