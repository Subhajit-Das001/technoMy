
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const mongoose = require("mongoose");
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectDB = async (retries = 5) => {
    for (let attempt = 1; attempt <= retries; attempt += 1) {
        try {
            console.log(`connecting... attempt ${attempt}/${retries}`);
            const conn = await mongoose.connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 15000,
                socketTimeoutMS: 45000,
            });

            console.log(`MongoDB connected: ${conn.connection.host}`);
            return;
        }
        catch (error) {
            console.error(`MongoDB connection attempt ${attempt}/${retries} failed: ${error.message}`);
            if (attempt === retries) {
                console.error('MongoDB connection failed after retries.');
                process.exit(1);
            }
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
    }
};

module.exports = connectDB;