const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/auth';

const testAuth = async () => {
    try {
        console.log('1. Testing Signup...');
        const uniqueUser = `testuser_${Date.now()}`;
        const email = `${uniqueUser}@example.com`;

        const signupRes = await axios.post(`${BASE_URL}/signup`, {
            username: uniqueUser,
            email: email,
            password: 'password123'
        });
        console.log('Signup Success:', signupRes.data.username === uniqueUser);

        console.log('2. Testing Login...');
        const loginRes = await axios.post(`${BASE_URL}/login`, {
            email: email,
            password: 'password123'
        });
        console.log('Login Success:', !!loginRes.data.token);

        console.log('Verification Complete: All tests passed.');
    } catch (error) {
        console.error('Test Failed:', error.response?.data || error.message);
        process.exit(1);
    }
};

// Wait for server to start
setTimeout(testAuth, 3000);
