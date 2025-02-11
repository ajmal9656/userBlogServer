import mongoose from 'mongoose';

const { Schema } = mongoose;

const otpSchema = new Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  about: {
    type: String,
  },
  otp: {
    type: String,
    required: true,
  },
  otpExpires: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
    expires: 480, // Document expires 480 seconds (8 minutes) after 'createdAt'
  },
});

const Otp = mongoose.model('Otp', otpSchema);

export default Otp;
