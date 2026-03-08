from flask import jsonify, request, Blueprint
from file_handler import readFile, writeFile
import json
from werkzeug.security import generate_password_hash, check_password_hash

users_bp = Blueprint("users", __name__)

#checks if user is in the json file
def verify_user(email, password):
	data = readFile('JSON_USERS')
	users = data.get('users', [])

	users_by_email = { u["email"].lower(): u for u in users}
	email = email.lower()
	user = users_by_email.get(email)

	if not user:
		return {"authenticated": False, "user": None}

	if user:
		stored = user.get('password')
		# support both hashed passwords (werkzeug) and legacy plaintext/numeric passwords
		try:
			if isinstance(stored, str) and (stored.startswith('pbkdf2:') or ':' in stored):
				valid = check_password_hash(stored, password)
			else:
				# fallback: compare string forms for legacy plain passwords
				valid = str(stored) == str(password)
		except Exception:
			valid = False

		if valid:
			return {
				"authenticated": True,
				"user": {
					"userId": user.get("userId"),
					"name": user.get("name"),
					"email": user.get("email"),
					"role": user.get("role"),
					"phoneNumber": user.get("phone_number"),
				}
	}

	return {
		"authenticated": False,
		"user": None
	}
	
#signs user into their account
@users_bp.route('/signIn', methods=['POST'], strict_slashes=False)
def signIn():
	try:
		request_data = request.get_json()
		email = (request_data.get('email') or '').strip()
		password = request_data.get('password')

		result = verify_user(email,password)

		if result["authenticated"]:
			return jsonify(result), 200
		
		return jsonify(result), 401
	
	except FileNotFoundError as e:
		return jsonify({'error': f'users file not found: {e}'}), 404
	except json.JSONDecodeError as e:
		return jsonify({'error': f'invalid users json: {e}'}), 400
	except Exception as e:
		return jsonify({'error': f'unexpected error: {e}'}), 500


@users_bp.route('/addUser', methods=['POST'], strict_slashes=False)
def add_user():
	try:
		request_data = request.get_json()
		name = request_data.get('name')
		email = (request_data.get('email') or '').strip() # removes whitespace characters
		hashed_password = generate_password_hash(request_data.get('password'), salt_length=4)
		phone_number = request_data.get('phone')

		# Check if user is a worker
		workers_data = readFile('JSON_STAFF')
		workers = workers_data.get('workers')

		role = "worker" if any( (worker['email'] == email and worker['name'] == name) for worker in workers) else "customer"

		# Read users and generate new ID
		users_data = readFile('JSON_USERS')
		users = users_data.get('users', [])
	
		# generate new userId
		try:
			max_id = max(int(u.get('userId', 0)) for u in users) if users else 0
		except Exception:
			max_id = len(users)
		new_id = str(max_id + 1)

		new_user = { 
			'userId': new_id,
			'name' : name,
			'email':email,
			"password": hashed_password,
			"phone_number": phone_number,
			'role': role,
		}
		
		users.append(new_user)
		users_data['users'] = users
		writeFile('JSON_USERS', users_data)

		return jsonify({'added': True, 'user': new_user}), 201
	except FileNotFoundError as e:
		return jsonify({'error': f'users file not found: {e}'}), 404
	except json.JSONDecodeError as e:
		return jsonify({'error': f'invalid users json: {e}'}), 400
	except Exception as e:
		return jsonify({'error': f'unexpected error: {e}'}), 500


@users_bp.route('/deleteUser', methods=['DELETE'], strict_slashes=False)
def delete_user():
	try:
		payload = request.get_json() or {}
		email = (payload.get('email') or '').strip()
		userId = payload.get('userId')

		data = readFile('JSON_USERSFILE')
		users = data.get('users', [])

		if email:
			new_users = [u for u in users if u.get('email', '').lower() != email.lower()]
		elif userId is not None:
			new_users = [u for u in users if str(u.get('userId')) != str(userId)]
		else:
			return jsonify({'error': 'email or userId required'}), 400

		if len(new_users) == len(users):
			return jsonify({'deleted': False, 'reason': 'user not found'}), 404

		data['users'] = new_users
		writeFile('JSON_USERSFILE', data)
		return jsonify({'deleted': True}), 200
	except FileNotFoundError as e:
		return jsonify({'error': f'users file not found: {e}'}), 404
	except json.JSONDecodeError as e:
		return jsonify({'error': f'invalid users json: {e}'}), 400
	except Exception as e:
		return jsonify({'error': f'unexpected error: {e}'}), 500

