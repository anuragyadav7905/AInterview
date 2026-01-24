const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';

const verifySuggestions = async () => {
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

        // Upload WEAK CV (no numbers, vague verbs)
        console.log('2. Mocking Weak CV Upload...');
        const dummyPath = path.join(__dirname, 'dummy_cv_bad.pdf');
        // Text with "worked on", "responsible for", no digits
        fs.writeFileSync(dummyPath, 'I worked on a project. I was responsible for the team. No numbers here.');
        const formCV = new FormData();
        formCV.append('file', fs.createReadStream(dummyPath), { filename: 'dummy_cv_bad.pdf', contentType: 'application/pdf' });
        await axios.post(`${BASE_URL}/upload-cv`, formCV, {
            headers: { ...formCV.getHeaders(), Authorization: `Bearer ${token}` }
        });

        // Generate Bad Interviews? Not strictly needed for ALL suggestions (some are pure CV check)
        // But let's verify atleast the pure CV checks ("Metrics", "Weak Verbs") triggers immediately? 
        // Logic check: The route fetches recent interviews, BUT "Metrics Check" and "Action Verbs" don't strictly require interview data in the current implementation (they look at latestCV). 
        // Only "Technical Depth" suggestion requires low interview content scores.

        console.log('3. Fetching Suggestions...');
        const suggRes = await axios.get(`${BASE_URL}/upload-cv/suggestions`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Suggestions:', suggRes.data);

        // Expect: "Experience" (missing metrics) and "General Phrasing" (weak verbs)
        const hasMetricsTip = suggRes.data.some(s => s.section === 'Experience');
        const hasPhrasingTip = suggRes.data.some(s => s.section === 'General Phrasing');

        if (hasMetricsTip && hasPhrasingTip) {
            console.log('Verification Success: Correct suggestions generated.');
        } else {
            console.log('Verification Warning: Missing expected suggestions.');
        }

        // Cleanup
        try {
            fs.unlinkSync(dummyPath);
        } catch (e) { }

    } catch (error) {
        console.error('Test Failed:', error.response?.data || error.message);
    }
};

verifySuggestions();
