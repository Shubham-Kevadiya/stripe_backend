export default {
  TYPE: 'card',
  STRIPE_TEST_CARD: {
    TOK_VISA: 'tok_visa',
    TOK_VISA_DEBIT: 'tok_visa_debit',
    TOKE_MASTERCARD: 'tok_mastercard',
    TOK_MASTERCARD_PREPAID: 'tok_mastercard_prepaid',
    TOK_AMEX: 'tok_amex',
  },
  PAYMENT_TYPE: {
    INTENT: 'intent',
    SUBSCRIPTION: 'subscription',
  },
  PLAN_TYPE: {
    ONE_TIME: 'one-time',
  },
  INTERVAL: {
    WEEK: 'week',
    MONTH: 'month',
    YEAR: 'year',
  },
  SUBSCRIPTION: { COLLECTION_METHOD: 'charge_automatically' },
  PAUSE_COLLECTION_TYPE: {
    MARK_UNCOLLECTIBLE: 'keep_as_draft',
    // MARK_UNCOLLECTIBLE: "mark_uncollectible",
    NULL: 'null',
  },
  STRIPE_ERROR_CODES: { card_declined: { error: 'INSUFFICIENT_BALANCE' } },
};
