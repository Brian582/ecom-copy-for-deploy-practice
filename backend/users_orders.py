from flask import jsonify, request, Blueprint
from file_handler import readFile, writeFile
import json

users_orders_bp = Blueprint("users_orders", __name__)

# @users_orders_bp.route('/addUserOrder/<userID>', methods=['POST'], strict_slashes=False)
# def add_user_order():
# 	try:
# 		userOrder = request.get_json()
# 		data = readFile('JSON_USERS_ORDERS')
# 		users_orders = data.get('usersOrders', [])
# 		users_orders.append(userOrder)
# 		data['usersOrders'] = users_orders
# 		writeFile('JSON_USERS_ORDERS', data)

# 		return jsonify({'added': True}), 201
# 	except FileNotFoundError as e:
# 		return jsonify({'error': f'users_orders file not found: {e}'}), 404
# 	except json.JSONDecodeError as e:
# 		return jsonify({'error': f'invalid users_orders json: {e}'}), 400
# 	except Exception as e:
# 		return jsonify({'error': f'unexpected error: {e}'}), 500

# gets user's orders. If the requester is a worker (exists in workers list), return all orders.
@users_orders_bp.route('/getUserOrders/<userID>', methods=['GET'], strict_slashes=False)
def get_user_orders(userID):
	try:
		# normalize id to string for comparison
		user_id = str(userID)

		# check if user is a worker
		workers_data = readFile('JSON_WORKERS') or {}
		workers = workers_data.get('workers', [])
		is_worker = any(str(w.get('workerId')) == user_id for w in workers)

		users_orders_data = readFile('JSON_USERS_ORDERS') or {}
		users_orders = users_orders_data.get('usersOrders', [])

		result_orders = []

		if is_worker:
			# aggregate all orders from all users
			for u in users_orders:
				for o in u.get('orders', []):
					# normalize order shape for frontend ManageOrders
					order_id = o.get('orderId')
					status = o.get('status')
					meals = o.get('meals', [])
					items = []
					for m in meals:
						items.append({ 'name': m.get('name'), 'checked': False })
					result_orders.append({ 'id': int(order_id) if str(order_id).isdigit() else order_id, 'status': status, 'items': items })
			return jsonify(result_orders)

		# not a worker — find the matching user's orders
		for u in users_orders:
			if str(u.get('userId')) == user_id:
				for o in u.get('orders', []):
					order_id = o.get('orderId')
					status = o.get('status')
					meals = o.get('meals', [])
					items = []
					for m in meals:
						items.append({ 'name': m.get('name'), 'checked': False })
					result_orders.append({ 'id': int(order_id) if str(order_id).isdigit() else order_id, 'status': status, 'items': items })
				return jsonify(result_orders)

		return jsonify([])
	except FileNotFoundError as e:
		return jsonify({'error': f'users_orders file not found: {e}'}), 404
	except json.JSONDecodeError as e:
		return jsonify({'error': f'invalid users_orders json: {e}'}), 400
	except Exception as e:
		return jsonify({'error': f'unexpected error: {e}'}), 500


#get orders of all users
# (old worker endpoint removed — logic consolidated in get_user_orders)


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