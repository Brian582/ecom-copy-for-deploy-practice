from flask import jsonify, request, Blueprint
from file_handler import readFile, writeFile
import json

totalprice_bp = Blueprint("totalprice", __name__)

#gets user's total price of their cart items
@totalprice_bp.route("/getTotalPrice", methods=['GET'], strict_slashes=False)
def get_TotalPrice():
  try:
    data = readFile("JSON_CART_TOTALPRICE_FILE")
    totalPrice = data.get('totalPrice')
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
def get_PaymentTotal():
  data = readFile("JSON_CART_TOTALPRICE_FILE")
  subtotal = float(data.get("totalPrice"))
  shipping = 5.99  if subtotal > 0 else 0
  tax = subtotal * 0.08
  total = subtotal + shipping + tax
  return total

#updates user's total price
@totalprice_bp.route("/updateTotalPrice", methods=['PUT'], strict_slashes=False)
def update_TotalPrice():
  try:
    data = readFile("JSON_CART_TOTALPRICE_FILE")
    newTotalPrice = request.get_json().get("totalPrice")

    if newTotalPrice is not None:
      data['totalPrice'] = newTotalPrice

    writeFile("JSON_CART_TOTALPRICE_FILE", data)
    
    return jsonify({"success": "Successfully updated total price"}), 200
  
  except FileNotFoundError as e:
    return jsonify({"error": f"File not found: {e}"}), 404
  except json.JSONDecodeError as e:
    return jsonify({"error": f"Invalid JSON: {e}"}), 400
  except Exception as e:
    return jsonify({"error": f"Unexpected error: {e}"}), 500