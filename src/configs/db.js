import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config()

const ConnectDB = async () => {
    try {
        console.log(process.env.MONGO_URI)
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected....");
        
    } catch (error) {
        console.log("Database  betrayed bro");
        
    }
}


export default ConnectDB;