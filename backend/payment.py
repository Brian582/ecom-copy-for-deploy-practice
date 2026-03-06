from base64 import b64encode
from flask import jsonify, Blueprint
import os
import requests
from cart_totalprice import get_PaymentTotal

paypal_bp = Blueprint("paypal", __name__)

PAYPAL_SANDBOX_CLIENT_ID = os.getenv("PAYPAL_SANDBOX_CLIENT_ID")
PAYPAL_SECRET = os.getenv("PAYPAL_SECRET")

PAYPAL_URL = "https://api-m.sandbox.paypal.com"  # sandbox,

#gets access token
def get_access_token():
  try:
    auth = b64encode(f"{PAYPAL_SANDBOX_CLIENT_ID}:{PAYPAL_SECRET}".encode()).decode()

    headers = {
      "Authorization": f"Basic {auth}",
      "Content-Type": "application/x-www-form-urlencoded"
      }
    data = {"grant_type": "client_credentials"}

    r = requests.post(f"{PAYPAL_URL}/v1/oauth2/token", headers=headers, data=data)
    r.raise_for_status() #handles errors
    return r.json()["access_token"]

  except Exception as e:
    # This block will execute if any exception occurs in the try block
    print(f"Access error: {e}")

# Creates a PayPal order using the current payment total
@paypal_bp.route("/create-order", methods=["POST"])
def create_order():
  access_token = get_access_token()
  payment_total = get_PaymentTotal()
  
  headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {access_token}"
  }

  data = {
    "intent": "CAPTURE",
    "purchase_units": [
      {
        "amount": {
            "currency_code": "USD",
            "value": f"{payment_total:.2f}" 
        }
      }
    ]
  }

  r = requests.post(f"{PAYPAL_URL}/v2/checkout/orders", json=data, headers=headers)
  r.raise_for_status()

  return jsonify(r.json())

# Captures and completes Paypal order
@paypal_bp.route("/capture-order/<paypal_order_id>", methods=["POST"])
def capture_order(paypal_order_id):
  access_token = get_access_token()

  headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {access_token}"
  }

  r = requests.post(f"{PAYPAL_URL}/v2/checkout/orders/{paypal_order_id}/capture",
                    headers=headers)
  r.raise_for_status()

  return jsonify(r.json())
