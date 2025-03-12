import mongoose from "mongoose";

const promocodeSchema = new mongoose.Schema(
  {
    promocodeFor: {
      type: String,
      enum: ["one-time", "subscription"],
      require: true,
    },
    stripeCoupenId: {
      type: String,
      require: true,
    },
    coupenName: {
      type: String,
      require: true,
    },
    stripePromocodeId: {
      type: String,
      require: true,
    },
    promocode: {
      type: String,
      require: true,
    },
    discountInAmount: {
      type: Number,
      default: 0,
    },
    discountInPercentage: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      require: true,
    },
    durationInMonths: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
      enum: ["forever", "once", "repeating"],
      require: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    specificCustomer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    plan: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],
    maxRedumption: {
      type: Number,
      default: 50,
    },
    minAmount: {
      type: Number,
      default: 0,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    isFirstTimeOnly: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

export const PromocodeModel = new mongoose.model("promocode", promocodeSchema);
