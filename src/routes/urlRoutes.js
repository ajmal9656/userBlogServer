import { Router } from "express";
import multer from "multer";
import { AuthController } from "../controllers/Auth.js";
import { UserController } from "../controllers/User.js";
import { authenticateJWT } from "../configs/jwt.js";

const authController = new AuthController();
const userController = new UserController();
const route = Router();

// Multer configuration (Memory Storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to handle single image upload
const uploadUserFiles = upload.single("image");

route
  .post("/register", authController.signup)
  .post("/verifyOtp", authController.verifyOtp)
  .post("/resendOtp", authController.resendOtp)
  .post("/login", authController.loginUser)
  .post("/logout", authController.logoutUser);

route
  .put("/edit-profile",authenticateJWT("User"), userController.updateProfile)
  .post("/create-blog",authenticateJWT("User"), uploadUserFiles, userController.createBlog) 
  .get("/user-blogs/:userId",authenticateJWT("User"), userController.getUserBlogs) 
  .get("/blog-details/:blogId", userController.getBlogDetails)
  .put("/edit-blog/:blogId",authenticateJWT("User"),uploadUserFiles, userController.editBlogDetails) 
  .post("/getAllBlogs", userController.getAllBlogs); 

export default route;
