const mongoose = require('mongoose');
require('dotenv').config();

const checkMongo = async () => {
    try {
        console.log('Testing MongoDB Connection...');
        console.log('URI:', process.env.MONGO_URI);

        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected Successfully!');

        await mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error('❌ MongoDB Connection Failed:', err.message);
        process.exit(1);
    }
};

checkMongo();
