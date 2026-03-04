from flask import jsonify, request, Blueprint
from file_handler import readFile, writeFile
import json

from send_sms_live import send_order_status_sms

users_orders_bp = Blueprint("users_orders", __name__)

# Get user's orders. # Workers receive all orders; regular users receive only their own.
@users_orders_bp.route('/getUserOrders/<userID>', methods=['GET'], strict_slashes=False)
def get_user_orders(userID):
	try:
		# Convert ID to string for comparison
		user_id = str(userID)

		# check if user is a worker
		workers_data = readFile('JSON_WORKERS') or {}
		workers = workers_data.get('workers', [])
		is_worker = any(str(w.get('workerId')) == user_id for w in workers)

		users_orders_data = readFile('JSON_USERS_ORDERS') or {}
		users_orders = users_orders_data

		result_orders = []

		if is_worker:
			# aggregate all orders from all users
			result_orders = [format_order(u) for u in users_orders]
		else:
			# not a worker — find the matching user's orders
			result_orders = [
				format_order(u)
				for u in users_orders
				if str(u.get('userId')) == user_id
			]

		return jsonify(result_orders) # Return all formatted orders as JSON response
	except FileNotFoundError as e:
		return jsonify({'error': f'users_orders file not found: {e}'}), 404
	except json.JSONDecodeError as e:
		return jsonify({'error': f'invalid users_orders json: {e}'}), 400
	except Exception as e:
		return jsonify({'error': f'unexpected error: {e}'}), 500

def format_order(u):
	# Extract order details
	order_id = u.get('orderId')
	status = u.get('status')
	meals = u.get('meals', [])

	# Format meal data for ManageOrders frontend format
	items = [
			{'name': m.get('name'),
		 	'checked': False} # Default state for UI checkbox
			for m in meals
    ]

	# Format order data for ManageOrders frontend format
	return {
		'id': int(order_id) if str(order_id).isdigit() else order_id,
		'status': status,
		'items': items
	}

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
# 				u['orders'] = [o for o in u.get('orders', []) if str(u.get('orderId')) != str(orderId)]
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

#Update the status of a specific order and notifies user by sending sms
@users_orders_bp.route("/updateOrders/<order_id>/status", methods=["PATCH"], strict_slashes=False)
def update_order_status(order_id):
	data = request.get_json()

	#Ensure request contains JSON and includes a non-empty "status" key
	if not data or not data.get("status"):
		return jsonify({"error": "Status required"}), 400

	new_status = data.get("status")

	# ALLOWED_STATUSES = {
	# 	"new", 
	#  	"processing", 
	# 	"done"
	# 	}
	
	# #Validate that new status is an acceptable value
	# if new_status not in ALLOWED_STATUSES:
	# 		return jsonify({"error": "Invalid status"}), 400

	users = readFile('JSON_USERS')
	orders = readFile('JSON_USERS_ORDERS')

	# Build dictionaries for fast lookup (O(1) lookup)
	users_by_id = {user["userId"]: user for user in users["users"]}
	orders_by_id = {order["orderId"]: order for order in orders}

	order = orders_by_id.get(order_id)
	if not order:
		return jsonify({"error": "Order not found"}), 404

	# Store the current status before making changes
	prev_status = order.get("status")

	if prev_status == new_status:
		return jsonify({"message": "No change"}), 200

	# Update order's status
	order["status"] = new_status

	# Only send SMS if user hasn't already notified for this status
	if order.get("last_notified_status") != new_status:
		
		# Notify user by sending SMS if a phone number exists
		user = users_by_id.get(order.get("userId"))
		if user and user.get("phone_number"):
			try:
				send_order_status_sms(order, user.get("phone_number"))
				order["last_notified_status"] = new_status
			except Exception as e:
				print("SMS failed:", e)

	# Persist order updates to users_orders.json file
	writeFile('JSON_USERS_ORDERS', orders)

	return jsonify({"message": "Order updated"}), 200