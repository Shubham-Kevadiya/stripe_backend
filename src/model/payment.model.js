import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
      required: true,
    },
    promocodeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'promocode',
      required: true,
    },
    stripePaymentId: {
      type: String,
      require: true,
    }, // id of intent or subscription
    paymentIntentId: {
      type: String,
      require: true,
    }, // id of intent or subscription
    paymentType: {
      type: String,
      enum: ['intent', 'subscription'],
      require: true,
    },
    amount: {
      type: Number,
      require: true,
    },
    startDate: {
      type: String,
      default: 'N/A',
    },
    endDate: {
      type: String,
      default: 'N/A',
    },
    nextPaymentDate: {
      type: String,
      default: 'N/A',
    },
    stripeChargeId: {
      type: String,
      default: '',
    },
    invoiceURL: {
      type: String,
      default: '',
    },
    paymentMethod: {
      id: { type: String, required: true },
      type: { type: String, default: 'card' },
    },
    clientSecret: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Processing', 'Completed', 'Failed'],
      default: 'Processing',
    },
    failReason: {
      type: String,
      default: '',
    },
    reason: {
      type: String,
      default: '',
    },
  },
  { timestamps: true, versionKey: false }
);

export const PaymentModel = new mongoose.model('payment', paymentSchema);
