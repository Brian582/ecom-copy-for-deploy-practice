from flask import jsonify, request, Blueprint
from file_handler import readFile, writeFile
import json
import uuid

cart_items_bp = Blueprint("cart_items", __name__)


def _meal_id(meal):
  # support both mealId and meal_Id naming
  return meal.get('mealId') or meal.get('meal_Id') or meal.get('id')


def _find_cart_by_userid(cart_list, userId):
  for c in cart_list:
    if c.get('userId') is None and (userId is None):
      return c
    if c.get('userId') is not None and str(c.get('userId')) == str(userId):
      return c
  return None


def _generate_cart_id():
  return f"cart_{uuid.uuid4().hex[:8]}"


# returns the full list of carts
@cart_items_bp.route("/getCartItems", methods=['GET'], strict_slashes=False)
def get_CartItems():
  try:
    data = readFile("JSON_CARTFILE")
    cartItems = data.get('cart', [])
    return jsonify(cartItems)

  except FileNotFoundError as e:
    return jsonify({"error": f"File not found: {e}"}), 404
  except json.JSONDecodeError as e:
    return jsonify({"error": f"Invalid JSON: {e}"}), 400
  except KeyError as e:
    return jsonify({"error": f"Missing key in JSON: {e}"}), 400
  except Exception as e:
    return jsonify({"error": f"Unexpected error: {e}"}), 500


# replaces the full cart list
@cart_items_bp.route("/updateCartItems", methods=['PUT'], strict_slashes=False)
def update_cartItems():
  try:
    data = readFile("JSON_CARTFILE")
    payload = request.get_json() or {}
    cartItems = payload.get("updateItems")
    
    if cartItems is not None:
      data['cart'] = cartItems

    writeFile("JSON_CARTFILE", data)

    return jsonify({"success": "Successfully updated cart items"}), 200

  except FileNotFoundError as e:
    return jsonify({"error": f"File not found: {e}"}), 404
  except json.JSONDecodeError as e:
    return jsonify({"error": f"Invalid JSON: {e}"}), 400
  except Exception as e:
    return jsonify({"error": f"Unexpected error: {e}"}), 500


# Merge guest cart into a user's cart and empty guest cart
# Expects JSON body: { "userId": "<id>" }
@cart_items_bp.route("/mergeGuestToUser", methods=['POST'], strict_slashes=False)
def merge_guest_to_user():
  try:
    payload = request.get_json() or {}
    userId = payload.get('userId')

    if userId is None:
      return jsonify({'error': 'userId is required'}), 400

    # ensure the target user is a customer (do not merge for workers)
    try:
      users_data = readFile('JSON_USERS')
      users = users_data.get('users', [])
      target_user = next((u for u in users if str(u.get('userId')) == str(userId)), None)
      if target_user is None or str(target_user.get('role') or '').lower() != 'customer':
        return jsonify({'merged': False, 'reason': 'user not allowed to merge (not a customer)'}), 403
    except FileNotFoundError:
      # if users file missing, be conservative and block merge
      return jsonify({'merged': False, 'reason': 'users file not found'}), 500

    data = readFile("JSON_CARTFILE")
    cart_list = data.get('cart') or data.get('cart-Items') or []

    # find guest cart (userId == None) — prefer cartId == 'guest' if present
    guest_cart = None
    for c in cart_list:
      if c.get('userId') is None or c.get('userId') == 'null' or c.get('cartId') == 'guest':
        guest_cart = c
        break

    # find or create user cart
    user_cart = _find_cart_by_userid(cart_list, userId)
    if user_cart is None:
      user_cart = {
        'cartId': _generate_cart_id(),
        'userId': str(userId),
        'meals': []
      }
      cart_list.append(user_cart)

    # if there's a guest cart with meals, merge
    if guest_cart and guest_cart.get('meals'):
      guest_meals = guest_cart.get('meals') or []
      user_meals = user_cart.get('meals') or []

      # map existing user meals by meal id
      by_id = {}
      for m in user_meals:
        mid = _meal_id(m)
        if mid is not None:
          by_id[str(mid)] = m

      # merge guest meals into user meals
      for gm in guest_meals:
        gm_id = _meal_id(gm)
        if gm_id is None:
          continue
        key = str(gm_id)
        if key in by_id:
          # sum quantities (default 1)
          existing = by_id[key]
          existing_qty = int(existing.get('quantity') or 1)
          guest_qty = int(gm.get('quantity') or 1)
          existing['quantity'] = existing_qty + guest_qty
        else:
          # append copy of guest meal
          user_meals.append({**gm, 'quantity': int(gm.get('quantity') or 1)})

      # write merged meals back
      user_cart['meals'] = user_meals

      # empty guest cart meals
      guest_cart['meals'] = []

      # persist
      data['cart'] = cart_list
      writeFile('JSON_CARTFILE', data)

      return jsonify({'merged': True, 'userCart': user_cart}), 200

    # nothing to merge
    return jsonify({'merged': False, 'reason': 'no guest meals found', 'userCart': user_cart}), 200

  except FileNotFoundError as e:
    return jsonify({'error': f'File not found: {e}'}), 404
  except json.JSONDecodeError as e:
    return jsonify({'error': f'Invalid JSON: {e}'}), 400
  except Exception as e:
    return jsonify({'error': f'Unexpected error: {e}'}), 500