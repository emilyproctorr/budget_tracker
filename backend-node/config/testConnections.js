import connectDB from './connectDB.js';

const testConnection = async () => {
    await connectDB();
};

testConnection().catch((error) => console.error(`Connection test failed: ${error.message}`));