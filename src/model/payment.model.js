import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    stripePaymentId: {
      type: String,
      require: true,
    }, // id of intent or subscription
    paymentType: {
      type: String,
      enum: ["Intent", "Subscription"],
      require: true,
    },
    amount: {
      type: Number,
      require: true,
    },
    stripeChargeId: {
      type: String,
      default: "",
    },
    paymentLink: {
      type: String,
      default: "",
    },
    paymentMethod: {
      id: { type: String, required: true },
      type: { type: String, required: true },
    },
    clientSecret: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Processing", "Completed", "Failed"],
      default: "Processing",
    },
  },
  { timestamps: true, versionKey: false }
);

export const PaymentModel = new mongoose.model("payment", paymentSchema);
