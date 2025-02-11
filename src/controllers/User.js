
import HTTP_statusCode from "../constants/httpStatusCodes.js";
import { UserService } from "../services/User.js";


const userService = new UserService();

export class UserController {
    async updateProfile(req, res, next) {
        try {
            const values = req.body;
            console.log("Received values:", values);
            
            const response = await userService.updateProfile(values);
            
            res.status(HTTP_statusCode.OK).json(response);
        } catch (error) {
            next(error);
        }
    }
    async createBlog(req, res, next) {
        try {
            const values = req.body;
            const file = req.file
            console.log("Received valuesss:", file);
            
            const response = await userService.createBlog(values,file);
            
            res.status(HTTP_statusCode.OK).json(response);
        } catch (error) {
            next(error);
        }
    }
  
async getUserBlogs(req, res, next) {
    try {
        const userId = req.params.userId;
        console.log("Received userId:", userId);  
        const response = await userService.getUserBlogs(userId);  

        res.status(HTTP_statusCode.OK).json(response);  
    } catch (error) {
        next(error);  
    }
}
async getBlogDetails(req, res, next) {
    try {
        const blogId = req.params.blogId;
        console.log("Received blogId:", blogId);  
        const response = await userService.getBlogDetails(blogId);  

        res.status(HTTP_statusCode.OK).json(response);  
    } catch (error) {
        next(error); 
    }
}
async editBlogDetails(req, res, next) {
    try {
        const values = req.body;
        const file = req.file;
        const blogId = req.params.blogId;
        console.log("Received valuesss1:",values);
        console.log("Received valuesss2:", file);
        console.log("Received valuesss3:", blogId);
        
        const response = await userService.editBlogDetails(values,file,blogId);
        
        res.status(HTTP_statusCode.OK).json(response);
    } catch (error) {
        next(error);
    }
}


async getAllBlogs(req, res, next) {
    try {
        
        const preferences = req.body.preferences;
        console.log("Received preferences:", preferences);  
        
         
        const response = await userService.getAllBlogs(preferences);

        
        res.status(HTTP_statusCode.OK).json(response);
    } catch (error) {
       
        next(error);
    }
}


    
   
}
