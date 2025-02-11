import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()

const generateAccessToken = (id , role) => {
  return jwt.sign(
    { id: id, role: role }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1hr' }
  );
};



const generateRefreshToken = (id , role) => {
  return jwt.sign(
    { id: id, role: role }, 
    process.env.JWT_SECRET, 
    { expiresIn: '7d' }
  );
};

export   { generateAccessToken, generateRefreshToken};