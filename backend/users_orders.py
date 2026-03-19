from flask import jsonify, request, Blueprint
from file_handler import readFile, writeFile
import json

from send_sms import send_order_status_sms

users_orders_bp = Blueprint("users_orders", __name__)

# Get user's orders. # Workers receive all orders; regular users receive only their own.
@users_orders_bp.route('/getUserOrders/<userID>', methods=['GET'], strict_slashes=False)
def get_user_orders(userID):
	try:
		# Convert ID to string for comparison
		user_id = str(userID)

		# check if user is a worker
		workers_data = readFile('JSON_STAFF') or {}
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

@users_orders_bp.route('/addOrder', methods=['POST'], strict_slashes=False)
def add_order():
	try:
		payload = request.get_json() or {}
		user_id = payload.get('userId')
		name = payload.get('name') or 'Guest'
		meals = payload.get('meals', [])

		# allow both legacy and user id-supplied values
		if user_id is None:
			user_id = None

		orders = readFile('JSON_USERS_ORDERS') or []

		# generate sequential numeric orderId; preserve existing IDs even if non-numeric
		max_order_id = 0
		for o in orders:
			try:
				num = int(o.get('orderId', 0))
				if num > max_order_id:
					max_order_id = num
			except Exception:
				continue

		new_order_id = str(max_order_id + 1)

		new_order = {
			'userId': str(user_id) if user_id is not None else None,
			'name': name,
			'orderId': new_order_id,
			'status': 'new',
			'last_notified_status': 'new',
			'meals': meals
		}

		orders.append(new_order)
		writeFile('JSON_USERS_ORDERS', orders)

		return jsonify({'added': True, 'order': new_order}), 201
	except FileNotFoundError as e:
		return jsonify({'error': f'users_orders file not found: {e}'}), 404
	except json.JSONDecodeError as e:
		return jsonify({'error': f'invalid users_orders json: {e}'}), 400
	except Exception as e:
		return jsonify({'error': f'unexpected error: {e}'}), 500


@users_orders_bp.route('/deleteOrder/<order_id>', methods=['DELETE'], strict_slashes=False)
def delete_order(order_id):
	try:
		orders = readFile('JSON_USERS_ORDERS') or []
		orders = [o for o in orders if str(o.get('orderId')) != str(order_id)]
		writeFile('JSON_USERS_ORDERS', orders)
		return jsonify({"message": "Order deleted"}), 200
	except FileNotFoundError as e:
		return jsonify({'error': f'users_orders file not found: {e}'}), 404
	except json.JSONDecodeError as e:
		return jsonify({'error': f'invalid users_orders json: {e}'}), 400
	except Exception as e:
		return jsonify({'error': f'unexpected error: {e}'}), 500

#Update the status of a specific order and notifies user by sending sms
@users_orders_bp.route("/updateOrders/<order_id>/status", methods=["PATCH"], strict_slashes=False)
def update_order_status(order_id):
	data = request.get_json()

	#Ensure request contains JSON and includes a non-empty "status" key
	if not data or not data.get("status"):
		return jsonify({"error": "Status required"}), 400

	new_status = data.get("status")
	notify = data.get("notify", True)  # default to True

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

	# Only send SMS if notify is True and user hasn't already notified for this status
	if notify and order.get("last_notified_status") != new_status:
		
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