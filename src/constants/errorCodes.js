export default {
  UNAUTHORIZE: {
    httpStatusCode: 401,
    body: {
      code: "unauthorize",
      message: "You are not authorize for this access.",
    },
  },
  FORBIDDEN: {
    httpStatusCode: 403,
    body: {
      code: "forbidden",
      message:
        "Access Denied, You don't have permission to access! Please contact administrator",
    },
  },
  RESOURCE_NOT_FOUND: {
    httpStatusCode: 404,
    body: {
      code: "resource_not_found",
      message: "Requested resource not found.",
    },
  },
  CONFLICT: {
    httpStatusCode: 409,
    body: {
      code: "conflict",
      message: "Conflict - Cannot process the request.",
    },
  },
  INTERNAL_SERVER_ERROR: {
    httpStatusCode: 500,
    body: {
      code: "internal_server_error",
      message: "Something went wrong, please try again later.",
    },
  },
  INVALID_USER_OR_PASSWORD: {
    httpStatusCode: 401,
    body: {
      code: "invalid_user_or_password",
      message: "Invalid User or Password",
    },
  },
  USER_NOT_FOUND: {
    httpStatusCode: 404,
    body: {
      code: "user_not_found",
      message: "User Not Found",
    },
  },
  USER_ALREADY_EXIST: {
    httpStatusCode: 401,
    body: {
      code: "user_already_exist",
      message: "User Already Exist",
    },
  },
  INVALID_PASSWORD: {
    httpStatusCode: 401,
    body: {
      code: "invalid_password",
      message: "Invalid Password",
    },
  },
  NOT_FOUND: {
    httpStatusCode: 404,
    body: {
      code: "not_found",
      message: "Not Found",
    },
  },
};
