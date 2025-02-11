import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtToken.js";
import HTTP_statusCode from "../constants/httpStatusCodes.js";
import User from "../models/userShema.js";
import { AppError } from "../middlewares/errorHandler.js";

dotenv.config();

// const secret_key = process.env.JWT_SECRET;



// const verifyToken = (requiredRole) => {
//   return async (req, res, next) => {
//     try {
//       const accessToken = req.cookies.AccessToken;

//       if (!accessToken) {
//         throw new AppError('Access token not found', HTTP_statusCode.UNAUTHORIZED);
//       }

//       if (accessToken) {
//         jwt.verify(accessToken, secret_key, async (err, decoded) => {
//           if (err) {
//             if(err.name==='TokenExpiredError'){
//               const decodedExpired = jwt.decode(accessToken);
//               if (!decodedExpired) {
//               throw new AppError('Invalid access token', HTTP_statusCode.UNAUTHORIZED);
//                }

//               const user = await User.findOne({userId:decodedExpired.id})
//               if (!user || !user.refreshToken) {
//               throw new AppError('User not found or refresh token missing', HTTP_statusCode.UNAUTHORIZED);
//              }
//             }
//             await handleRefreshToken(req, res, next);
//           } else {
//             const { role } = decoded;

//             if (role !== requiredRole) {
//               return res.status(401).json({ message: `Access denied. Insufficient role. Expected ${requiredRole}.` });
//             }

//             next();
//           }
//         });
//       } else {
//         await handleRefreshToken(req, res, next);
//       }
//     } catch (error) {
//       res.status(401).json({ message: 'Access denied. Access token not valid.' });
//     }
//   };
// };

// const handleRefreshToken = async (req, res, next) => {
//   const refreshToken = await User.findOne({userId})

//   if (refreshToken) {
//     jwt.verify(refreshToken, secret_key, (err, decoded) => {
//       if (err) {
//         return res.status(401).json({ message: 'Access denied. Refresh token not valid.' });
//       } else {
//         const { id, role } = decoded;

//         if (!id || !role) {
//           return res.status(401).json({ message: 'Access denied. Token payload invalid.' });
//         } else {
//           const newAccessToken = generateAccessToken(id, role);
//           res.cookie("AccessToken", newAccessToken, {
//             httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "strict",
//         maxAge: 1 * 24 * 60 * 60 * 1000,
//           });
//           next();
//         }
//       }
//     });
//   } else {
//     return res.status(401).json({ message: 'Access denied. Refresh token not provided.' });
//   }
// };
const authenticateJWT = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const accessToken = req.cookies.AccessToken;

      if (!accessToken) {
        return next(new AppError('Access token not found', HTTP_statusCode.UNAUTHORIZED));
      }

      try {
        // Verify the access token
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        console.log("decoded access token", decoded.role, decoded.id);

        // Check role in the access token
        if (decoded.role !== requiredRole) {
          return next(new AppError(`Access denied. Insufficient role`, HTTP_statusCode.UNAUTHORIZED));
        }

        req.user = decoded; // Attach decoded info to request object
        next(); // Token is valid, proceed with the request
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          const decodedExpired = jwt.decode(accessToken);
          console.log("decoded expired access token", decodedExpired.role, decodedExpired.id);

          if (!decodedExpired) {
            return next(new AppError('Invalid access token', HTTP_statusCode.UNAUTHORIZED));
          }

          // Check role in the expired token
          if (decodedExpired.role !== requiredRole) {
            return next(new AppError(`Access denied. Insufficient role`, HTTP_statusCode.UNAUTHORIZED));
          }

          // Find the user by the ID from the expired token
          const user = await User.findOne({ userId: decodedExpired.id });
          console.log("particular user", user);

          if (!user || !user.refreshToken) {
            return next(new AppError('User not found or refresh token missing', HTTP_statusCode.UNAUTHORIZED));
          }

          // Verify the refresh token
          try {
            const refreshDecoded = jwt.verify(user.refreshToken, process.env.JWT_SECRET);

            if (refreshDecoded.role !== requiredRole) {
              return next(new AppError(`Access denied. Insufficient role`, HTTP_statusCode.UNAUTHORIZED));
            }

            // Generate a new access token and refresh token
            const newAccessToken = generateAccessToken(refreshDecoded.id, refreshDecoded.role);
            const newRefreshToken = generateRefreshToken(refreshDecoded.id, refreshDecoded.role);

            // Save the new refresh token in the database
            user.refreshToken = newRefreshToken;
            await user.save();

            // Set new access token in response
            res.cookie("AccessToken", newAccessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              maxAge: 24 * 60 * 60 * 1000, // 1 day
            });

            req.user = jwt.decode(newAccessToken);
            next(); // Proceed to the next middleware/route handler
          } catch (refreshError) {
            user.refreshToken = null;
            await user.save();
            return next(new AppError('Session expired, please login again', HTTP_statusCode.UNAUTHORIZED));
          }
        } else {
          return next(new AppError('Invalid token', HTTP_statusCode.UNAUTHORIZED));
        }
      }
    } catch (error) {
      next(error); // Pass the error to the error-handling middleware
    }
  };
};



// const authenticateJWT = async (role) => {
//   try {
//     const accessToken = req.cookies.AccessToken;

//     if (!accessToken) {
//       throw new AppError('Access token not found', HTTP_statusCode.UNAUTHORIZED);
//     }

//     try {
//       const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
//       req.user = decoded;
//       return next();
//     } catch (error) {
//       if (error.name === 'TokenExpiredError') {
//         const decodedExpired = jwt.decode(accessToken);
//         if (!decodedExpired) {
//           throw new AppError('Invalid access token', HTTP_statusCode.UNAUTHORIZED);
//         }

//         const user = await User.findOne({userId:decodedExpired.id})
//         if (!user || !user.refreshToken) {
//           throw new AppError('User not found or refresh token missing', HTTP_statusCode.UNAUTHORIZED);
//         }

//         try {
//           jwt.verify(user.refreshToken, process.env.JWT_SECRET);
          
//           const newAccessToken = generateAccessToken(decodedExpired.id,role);
//           const newRefreshToken = generateRefreshToken(decodedExpired.id,role);
          
//           user.refreshToken = newRefreshToken;
//           await user.save();

//           req.user = jwt.decode(newAccessToken);
//           res.setHeader('New-Access-Token', newAccessToken);
//           return next();
//         } catch (refreshError) {
//           user.refreshToken = null;
//           await user.save();
          
//           throw new AppError('Session expired, please login again', HTTP_statusCode.UNAUTHORIZED);
//         }
//       }
      
//       throw new AppError('Invalid token', HTTP_statusCode.UNAUTHORIZED);
//     }
//   } catch (error) {
//     next(error);
//   }
// };

// const authorizeRoles = (...roles) => (req, res, next) => {
//   if (!roles.includes(req.user.role)) {
//     throw new AppError('Forbidden: Insufficient role permissions.', httpStatusCodes.FORBIDDEN);
//   }
//   next();
// };

export { authenticateJWT };
