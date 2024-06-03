const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')('sk_test_51PNbYpP84q1Pc9qVtu0cQxObdbPrUh3bbn9Pu4tkWQLsVZylgPwe2eKeQIhF1xBwfM87bbrJ60NrnYvfD8KXVgbq00uLPgHIFO'); // Replace with your Stripe secret key

admin.initializeApp();

// Function to create a new Stripe account for the seller
exports.createStripeAccount = functions.https.onRequest(async (req, res) => {
  try {
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US', // Adjust as necessary
      email: req.body.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    res.status(200).send({
      accountId: account.id,
    });
  } catch (error) {
    res.status(500).send({
      error: error.message,
    });
  }
});

// Function to create an account link for Stripe onboarding
exports.createAccountLink = functions.https.onRequest(async (req, res) => {
  try {
    const { accountId } = req.body;

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: 'https://your-app.com/reauth', // Replace with your actual URL
      return_url: 'https://your-app.com/return', // Replace with your actual URL
      type: 'account_onboarding',
    });

    res.status(200).send({
      url: accountLink.url,
    });
  } catch (error) {
    res.status(500).send({
      error: error.message,
    });
  }
});

// Function to create a login link for the Express Dashboard
exports.createDashboardLink = functions.https.onRequest(async (req, res) => {
  try {
    const { accountId } = req.body;

    const loginLink = await stripe.accounts.createLoginLink(accountId);

    res.status(200).send({
      url: loginLink.url,
    });
  } catch (error) {
    res.status(500).send({
      error: error.message,
    });
  }


  // Function to fetch payments for a fournisseur
  exports.fetchPayments = functions.https.onRequest(async (req, res) => {
    try {
      const { accountId } = req.query; // Get the account ID from the query parameters

      const charges = await stripe.charges.list({
        limit: 100,
        stripeAccount: accountId, // Fetch payments for this specific Stripe account
      });

      res.status(200).send(charges.data);
    } catch (error) {
      res.status(500).send({
        error: error.message,
      });
    }
});
