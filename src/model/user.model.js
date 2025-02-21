import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    contact_no: {
      type: String,
      require: true,
    },
    age: {
      type: Number,
      default: 0,
    },
    customerId: {
      type: String,
      require: true,
    },
    paymentMethod: [
      {
        id: {
          type: String,
          require: true,
        },
        method: {
          type: String,
          require: true,
        },
      },
    ],
    address: {
      city: {
        type: String,
        default: "",
      },
      country: {
        type: String,
        default: "",
      },
      line1: {
        type: String,
        default: "",
      },
      line2: {
        type: String,
        default: "",
      },
      postal_code: {
        type: String,
        default: "",
      },
      state: {
        type: String,
        default: "",
      },
    },
    shipping: {
      address: {
        type: String,
        default: "",
      },
      name: {
        type: String,
        default: "",
      },
      phone: {
        type: String,
        default: "",
      },
    },
    userType: {
      type: String,
      default: "USER",
    },
  },
  { timestamps: true }
);

export const UserModel = new mongoose.model("user", userSchema);
