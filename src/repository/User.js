import HTTP_statusCode from "../constants/httpStatusCodes.js";
import { AppError } from "../middlewares/errorHandler.js";
import Blog from "../models/blogSchema.js";
import User from "../models/userShema.js";

export class UserRepository {
    async updateProfile(userData) {
        try {
            console.log("User data received:", userData);

            if (!userData.id) {
                throw new AppError("User ID is required", HTTP_statusCode.BAD_REQUEST);
            }

            const updatedUser = await User.findByIdAndUpdate(
                userData.id,
                { $set: userData },
                { new: true, runValidators: true }
            );

            if (!updatedUser) {
                throw new AppError("User not found", HTTP_statusCode.NOT_FOUND);
            }

            console.log("Updated user:", updatedUser);
            return updatedUser;
        } catch (err) {
            console.error("Error updating user:", err);
            throw new AppError(err.message || "Error updating profile", err.statusCode || HTTP_statusCode.INTERNAL_SERVER_ERROR);
        }
    }

    async createBlog(blogData) {
        try {
            console.log("Blog data received:", blogData);

            if (!blogData.title || !blogData.description || !blogData.userId) {
                throw new AppError("All blog fields are required", HTTP_statusCode.BAD_REQUEST);
            }

            const response = await Blog.create(blogData);
            console.log("Blog created:", response);
            return response;
        } catch (err) {
            console.error("Error creating blog:", err);
            throw new AppError(err.message || "Error creating blog", err.statusCode || HTTP_statusCode.INTERNAL_SERVER_ERROR);
        }
    }

    async getUserBlogs(userId) {
        try {
            if (!userId) {
                throw new AppError("User ID is required", HTTP_statusCode.BAD_REQUEST);
            }

            const response = await Blog.find({ userId });
            console.log("Repository - Blogs found for userId:", userId, response);
            return response;
        } catch (err) {
            console.error("Error fetching user blogs:", err);
            throw new AppError(err.message || "Error fetching user blogs", err.statusCode || HTTP_statusCode.INTERNAL_SERVER_ERROR);
        }
    }

    async getBlogDetails(blogId) {
        try {
            if (!blogId) {
                throw new AppError("Blog ID is required", HTTP_statusCode.BAD_REQUEST);
            }

            const response = await Blog.findById(blogId).populate("userId", "name");
            if (!response) {
                throw new AppError("Blog not found", HTTP_statusCode.NOT_FOUND);
            }

            console.log("Repository - Blog details found:", blogId, response);
            return response;
        } catch (err) {
            console.error("Error fetching blog details:", err);
            throw new AppError(err.message || "Error fetching blog details", err.statusCode || HTTP_statusCode.INTERNAL_SERVER_ERROR);
        }
    }

    async editBlogDetails(blogData, blogId) {
        try {
            if (!blogId) {
                throw new AppError("Blog ID is required", HTTP_statusCode.BAD_REQUEST);
            }

            const response = await Blog.findByIdAndUpdate(
                blogId,
                { $set: blogData },
                { new: true }
            ).populate("userId", "name");

            if (!response) {
                throw new AppError("Blog not found", HTTP_statusCode.NOT_FOUND);
            }

            console.log("Updated blog:", response);
            return response;
        } catch (err) {
            console.error("Error updating blog:", err);
            throw new AppError(err.message || "Error updating blog", err.statusCode || HTTP_statusCode.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllBlogs(preferences) {
        try {
            console.log("Repository - Fetching blogs for categories:", preferences);

            const query = preferences.length > 0 ? { categories: { $in: preferences } } : {};
            const response = await Blog.find(query);

            return response;
        } catch (err) {
            console.error("Error fetching blogs:", err);
            throw new AppError(err.message || "Error fetching blogs", err.statusCode || HTTP_statusCode.INTERNAL_SERVER_ERROR);
        }
    }
}
