from flask import jsonify, request, Blueprint
from file_handler import readFile, writeFile
import json

cart_items_bp = Blueprint("cart_items", __name__)

#gets a user's cart items 
@cart_items_bp.route("/getCartItems", methods=['GET'], strict_slashes=False)
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
@cart_items_bp.route("/updateCartItems", methods=['PUT'], strict_slashes=False)
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