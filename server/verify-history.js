const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';

const verifyHistory = async () => {
    try {
        console.log('1. Logging in/Signing up...');
        const uniqueUser = `testuser_${Date.now()}`;
        const email = `${uniqueUser}@example.com`;

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

        // Upload CV
        console.log('2. Mocking CV Upload (for Interview Start)...');
        const dummyPath = path.join(__dirname, 'dummy_cv_hist.pdf');
        fs.writeFileSync(dummyPath, 'Dummy Content');
        const formCV = new FormData();
        formCV.append('file', fs.createReadStream(dummyPath), { filename: 'dummy_cv_hist.pdf', contentType: 'application/pdf' });
        await axios.post(`${BASE_URL}/upload-cv`, formCV, {
            headers: { ...formCV.getHeaders(), Authorization: `Bearer ${token}` }
        });

        // Start Interview 1
        console.log('3. Starting Interview 1...');
        await axios.post(`${BASE_URL}/interview/start`, {
            role: 'Product Manager (History Test)',
            difficulty: 'Medium',
            style: 'Technical'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // Start Interview 2
        console.log('4. Starting Interview 2...');
        await axios.post(`${BASE_URL}/interview/start`, {
            role: 'Software Engineer (History Test)',
            difficulty: 'Hard',
            style: 'Technical'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // Get History
        console.log('5. Fetching History...');
        const historyRes = await axios.get(`${BASE_URL}/interview/history`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const history = historyRes.data;
        console.log(`Found ${history.length} interviews in history.`);

        const roles = history.map(h => h.role);
        console.log('Roles:', roles);

        if (history.length >= 2 && roles.includes('Product Manager (History Test)') && roles.includes('Software Engineer (History Test)')) {
            console.log('Verification Success: History list correct.');
        } else {
            console.log('Verification Failed: Missing interviews in history.');
        }

        // Cleanup
        try {
            fs.unlinkSync(dummyPath);
        } catch (e) { }

    } catch (error) {
        console.error('Test Failed:', error.response?.data || error.message);
    }
};

verifyHistory();
