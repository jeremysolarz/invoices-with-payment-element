# Stripe Payment Integration with Custom Checkout

A sample Flask application demonstrating Stripe's Custom Checkout (Payment Element) with invoice creation.

> ⚠️ **DISCLAIMER**: This is an unofficial, community-created tool and is **NOT** affiliated with, endorsed by, or supported by Stripe, Inc. Use at your own risk. For official Stripe documentation and samples, visit [stripe.com/docs](https://stripe.com/docs).

## Features

- Custom Checkout UI using Stripe Elements
- Payment Element for card payments
- Billing and shipping address collection
- Automatic invoice creation
- Docker support for easy deployment

## Prerequisites

- Python 3.6+
- A [Stripe account](https://dashboard.stripe.com/register)
- Stripe API keys (test or live)
- A Price ID from your Stripe Dashboard

## Setup

### 1. Clone and configure environment

```bash
cp .env.example .env
```

Edit `.env` with your Stripe credentials:

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
PRICE=price_your_price_id
DOMAIN=http://localhost:4242
```

### 2. Run with Docker (Recommended)

```bash
docker-compose up --build
```

### 3. Or run locally

```bash
pip3 install -r requirements.txt
python3 server.py
```

## Usage

Open your browser and navigate to:

```
http://localhost:4242/checkout.html
```

## Project Structure

```
├── server.py           # Flask backend with Stripe API integration
├── public/
│   ├── checkout.html   # Checkout page
│   ├── checkout.js     # Stripe Elements initialization
│   ├── checkout.css    # Checkout styling
│   ├── complete.html   # Payment confirmation page
│   ├── complete.js     # Session status handling
│   └── complete.css    # Confirmation styling
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── .env                # Environment variables (not tracked in git)
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Your Stripe secret API key |
| `STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable API key |
| `PRICE` | The Price ID for the product being sold |
| `DOMAIN` | Your application domain (default: `http://localhost:4242`) |

## License

MIT

---

*This project is for educational and demonstration purposes only.*
