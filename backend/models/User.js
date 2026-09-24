import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    city: {
      type: String,
      default: '',
      trim: true,
    },
    state: {
      type: String,
      default: '',
      trim: true,
    },
    businessType: {
      type: String,
      default: 'Retail Store',
    },
    sector: {
      type: String,
      default: 'FMCG & Grocery',
    },
    gstin: {
      type: String,
      default: '',
      trim: true,
    },
    annualTurnover: {
      type: String,
      default: '₹10L - ₹50L',
    },
    monthlyRevenue: {
      type: String,
      default: '',
    },
    monthlyExpenses: {
      type: String,
      default: '',
    },
    hasUploadedSalesData: {
      type: Boolean,
      default: false,
    },
    salesFileName: {
      type: String,
      default: null,
    },
    currency: {
      type: String,
      default: 'INR (₹)',
    },
    taxRate: {
      type: Number,
      default: 18,
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    aiSuggestionsEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password using bcryptjs before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
