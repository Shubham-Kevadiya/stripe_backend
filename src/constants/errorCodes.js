export default {
  UNAUTHORIZE: {
    httpStatusCode: 401,
    body: {
      code: 'unauthorize',
      message: 'You are not authorize for this access.',
    },
  },
  FORBIDDEN: {
    httpStatusCode: 403,
    body: {
      code: 'forbidden',
      message:
        "Access Denied, You don't have permission to access! Please contact administrator",
    },
  },
  RESOURCE_NOT_FOUND: {
    httpStatusCode: 404,
    body: {
      code: 'resource_not_found',
      message: 'Requested resource not found.',
    },
  },
  CONFLICT: {
    httpStatusCode: 409,
    body: {
      code: 'conflict',
      message: 'Conflict - Cannot process the request.',
    },
  },
  INTERNAL_SERVER_ERROR: {
    httpStatusCode: 500,
    body: {
      code: 'internal_server_error',
      message: 'Something went wrong, please try again later.',
    },
  },
  INVALID_USER_OR_PASSWORD: {
    httpStatusCode: 401,
    body: {
      code: 'invalid_user_or_password',
      message: 'Invalid User or Password',
    },
  },
  USER_NOT_FOUND: {
    httpStatusCode: 404,
    body: {
      code: 'user_not_found',
      message: 'User Not Found',
    },
  },
  USER_ALREADY_EXIST: {
    httpStatusCode: 401,
    body: {
      code: 'user_already_exist',
      message: 'User Already Exist',
    },
  },
  PRODUCT_ALREADY_EXIST: {
    httpStatusCode: 401,
    body: {
      code: 'product_already_exist',
      message: 'Product Already Exist',
    },
  },
  PRODUCT_NAME_ALREADY_EXIST: {
    httpStatusCode: 401,
    body: {
      code: 'product_name_already_exist',
      message: 'Product Name Already Exist',
    },
  },
  PROMOCODE_NAME_ALREADY_EXIST: {
    httpStatusCode: 401,
    body: {
      code: 'promocode_name_already_exist',
      message: 'Promocode Name Already Exist',
    },
  },
  INVALID_PASSWORD: {
    httpStatusCode: 401,
    body: {
      code: 'invalid_password',
      message: 'Invalid Password',
    },
  },
  NOT_FOUND: {
    httpStatusCode: 404,
    body: {
      code: 'not_found',
      message: 'Not Found',
    },
  },
  BAD_CREDENTIALS: {
    httpStatusCode: 422,
    body: {
      code: 'bad_credentials',
      message: 'invalid data - Cannot process the request.',
    },
  },
  CARD_USED_IN_ACTIVE_SUBSCRIPTION: {
    httpStatusCode: 422,
    body: {
      code: 'card_used_in_ative_subscription',
      message:
        'Your card is used in your active subscription. To delete your card please select other default card to pay subscription',
    },
  },
  CARD_NOT_OWNED_BY_USER: {
    httpStatusCode: 400,
    body: {
      code: 'card_not_owned_by_user',
      message: "You don't owned this card. Please enter valid card again",
    },
  },
  PAYMENT_METHOD_NOT_FOUND: {
    httpStatusCode: 400,
    body: {
      code: 'payment_method_not_found',
      message: "Payment method doesn't exist, please try again later",
    },
  },
  INSUFFICIENT_BALANCE: {
    httpStatusCode: 402,
    body: {
      code: 'insufficient_balance',
      message: 'You do not have sufficient balance to pay',
    },
  },
  PROMOCODE_NOT_AVAILABLE: {
    httpStatusCode: 401,
    body: {
      code: 'promocode_not_available',
      message: 'Promocode Not Available',
    },
  },
  PROMOCODE_LIMIT_EXCEEDED: {
    httpStatusCode: 401,
    body: {
      code: 'promocode_limit_exceeded',
      message: 'Promocode Limit Exceeded',
    },
  },
  PROMOCODE_ALREADY_USED: {
    httpStatusCode: 401,
    body: {
      code: 'promocode_already_used',
      message: 'Promocode Already Used',
    },
  },
  INVALID_PLAN_FOR_PROMOCODE: {
    httpStatusCode: 401,
    body: {
      code: 'invalid_plan_for_promocode',
      message: 'Invalid Plan For Promocode',
    },
  },
  CURRENCY_MISMATCHED: {
    httpStatusCode: 401,
    body: {
      code: 'currency_mismatched',
      message: 'Currency Mismatched',
    },
  },
  PROMOCODE_IS_NOT_AVAILABLE_FOR_THIS_PLAN: {
    httpStatusCode: 401,
    body: {
      code: 'promocode_is_not_available_for_this_paln',
      message: 'Promocode is not available for this plan',
    },
  },
  AMOUNT_NOT_MATCHED: {
    httpStatusCode: 401,
    body: {
      code: 'amount_not_matched',
      message: 'Amount Not Matched',
    },
  },
};
