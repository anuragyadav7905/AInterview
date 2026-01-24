const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';

const verifySummary = async () => {
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
        console.log('2. Mocking CV Upload...');
        const dummyPath = path.join(__dirname, 'dummy_cv_summ.pdf');
        fs.writeFileSync(dummyPath, 'Dummy Content');
        const formCV = new FormData();
        formCV.append('file', fs.createReadStream(dummyPath), { filename: 'dummy_cv_summ.pdf', contentType: 'application/pdf' });
        await axios.post(`${BASE_URL}/upload-cv`, formCV, {
            headers: { ...formCV.getHeaders(), Authorization: `Bearer ${token}` }
        });

        // Start Interview
        console.log('3. Starting Interview...');
        const startRes = await axios.post(`${BASE_URL}/interview/start`, {
            role: 'Product Manager',
            difficulty: 'Medium',
            style: 'Technical'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const interviewId = startRes.data.interviewId;

        // Generate Questions
        console.log('4. Generating Questions...');
        const qRes = await axios.post(`${BASE_URL}/interview/${interviewId}/questions`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const q1 = qRes.data[0];

        // Answer Question 1 (Good Content, Good Voice)
        console.log('5. Answering Question 1 (Good)...');
        const dummyAudioGood = path.join(__dirname, 'dummy_audio_good.webm');
        fs.writeFileSync(dummyAudioGood, 'Good audio content');

        const formAudio1 = new FormData();
        formAudio1.append('audio', fs.createReadStream(dummyAudioGood), { filename: 'answer1.webm', contentType: 'audio/webm' });
        formAudio1.append('questionId', q1._id);
        formAudio1.append('interviewId', interviewId);

        await axios.post(`${BASE_URL}/interview/answer`, formAudio1, {
            headers: { ...formAudio1.getHeaders(), Authorization: `Bearer ${token}` }
        });

        await axios.post(`${BASE_URL}/interview/evaluate`, {
            questionId: q1._id,
            interviewId: interviewId
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // Get Summary
        console.log('6. Fetching Summary...');
        const summaryRes = await axios.get(`${BASE_URL}/interview/${interviewId}/summary`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const summary = summaryRes.data;
        console.log('Summary Data:', {
            role: summary.interview.role,
            averageScore: summary.interview.averageScore,
            bestAnswer: summary.highlights.bestAnswer?.score,
            feedbackCount: summary.feedback.length
        });

        if (summary.highlights.bestAnswer && summary.interview.averageScore) {
            console.log('Verification Success: Summary data received correctly.');
        } else {
            console.log('Verification Failed: Missing summary data.');
        }

        // Cleanup
        try {
            fs.unlinkSync(dummyPath);
            fs.unlinkSync(dummyAudioGood);
        } catch (e) { }

    } catch (error) {
        console.error('Test Failed:', error.response?.data || error.message);
    }
};

verifySummary();
