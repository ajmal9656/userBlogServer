import express from 'express';
import dotenv from 'dotenv';
import ConnectDB from './src/configs/db.js';
import route from './src/routes/urlRoutes.js';
import cors from "cors";
import { errorHandler } from './src/middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
// import urlRoutes from './routes/urlRoutes.js'; 

dotenv.config();

// Connect to the database
ConnectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:5174",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json()); // To parse JSON bodies
app.use('/', route);

app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
