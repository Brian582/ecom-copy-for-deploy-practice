from twilio.rest import Client
import os
from dotenv import load_dotenv
from flask import Blueprint

twilio_bp = Blueprint("twilio", __name__)

load_dotenv()

# live crendentials
account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token = os.getenv("TWILIO_AUTH_TOKEN")

# test credentials
# account_sid = os.getenv("TWILIO_ACCOUNT_SID_TEST")
# auth_token = os.getenv("TWILIO_AUTH_TOKEN_TEST")

#When using test credentials, this is the only phone number that makes sending messages give successful response
from_phone_number = os.getenv("TWILIO_PHONE_NUMBER_TEST")

# @twilio_bp.route("/send-sms", methods=["POST"], strict_slashes=False)
# def send_sms():
# 	try:
# 		data = request.get_json() or {}
# 		customer = data.get('user')
# 		order_status = data.get('columnTitle')
# 		orderID = data.get('orderID')
# 		customer_phone_number = data.get('customerPhoneNumber',"15005550006")
		# print(f"customer_phone_number {customer_phone_number}")

# 		# validate required config and payload before calling Twilio
# 		# if not account_sid or not auth_token:
# 		# 	msg = "Twilio credentials not configured"
# 		# 	print(msg)
# 		# 	return jsonify({"error": msg}), 500

# 		# if not customer_phone_number:
# 		# 	msg = "Missing customerPhoneNumber in request"
# 		# 	print(msg)
# 		# 	return jsonify({"error": msg}), 400

# 		if order_status == "New Order":
# 			message_body = f"{customer} your Order {orderID} has just been received."

# 		elif order_status == "Processing":
# 			message_body = f"{customer} your Order {orderID} is now being processed."

# 		elif order_status == "Done":
# 			message_body = f"{customer} your Order {orderID} is now being shipped out."

# 		print("before", message_body)
# 		client = Client(account_sid, auth_token)
# 		message = client.messages.create(
# 			body=message_body,
# 			# from_=os.getenv("TWILIO_PHONE_NUMBER"), # my toll-free phone number (my Twilio number)
# 			# to="+18777804236",       # twilio virtual phone number (recipient number)
# 			from_=os.getenv("TWILIO_PHONE_NUMBER_TEST"), # twilio magic phone number
# 			to=customer_phone_number #customer's phone number would be in "to" but for now it has to be the "twilio virtual phone number"
# 		)
# 		print("after",message.body)
# 		return jsonify({"sent": True, "message": message.body}), 200
	
# 	except Exception as e:
# 		# Return an error response so CORS headers are included and frontend sees status
# 		print(f"Error occurred when sending message: {e}")
# 		return jsonify({"error": str(e)}), 500

def send_order_status_sms(order, phone_number):

    client = Client(account_sid, auth_token)

    message = f"Your order #{order.get('orderId')} is now {order.get('status') }."
    
    virtual_phone_number = '+18777804236' 

    client.messages.create(
        body = message,
        from_ = '+18449833971',
        to = virtual_phone_number
    )