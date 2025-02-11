import { AuthRepository } from "../repository/Auth.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import sendOtpEmail from "../configs/email.js";
import { AppError } from "../middlewares/errorHandler.js";
import generateOtp from "../utils/otpGenerator.js";
import HTTP_statusCode from "../constants/httpStatusCodes.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtToken.js";




const authRepository = new AuthRepository();


export class AuthService {
  async signup(userData) {
    try {
      console.log(userData);
      userData.email = userData.email.toLowerCase();

      const user = await authRepository.existUser(
        userData?.email
      );

      if (user) throw new AppError("Email already in use");

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      const userId = uuidv4();

      const otp = generateOtp(4);
      console.log("Generated OTP:", otp);

      

      const subject = "OTP Verification";
      await sendOtpEmail(userData.email, otp, subject);

      const otpExpires = new Date();
    otpExpires.setSeconds(otpExpires.getSeconds() + 60);

    const tempData = {
      userId: String(userId),
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      about: userData.about,
      otp: otp,
      otpExpires: otpExpires,
    };

      const response = await authRepository.storeOtp(tempData)





      

      console.log("ressssss",response)

      return true;
    } catch (error) {
      throw error;
    }
  }

  async otpVerify(email, providedOtp) {
    try {
      // Retrieve the OTP record associated with the email
      const otpRecord = await authRepository.getOtp(email);
  
      if (!otpRecord) {
        throw new Error('OTP record not found.');
      }
  
      // Check if the OTP has expired
      const currentTime = new Date();
      if (otpRecord.otpExpires < currentTime) {
        throw new Error('OTP has expired.');
      }
  
      // Compare the provided OTP with the stored OTP
      if (otpRecord.otp !== providedOtp) {
        throw new AppError("Incorrect OTP", HTTP_statusCode.BAD_REQUEST);
      }
  
      // Extract user data from the OTP record
      const { userId, name, email: userEmail, password, about } = otpRecord;
  
      // Create the user account
      const userData = { userId, name, email: userEmail, password, about };
      await authRepository.createUser(userData);
  
      // Optionally, delete the OTP record after successful verification
      await authRepository.deleteOtp(email);
  
      return true;
    } catch (error) {
      console.error('Error during OTP verification:', error);
      throw error;
    }
  }
  
  

  async resendOtpCheck(email) {
    try {

      const otpRecord = await authRepository.getOtp(email);
      console.log("otp resend swerv",otpRecord)
        
      if (!otpRecord) {
        throw new AppError(
          "Temporary user data not found or expired",
          HTTP_statusCode.NOT_FOUND
        );
      }

      
      

      

      

      const otp = generateOtp(4);
      console.log("Generated OTP:", otp);

   

      const subject = "OTP Verification";
      await sendOtpEmail(email, otp, subject);

      const otpExpires = new Date();
    otpExpires.setSeconds(otpExpires.getSeconds() + 60);

    const tempData = {
      userId: otpRecord.userId,
      name: otpRecord.name,
      email: otpRecord.email,
      password: otpRecord.password,
      about: otpRecord.about,
      otp: otp,
      otpExpires: otpExpires,
    };

      const response = await authRepository.storeNewOtp(email,tempData)

      
      return true;
    } catch (error) {
      throw error;
    }
  }

  async verifyLogin(email, password) {
    try {
      email = email.toLowerCase();
      const user = await authRepository.existUser(email);

      if (!user)
        throw new AppError("User dosen't exist.", HTTP_statusCode.NOT_FOUND);

      const passowrdCompareResult = await bcrypt.compare(
        password,
        user?.password
      );

      if (!passowrdCompareResult)
        throw new AppError("Incorrect password", HTTP_statusCode.CONFLICT);

      const accessToken = generateAccessToken(user?.userId, "User");
      const refreshToken = generateRefreshToken(user?.userId, "User");
      const saveRefreshToken = await authRepository.saveRefreshToken(
        user?.userId,
        refreshToken
      );
      if (!saveRefreshToken) console.log("could'nt save refresh token");

      const cred = {
        name: user?.name,
        email: user?.email,
        userId: user?.userId,
        id:user?._id,
        about:user?.about

      };

      return { cred, accessToken };
    } catch (error) {
      throw error;
    }
  }

  

  
  
  async clearRefreshToken(userId) {
    try {
      
      const response = await authRepository.clearRefreshToken(userId);

      

     

      

  
      return response;
    } catch (error) {
      throw error;
    }
  }
}
