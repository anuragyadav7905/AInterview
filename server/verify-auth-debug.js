const axios = require('axios');

const testAuth = async () => {
    try {
        console.log('Testing Signup...');
        const unique = Date.now();
        const res = await axios.post('http://localhost:5000/api/auth/signup', {
            username: `debug_${unique}`,
            email: `debug_${unique}@test.com`,
            password: 'password123'
        });
        console.log('Signup Success:', res.data);
    } catch (error) {
        console.error('Signup Failed:', error.response ? error.response.status : error.message);
        if (error.response && error.response.data) {
            console.error('Error Data:', error.response.data);
        }
    }
};

testAuth();
