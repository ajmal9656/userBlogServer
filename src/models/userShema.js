import mongoose from 'mongoose';

// Create a schema for the User model
const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true, // Ensure each user has a unique userId
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure each email is unique
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: false,
      default: null, // Default value is null
    },
    about: {
      type: String,
      required: false,
      default: "", // Default value is an empty string
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create the User model based on the schema
const User = mongoose.model('User', userSchema);

export default User;
