from twilio.rest import Client
import os
from dotenv import load_dotenv
from flask import Blueprint

twilio_bp = Blueprint("twilio", __name__)

load_dotenv()

# live crendentials
# account_sid = os.getenv("TWILIO_ACCOUNT_SID")
# auth_token = os.getenv("TWILIO_AUTH_TOKEN")

# test credentials
account_sid = os.getenv("TWILIO_ACCOUNT_SID_TEST")
auth_token = os.getenv("TWILIO_AUTH_TOKEN_TEST")

#When using test credentials, this is the only phone number that makes sending messages give successful response
from_phone_number = os.getenv("TWILIO_PHONE_NUMBER_TEST")

def send_order_status_sms(order, phone_number):

    client = Client(account_sid, auth_token)

    message = f"Your order #{order.get('orderId')} is now {order.get('status') }."
    
    # virtual_phone_number = '+18777804236' 

    client.messages.create(
        body = message,
        # from_ = '+18449833971',
        # to = virtual_phone_number
        from_ = str(from_phone_number),
        to = phone_number
    )
