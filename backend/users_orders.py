from flask import jsonify, request, Blueprint
from file_handler import readFile, writeFile
import json

users_orders_bp = Blueprint("users_orders", __name__)

@users_orders_bp.route('/addUserOrder/<userID>', methods=['POST'], strict_slashes=False)
def add_user_order(userID):
	try:
		userOrder = request.get_json()
		data = readFile('JSON_USERS_ORDERS')
		users_orders = data.get('usersOrders', [])
		users_orders.append(userOrder)
		writeFile('JSON_USERSFILE', data)

		return jsonify({'added': True}), 201
	except FileNotFoundError as e:
		return jsonify({'error': f'users_orders file not found: {e}'}), 404
	except json.JSONDecodeError as e:
		return jsonify({'error': f'invalid users_orders json: {e}'}), 400
	except Exception as e:
		return jsonify({'error': f'unexpected error: {e}'}), 500

#gets user's orders
@users_orders_bp.route('/getUserOrders/<userID>', methods=['GET'], strict_slashes=False)
def get_user_orders(userId):
	try:
		data = readFile('JSON_USERS_ORDERS')
		users_orders = data.get('usersOrders', [])
		for u in users_orders:
			if u.get('userId').lower() == userId:
				return jsonify(u.get('orders'))
			
		return jsonify([])
	
	except FileNotFoundError as e:
		return jsonify({'error': f'users_orders file not found: {e}'}), 404
	except json.JSONDecodeError as e:
		return jsonify({'error': f'invalid users_orders json: {e}'}), 400
	except Exception as e:
		return jsonify({'error': f'unexpected error: {e}'}), 500

#get orders of all users
@users_orders_bp.route('/getUserOrders/<email>', methods=['GET'], strict_slashes=False)
def get_orders(workerId):
	try:
		data = readFile('JSON_WORKERS')
		workers = data.get('workers')
		for w in workers:
			if w["workerId"] != workerId:
				return jsonify({'authenticated': False})

		data = readFile('JSON_USERS_ORDERS')
		users_orders = data.get('usersOrders', [])
		orders = []
		for u in users_orders:
			if u.get('orders'):
				orders.append()
			
		return jsonify( {'authenticated': False, 'orders': orders })
	
	except FileNotFoundError as e:
		return jsonify({'error': f'users_orders file not found: {e}'}), 404
	except json.JSONDecodeError as e:
		return jsonify({'error': f'invalid users_orders json: {e}'}), 400
	except Exception as e:
		return jsonify({'error': f'unexpected error: {e}'}), 500


############# edit this 
# @users_orders_bp.route('/deleteUserOrder', methods=['DELETE'], strict_slashes=False)
# def delete_user_order():
# 	try:
# 		payload = request.get_json() or {}
# 		email = (payload.get('email') or '').strip()
# 		orderId = payload.get('orderId')

# 		if not email or orderId is None:
# 			return jsonify({'error': 'email and orderId required'}), 400

# 		path = _users_orders_path()
# 		with open(path, 'r', encoding='utf-8') as f:
# 			data = json.load(f)

# 		users_orders = data.get('usersOrders', [])
# 		modified = False
# 		for u in users_orders:
# 			if u.get('email', '').lower() == email.lower():
# 				orig_len = len(u.get('orders', []))
# 				u['orders'] = [o for o in u.get('orders', []) if str(o.get('orderId')) != str(orderId)]
# 				if len(u['orders']) != orig_len:
# 					modified = True
# 				break

# 		if not modified:
# 			return jsonify({'deleted': False, 'reason': 'order not found'}), 404

# 		data['usersOrders'] = users_orders
# 		with open(path, 'w', encoding='utf-8') as f:
# 			json.dump(data, f, indent=2)

# 		return jsonify({'deleted': True}), 200
# 	except FileNotFoundError as e:
# 		return jsonify({'error': f'users_orders file not found: {e}'}), 404
# 	except json.JSONDecodeError as e:
# 		return jsonify({'error': f'invalid users_orders json: {e}'}), 400
# 	except Exception as e:
# 		return jsonify({'error': f'unexpected error: {e}'}), 500