const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';

const testUpload = async () => {
    try {
        console.log('1. Logging in...');
        const uniqueUser = `testuser_${Date.now()}`;
        const email = `${uniqueUser}@example.com`;

        // Register first or Login
        let token;
        try {
            const signupRes = await axios.post(`${BASE_URL}/auth/signup`, {
                username: uniqueUser,
                email: email,
                password: 'password123'
            });
            token = signupRes.data.token;
        } catch (err) {
            const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
                email: email,
                password: 'password123'
            });
            token = loginRes.data.token;
        }
        console.log('Login Success, Token received.');

        console.log('2. Creating dummy PDF...');
        const dummyPath = path.join(__dirname, 'dummy.pdf');
        fs.writeFileSync(dummyPath, 'Dummy PDF Content');

        console.log('3. Uploading PDF...');
        const form = new FormData();
        form.append('file', fs.createReadStream(dummyPath), {
            contentType: 'application/pdf',
            filename: 'dummy.pdf'
        });

        const uploadRes = await axios.post(`${BASE_URL}/upload-cv`, form, {
            headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${token}`
            }
        });

        console.log('Upload Success:', uploadRes.data.fileName.includes('dummy.pdf'));

        // Cleanup
        fs.unlinkSync(dummyPath);
        console.log('Verification Complete: Upload test passed.');

    } catch (error) {
        console.error('Test Failed:', error.response?.data || error.message);
        process.exit(1);
    }
};

setTimeout(testUpload, 5000);
