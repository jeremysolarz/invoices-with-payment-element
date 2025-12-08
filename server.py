#! /usr/bin/env python3.6

"""
server.py
Stripe Sample.
Python 3.6 or newer required.
"""
import os
import uuid
from flask import Flask, jsonify, request

import stripe
# Load Stripe API key from environment variable
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')
stripe.api_version = os.environ.get('STRIPE_API_VERSION', '2025-11-17.clover')

print(os.environ.get('STRIPE_SECRET_KEY'))

app = Flask(__name__,
            static_url_path='',
            static_folder='public')

YOUR_DOMAIN = os.environ.get('DOMAIN', 'http://localhost:4242')

@app.route('/config', methods=['GET'])
def get_config():
    return jsonify(publishableKey=os.environ.get('STRIPE_PUBLISHABLE_KEY'))

@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    try:
        session = stripe.checkout.Session.create(
            ui_mode='custom',
            customer_email='customer@example.com',
            billing_address_collection='auto',
            shipping_address_collection={
              'allowed_countries': ['DE'],
            },
            line_items=[
                {
                    'price': os.environ.get('PRICE'),
                    'quantity': 1,
                },
            ],
            invoice_creation={
                'enabled': True,
                'invoice_data': {
                    'description': 'Invoice for the payment',
                    'metadata': {
                        'order_id': str(uuid.uuid4()),
                    },
                },
            },
            mode='payment',
            return_url=YOUR_DOMAIN + '/complete.html?session_id={CHECKOUT_SESSION_ID}',
            automatic_tax={'enabled': True},
        )
    except Exception as e:
        print(f"Error creating checkout session: {e}")
        return jsonify(error=str(e)), 400

    return jsonify(clientSecret=session.client_secret)

@app.route('/session-status', methods=['GET'])
def session_status():
  session = stripe.checkout.Session.retrieve(request.args.get('session_id'), expand=["payment_intent"])

  return jsonify(status=session.status, payment_status=session.payment_status, payment_intent_id=session.payment_intent.id, payment_intent_status=session.payment_intent.status)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 4242))
    app.run(host='0.0.0.0', port=port, debug=True)