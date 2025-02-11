
import HTTP_statusCode from "../constants/httpStatusCodes.js";
import { AuthService } from "../services/Auth.js";

const authService = new AuthService();

export class AuthController {
  async signup(req, res, next) {
    try {
      console.log("signup at usercontroller");

      const userData = req.body;
      console.log("signup at usercontroller",userData);
      const response = await authService.signup(userData);
      console.log(response);
      res.status(HTTP_statusCode.OK).json(response)  
    } catch (error) {
      next(error);
    }
  }

  async verifyOtp(req, res, next) {
    try {
      const { email, otp } = req.body;
      const response = await authService.otpVerify(email, otp);
      res.status(HTTP_statusCode.OK).json({status : response , message : "verified" });
    } catch (error) {
      next(error);
    }
  }

  async resendOtp(req, res, next) {
    try {
      const {email} = req.body

      if (!email) {
        return res.status(401).json({ message: "email not provided" });
      }

      const response = await authService.resendOtpCheck(email);
      if (response) {
        res.status(200).json({
          status: true,
          message: "OTP Resend successfully",
          response,
        });
      } else {
        res
          .status(400)
          .json({ status: false, message: "Something went wrong" });
      }
    } catch (error) {
      next(error);
    }
  }

  async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;
      const {cred , accessToken} = await authService.verifyLogin(email, password);
      res.cookie("AccessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      });

      res.status(HTTP_statusCode.OK).json({status:true, message: "Login successful", userInfo:cred });
    } catch (error) {
      next(error);
    }
  }

  async logoutUser(req, res, next) {
    try {
      res.cookie("AccessToken", "", {
        httpOnly: true,
        expires: new Date(0),
      });

      const {userId} = req.body
      await authService.clearRefreshToken(userId);
      
      res.status(200).json({ message: "Logout successful",status:true });
    } catch (error) {
      console.error("Logout error:", error);
      next(new Error("Logout failed"));
    }
  }
  

  
}
