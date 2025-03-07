import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "payment",
    },
    paymentMethod: {
      id: { type: String },
      type: { type: String },
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    planType: {
      type: String,
      enum: ["one-time", "subscription"],
      require: true,
    },
    interval: {
      type: String,
      enum: ["week", "month", "year"],
      require: true,
    },
    amount: {
      type: Number,
      require: true,
    },
    planStartDate: {
      type: Date,
      default: "",
    },
    planEndDate: {
      type: Date,
      default: "",
    },
    planPauseDate: {
      type: Date,
      default: "",
    },
    nextPaymentDate: {
      type: Date,
      default: null,
    },
    transactionHistory: [
      {
        type: Object,
        default: "",
      },
    ],
    isFinished: {
      type: Boolean,
      default: false,
    },
    isPaused: {
      type: Boolean,
      default: false,
    },
    isResumed: {
      type: Boolean,
      default: false,
    },
    isCanceled: {
      type: Boolean,
      default: false,
    },
    paymentConfirmed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

export const PurchaseModel = new mongoose.model("purchase", purchaseSchema);
