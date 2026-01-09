from flask import jsonify, request, Blueprint
from file_handler import readFile, writeFile
import json
from werkzeug.security import generate_password_hash, check_password_hash

users_bp = Blueprint("users", __name__)

#checks if user is in the json file
def verify_user(email, password):
	data = readFile('JSON_USERS')
	users = data.get('users', [])

	for u in users:
		if u["email"] == email.lower() and (check_password_hash(u["password"], password) or u["password"]==password):##### remove u["password"]==password later
			return {
							"authenticated": True,
							"user": {
									"userId": u["userId"],
									"name": u["name"],
									"email": u["email"],
									"identity": u["identity"]
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
		accountInfo = request.get_json()
		email = (accountInfo.get('email') or '').strip()
		password = accountInfo.get('password')

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
		accountInfo = request.get_json()
		name = accountInfo.get('name')
		email = (accountInfo.get('email') or '').strip() # removes whitespace characters
		hashed_password = generate_password_hash(accountInfo.get('password'))

		data = readFile('JSON_WORKERS')
		workers = data.get('workers')
		for w in workers:
			if w["name"] == email and w["email"] == email:
				identity = 'worker'
		
		identity = 'customer'

		# generate new userId
		try:
			max_id = max(int(u.get('userId', 0)) for u in users) if users else 0
		except Exception:
			max_id = len(users)
		new_id = str(max_id + 1)

		new_user = { 
			'user': new_id,
			'name' : name,
			'email':email,
			"password": hashed_password,
			'identity': identity,
		}
		
		data = readFile('JSON_USERS')
		users = data.get('users', [])
		users.append(new_user)
		data['users'] = users
		writeFile('JSON_USERSFILE', data)

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

