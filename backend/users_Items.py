from flask import jsonify, request, Blueprint
import os

import json
from dotenv import load_dotenv
from pathlib import Path

json_bp = Blueprint("json", __name__)

load_dotenv()

#constructs absolute path by getting relative path from env file
def getFilePath(filename):
  path_rel = os.getenv(filename)        
  if not path_rel:
    raise FileNotFoundError(f"Environment variable {path_rel} is not set")

  path_abs = Path(path_rel).resolve()
  if not path_abs.exists():
    raise FileNotFoundError(f"File does not exist: {path_abs}")

  return path_abs

#reads file to retrieve and return the json data
def readFile(filename):
  file = getFilePath(filename)  
  with open(file, 'r') as f:
    return json.load(f)

#writes file with the new given data
def writeFile(filename,data):
  file = getFilePath(filename)
  with open(file, 'w') as f:
    json.dump(data, f, indent=2)

#gets a user's cart items 
@json_bp.route("/getCartItems", methods=['GET'], strict_slashes=False)
def get_CartItems():
  try:
    data = readFile("JSON_CARTFILE")
    cartItems = data.get('cart-Items')
    return jsonify(cartItems)
  
  except FileNotFoundError as e:
    return jsonify({"error": f"File not found: {e}"}), 404
  except json.JSONDecodeError as e:
    return jsonify({"error": f"Invalid JSON: {e}"}), 400
  except KeyError as e:
    return jsonify({"error": f"Missing key in JSON: {e}"}), 400
  except Exception as e:
    return jsonify({"error": f"Unexpected error: {e}"}), 500


#updates user's cart items in json file
@json_bp.route("/updateCartItems", methods=['PUT'], strict_slashes=False)
def update_cartItems():
  try:
    data = readFile("JSON_CARTFILE")
    cartItems = request.get_json().get("updateItems")

    if cartItems is not None:
      data["cart-Items"] = cartItems

    writeFile("JSON_CARTFILE",data)
    
    return jsonify({"success": "Successfully updated cart items"}), 200
  
  except FileNotFoundError as e:
    return jsonify({"error": f"File not found: {e}"}), 404
  except json.JSONDecodeError as e:
    return jsonify({"error": f"Invalid JSON: {e}"}), 400
  except Exception as e:
    return jsonify({"error": f"Unexpected error: {e}"}), 500


#gets user's total price of their cart items
@json_bp.route("/getTotalPrice", methods=['GET'], strict_slashes=False)
def get_TotalPrice():
  try:
    data = readFile("JSON_TOTALPRICEFILE")
    totalPrice = data.get('totalPrice')
    print(f"json total {totalPrice}")
    return jsonify(totalPrice)
  
  except FileNotFoundError as e:
    return jsonify({"error": f"File not found: {e}"}), 404
  except json.JSONDecodeError as e:
    return jsonify({"error": f"Invalid JSON: {e}"}), 400
  except KeyError as e:
    return jsonify({"error": f"Missing key in JSON: {e}"}), 400
  except Exception as e:
    return jsonify({"error": f"Unexpected error: {e}"}), 500

#get total price without jsonify
def get_TotalPrice_value():
    data = readFile("JSON_TOTALPRICEFILE")
    return float(data.get("totalPrice"))

#updates user's total price
@json_bp.route("/updateTotalPrice", methods=['PUT'], strict_slashes=False)
def update_TotalPrice():
  try:
    data = readFile("JSON_TOTALPRICEFILE")
    newTotalPrice = request.get_json().get("totalPrice")

    if newTotalPrice is not None:
      data['totalPrice'] = newTotalPrice

    writeFile("JSON_TOTALPRICEFILE", data)
    
    return jsonify({"success": "Successfully updated total price"}), 200
  
  except FileNotFoundError as e:
    return jsonify({"error": f"File not found: {e}"}), 404
  except json.JSONDecodeError as e:
    return jsonify({"error": f"Invalid JSON: {e}"}), 400
  except Exception as e:
    return jsonify({"error": f"Unexpected error: {e}"}), 500
