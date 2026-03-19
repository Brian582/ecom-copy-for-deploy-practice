from twilio.rest import Client
import os
from dotenv import load_dotenv
from flask import Blueprint

twilio_bp = Blueprint("twilio", __name__)

load_dotenv()

# live crendentials
account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token = os.getenv("TWILIO_AUTH_TOKEN")

def send_order_status_sms(order, phone_number):

    client = Client(account_sid, auth_token)
    message = f"Your order #{order.get('orderId')} is now {order.get('status') }."

    client.messages.create(
        body = message,
        from_ = '+18449833971',
        to = phone_number
    )
