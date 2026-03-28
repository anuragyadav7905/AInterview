const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const checkAndCreateUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = 'test@example.com';
        let user = await User.findOne({ email });

        if (!user) {
            console.log('User not found. Creating user...');
            user = await User.create({
                username: 'TestUser999_' + Date.now(),
                email: email,
                password: 'password123'
            });
            console.log('User created:', user);
        } else {
            console.log('User already exists:', user);
            // reset password
            user.password = 'password123';
            await user.save();
            console.log('Password reset to password123');
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

checkAndCreateUser();
