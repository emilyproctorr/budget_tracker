import { config } from 'dotenv';
import mongoose from 'mongoose';

// load env variables from .env
config();

const uri = process.env.MONGODB_URI;

// version: 1 -> latest stable server API
// strict: true -> strict type checking and validation 
// deprecationErrors: true -> throw errors when using deprecated features keeping code up to date
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

// async function to connect to db
const connectDB = async () => {
    // attempt to connect
    try {
        const conn = await mongoose.connect(uri, clientOptions); // establish connection
        await mongoose.connection.db.admin().command({ ping: 1 }); // ping checks if db is responding
        console.log(`Pinged your deployment. MongoDB connected: ${conn.connection.host}`); // display hostname if connection and ping successfull
    // if error/fail
    } catch (error) {
        console.error(`Error: ${error.message}`); // error message
        process.exit(1); // node.js exits with error code 1, shut down app
    }
};

export default connectDB;