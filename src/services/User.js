import { AppError } from "../middlewares/errorHandler.js";
import { UserRepository } from "../repository/User.js";
import S3Service from "../configs/s3Bucket.js";
import HTTP_statusCode from "../constants/httpStatusCodes.js";

const userRepository = new UserRepository();
const S3 = new S3Service();

export class UserService {
  async updateProfile(values) {
    try {
      const user = await userRepository.updateProfile(values);
      if (!user) {
        throw new AppError("User not found", HTTP_statusCode.NOT_FOUND);
      }
      return {
        name: user?.name,
        email: user?.email,
        userId: user?.userId,
        id: user?._id,
        about: user?.about,
      };
    } catch (error) {
      throw new AppError(error.message, error.statusCode || HTTP_statusCode.INTERNAL_SERVER_ERROR);
    }
  }

  async createBlog(values, file) {
    try {
      if (!file) {
        throw new AppError("Blog image is required", HTTP_statusCode.BAD_REQUEST);
      }

      const blogImage = { type: "blog images", url: await S3.uploadFile("eliteCare/blogImages/", file) };
      values.image = blogImage;

      try {
        values.categories = JSON.parse(values.categories);
      } catch {
        throw new AppError("Categories format is invalid", HTTP_statusCode.BAD_REQUEST);
      }

      const response = await userRepository.createBlog(values);
      if (!response) {
        throw new AppError("Blog creation failed", HTTP_statusCode.INTERNAL_SERVER_ERROR);
      }
      response.image.url = await S3.getFile(response.image.url, this.getFolderPathByFileType(response.image.type));
      return response;
    } catch (error) {
      throw new AppError(error.message, error.statusCode || HTTP_statusCode.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserBlogs(userId) {
    try {
      const response = await userRepository.getUserBlogs(userId);
      if (!response || response.length === 0) {
        throw new AppError("No blogs found", HTTP_statusCode.NOT_FOUND);
      }
      for (let blog of response) {
        if (blog.image?.url) {
          blog.image.url = await S3.getFile(blog.image.url, this.getFolderPathByFileType(blog.image.type));
        }
      }
      return response;
    } catch (error) {
      throw new AppError(error.message, error.statusCode || HTTP_statusCode.INTERNAL_SERVER_ERROR);
    }
  }

  async getBlogDetails(blogId) {
    try {
      const response = await userRepository.getBlogDetails(blogId);
      if (!response) {
        throw new AppError("Blog not found", HTTP_statusCode.NOT_FOUND);
      }
      response.image.url = await S3.getFile(response.image.url, this.getFolderPathByFileType(response.image.type));
      return response;
    } catch (error) {
      throw new AppError(error.message, error.statusCode || HTTP_statusCode.INTERNAL_SERVER_ERROR);
    }
  }

  async editBlogDetails(values, file, blogId) {
    try {
      if (file) {
        values.image = { type: "blog images", url: await S3.uploadFile("eliteCare/blogImages/", file) };
      }

      try {
        values.categories = JSON.parse(values.categories);
      } catch {
        throw new AppError("Categories format is invalid", HTTP_statusCode.BAD_REQUEST);
      }

      const response = await userRepository.editBlogDetails(values, blogId);
      if (!response) {
        throw new AppError("Blog update failed", HTTP_statusCode.INTERNAL_SERVER_ERROR);
      }
      response.image.url = await S3.getFile(response.image.url, this.getFolderPathByFileType(response.image.type));
      return response;
    } catch (error) {
      throw new AppError(error.message, error.statusCode || HTTP_statusCode.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllBlogs(preferences) {
    try {
      const response = await userRepository.getAllBlogs(preferences);
      if (!response || response.length === 0) {
        throw new AppError("No blogs found", HTTP_statusCode.NOT_FOUND);
      }
      for (let blog of response) {
        if (blog.image?.url) {
          blog.image.url = await S3.getFile(blog.image.url, this.getFolderPathByFileType(blog.image.type));
        }
      }
      return response;
    } catch (error) {
      throw new AppError(error.message, error.statusCode || HTTP_statusCode.INTERNAL_SERVER_ERROR);
    }
  }

  getFolderPathByFileType(fileType) {
    if (fileType === "blog images") {
      return "eliteCare/blogImages";
    }
    throw new AppError(`Unknown file type: ${fileType}`, HTTP_statusCode.BAD_REQUEST);
  }
}
