const mongoose = require('mongoose');

const connectDB = async (DB_URL) => {
    try {
        const options = {
            dbName: process.env.DB_NAME
        }
        await mongoose.connect(DB_URL,options);
    } catch (error) {
        console.log('DB Error',error);
    }
}

module.exports = connectDB;