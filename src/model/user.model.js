import mongoose from 'mongoose';

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
        type: {
          type: String,
          require: true,
        },
      },
    ],
    defaultPaymentMethod: {
      id: {
        type: String,
        default: '',
      },
      type: {
        type: String,
        default: '',
      },
    },
    address: {
      name: {
        type: String,
        default: '',
      },
      email: {
        type: String,
        default: '',
      },
      city: {
        type: String,
        default: '',
      },
      country: {
        type: String,
        default: '',
      },
      line1: {
        type: String,
        default: '',
      },
      line2: {
        type: String,
        default: '',
      },
      postal_code: {
        type: String,
        default: '',
      },
      state: {
        type: String,
        default: '',
      },
    },
    availablePromocodes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'promocode',
        required: true,
      },
    ],
    usedPromocodes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'promocode',
        required: true,
      },
    ],
    userType: {
      type: String,
      default: 'USER',
    },
  },
  { timestamps: true, versionKey: false }
);

export const UserModel = new mongoose.model('user', userSchema);
