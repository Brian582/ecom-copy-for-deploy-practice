from twilio.rest import Client
import os
from dotenv import load_dotenv
# from flask import Blueprint

# twilio_bp = Blueprint("twilio", __name__)

# account_sid = os.environ["TWILIO_ACCOUNT_SID"]
# auth_token = os.environ["TWILIO_AUTH_TOKEN"]

load_dotenv()

account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token = os.getenv("TWILIO_AUTH_TOKEN")

client = Client(account_sid, auth_token)

print(f"sid {account_sid}")
print(f"token {auth_token}")

message = client.messages.create(
    body="Hello, magic number test!",
    # from_=os.getenv("TWILIO_PHONE_NUMBER"),  # your Twilio number
    # to="+10987654321"     # recipient number

    # from_="+15017122661",
    # to="+15558675310",

    # from_="+15005550006",  # success magic number
    # to="+14155552671"       # can be any number

    from_="+18449833971",  # my toll-free phone number
    to="+18777804236",       # twilio virtual phone number
)

print(message.body)