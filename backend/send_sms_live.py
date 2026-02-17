from twilio.rest import Client
import os
from dotenv import load_dotenv
from flask import Blueprint, request

twilio_bp = Blueprint("twilio", __name__)

load_dotenv()

# live crendentials
# account_sid = os.getenv("TWILIO_ACCOUNT_SID")
# auth_token = os.getenv("TWILIO_AUTH_TOKEN")

#test credentials
account_sid = os.getenv("TWILIO_ACCOUNT_SID_TEST")
auth_token = os.getenv("TWILIO_AUTH_TOKEN_TEST")

@twilio_bp.route("/send-sms", methods=["POST"])
def send_sms():
	try:
		client = Client(account_sid, auth_token)
		data = request.get_json()
		customer = data.get('user')
		order_status = data.get('columnTitle')
		orderID = data.get('orderID')
		customer_phone_number = data.get('customerPhoneNumber')

		if order_status == "New Order":
			message_body = f"{customer} your Order {orderID} has just been received."

		elif order_status == "Processing":
			message_body = f"{customer} your Order {orderID} is now being processed."

		elif order_status == "Done":
			message_body = f"{customer} your Order {orderID} is now being shipped out."

		message = client.messages.create(
			body=message_body,
			from_=os.getenv("TWILIO_PHONE_NUMBER"), # my toll-free phone number (my Twilio number)
			# to="+18777804236",       # twilio virtual phone number (recipient number)
			to=customer_phone_number #customer's phone number would be in "to" but for now it has to be the "twilio virtual phone number"
		)

		print(message.body)
	except Exception as e:
		# This block will execute if any exception occurs in the try block
		print(f"Error occurred when sending message: {e}"), 500