let stripe;
let checkout;
let actions;
initialize();

document
  .querySelector("#payment-form")
  .addEventListener("submit", handleSubmit);

// Fetches config and Checkout Session, then initializes Stripe
async function initialize() {
  // Fetch publishable key from server
  const { publishableKey } = await fetch("/config").then((r) => r.json());
  stripe = Stripe(publishableKey);

  const promise = fetch("/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
    .then((r) => r.json())
    .then((r) => r.clientSecret);

  const appearance = {
    theme: 'stripe',
  };
  checkout = stripe.initCheckout({
    clientSecret: promise,
    elementsOptions: { appearance },
  });

  checkout.on('change', (session) => {
    // Handle changes to the checkout session
  });

  const loadActionsResult = await checkout.loadActions();
  if (loadActionsResult.type === 'success') {
    actions = loadActionsResult.actions;
    const session = loadActionsResult.actions.getSession();
    document.querySelector("#button-text").textContent = `Pay ${
      session.total.total.amount
    } now`;
  }


  const paymentElement = checkout.createPaymentElement();
  paymentElement.mount("#payment-element");
  const billingAddressElement = checkout.createBillingAddressElement();
  billingAddressElement.mount("#billing-address-element");
  const shippingAddressElement = checkout.createShippingAddressElement();
  shippingAddressElement.mount("#shipping-address-element");
}

async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);

  const { error } = await actions.confirm();

  // This point will only be reached if there is an immediate error when
  // confirming the payment. Otherwise, your customer will be redirected to
  // your `return_url`. For some payment methods like iDEAL, your customer will
  // be redirected to an intermediate site first to authorize the payment, then
  // redirected to the `return_url`.
  showMessage(error.message);

  setLoading(false);
}

// ------- UI helpers -------

function showMessage(messageText) {
  const messageContainer = document.querySelector("#payment-message");

  messageContainer.classList.remove("hidden");
  messageContainer.textContent = messageText;

  setTimeout(function () {
    messageContainer.classList.add("hidden");
    messageContainer.textContent = "";
  }, 4000);
}

// Show a spinner on payment submission
function setLoading(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("#submit").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("#submit").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
}