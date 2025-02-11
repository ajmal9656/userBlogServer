import HTTP_statusCode from "../constants/httpStatusCodes.js";
import { AppError } from "../middlewares/errorHandler.js";
import User from "../models/userShema.js";
import Otp from "../models/otpSchema.js";

export class AuthRepository{
  
    async existUser(email) {
        try {
          return User.findOne({ email }).lean().exec();
        } catch (err) {
          console.error("Error checking if user exists repo:", err);
          throw err; 
        }
      }
      
  

  async createUser(userData) {
    try {
      console.log("user data", userData);
      const newUser = new User(userData);
      return await newUser.save();
    } catch (err) {
      console.log("Error in creating new User", err);
    }
  }
  async storeOtp(userData) {
    try {
      console.log("User data:", userData);
      const newUser = new Otp(userData);
      const savedUser = await newUser.save();
      return savedUser;
    } catch (err) {
      console.error("Error in creating new User:", err);
      throw err; // Re-throw the error after logging it
    }
  }
  async storeNewOtp(email, userData) {
    try {
      console.log("User data:", userData);
  
      // Define the filter criteria
      const filter = { email: email };
  
      // Define the update operation
      const update = {
        $set: userData,
      };
  
      // Define options for the operation
      const options = {
        new: true, // Return the updated document
        upsert: true, // Create a new document if no match is found
        useFindAndModify: false, // For deprecation warning
      };
  
      // Perform the findOneAndUpdate operation
      const updatedUser = await Otp.findOneAndUpdate(filter, update, options).lean().exec();
  
      return updatedUser;
    } catch (err) {
      console.error("Error in creating or updating OTP record:", err);
      throw err;
    }
  }
  

  async getOtp(email) {
    try {
      return Otp.findOne({ email }).lean().exec();
    } catch (err) {
      console.error("Error checking if user exists repo:", err);
      throw err; 
    }
  }
  async deleteOtp(email) {
    try {
      const result = await Otp.deleteOne({ email });
      if (result.deletedCount === 0) {
        console.log(`No OTP entry found for email: ${email}`);
      } else {
        console.log(`OTP entry for email: ${email} has been deleted.`);
      }
    } catch (err) {
      console.error("Error deleting OTP entry:", err);
      throw err;
    }
  }
  

  async saveRefreshToken(userId , refreshToken) {
    try {
      const user = await User.findOne({userId})
      if (user) {
        user.refreshToken = refreshToken;
        await user.save();
        return true;
      } else {
        throw new AppError("User dosen't exist.", HTTP_statusCode.NOT_FOUND);
      }
      
    } catch (err) {
      console.log("Error in saving refresg token", err);
    }
  }
  async clearRefreshToken(userId ) {
    try {
      console.log("useid",userId);
      
      const user = await User.findById(userId)
      if (user) {
        user.refreshToken = null;
        await user.save();
        return true;
      } else {
        throw new AppError("User dosen't exist.", HTTP_statusCode.NOT_FOUND);
      }
      
    } catch (err) {
      console.log("Error in saving refresg token", err);
    }
  }

  
  
}
