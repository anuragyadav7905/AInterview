const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

const verifyQuestionGen = async () => {
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
            console.log('User exists, logging in...');
            const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
                email: email,
                password: 'password123'
            });
            token = loginRes.data.token;
        }

        // Mock CV upload if needed, but for now we assume the user has one or we Mock it.
        // Actually, the route checks for CV. So we MUST upload one.
        // Re-using simplified upload logic from earlier verification would be ideal, 
        // but let's assume we can skip to Interview Start if we had a mechanism, 
        // OR we just fail if no CV. 
        // To make this Robust: Upload a dummy CV first.

        console.log('2. Mocking CV Upload (Req for Interview)...');
        // We'll just create a dummy "CV" in DB directly if we were inside the app, 
        // but as an external script, we must hit the upload endpoint.
        // ... I'll try to start interview. If it fails due to no CV, I know it's working partially.
        // But to verify Question Generation, I need a valid interview ID.

        // Use existing manual verification strategy or try to create a cv document directly if I could?
        // Let's just create a quick dummy upload.
        const fs = require('fs');
        const FormData = require('form-data');
        const path = require('path');
        const dummyPath = path.join(__dirname, 'dummy.pdf');
        fs.writeFileSync(dummyPath, 'Dummy Content'); // Minimal valid text
        const form = new FormData();
        form.append('file', fs.createReadStream(dummyPath), { filename: 'dummy.pdf', contentType: 'application/pdf' });

        await axios.post(`${BASE_URL}/upload-cv`, form, {
            headers: { ...form.getHeaders(), Authorization: `Bearer ${token}` }
        });

        console.log('3. Starting Interview...');
        const startRes = await axios.post(`${BASE_URL}/interview/start`, {
            role: 'SDE',
            difficulty: 'Medium',
            style: 'Technical'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const interviewId = startRes.data.interviewId;
        console.log(`Interview Started: ${interviewId}`);

        console.log('4. Generating Questions...');
        const qRes = await axios.post(`${BASE_URL}/interview/${interviewId}/questions`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Generated Questions:', qRes.data.length);
        qRes.data.forEach((q, i) => console.log(`${i + 1}. ${q.content}`));

        if (qRes.data.length === 5) {
            console.log('Verification Success: 5 questions generated.');
        } else {
            console.log('Verification Failed: Incorrect number of questions.');
        }

    } catch (error) {
        console.error('Test Failed:', error.response?.data || error.message);
    }
};

verifyQuestionGen();
