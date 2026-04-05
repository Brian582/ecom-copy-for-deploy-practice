from flask import Flask
from flask_cors import CORS

from payment import paypal_bp
from cart_items import cart_items_bp
from cart_totalprice import totalprice_bp

from users import users_bp
from users_orders import users_orders_bp
from send_sms import twilio_bp

app = Flask(__name__)
app.json.sort_keys = False
app.register_blueprint(paypal_bp) 

app.register_blueprint(cart_items_bp)
app.register_blueprint(totalprice_bp)

app.register_blueprint(users_bp)
app.register_blueprint(users_orders_bp)
app.register_blueprint(twilio_bp)

CORS(app)

if __name__ == '__main__':
  app.run(debug=True)