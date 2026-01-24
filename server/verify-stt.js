const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';

const verifySTT = async () => {
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
        const dummyPath = path.join(__dirname, 'dummy_cv_stt.pdf');
        fs.writeFileSync(dummyPath, 'Dummy Content');
        const formCV = new FormData();
        formCV.append('file', fs.createReadStream(dummyPath), { filename: 'dummy_cv_stt.pdf', contentType: 'application/pdf' });
        await axios.post(`${BASE_URL}/upload-cv`, formCV, {
            headers: { ...formCV.getHeaders(), Authorization: `Bearer ${token}` }
        });

        // Start Interview
        console.log('3. Starting Interview...');
        const startRes = await axios.post(`${BASE_URL}/interview/start`, {
            role: 'Product Manager', // Different role for variety
            difficulty: 'Easy',
            style: 'Friendly'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const interviewId = startRes.data.interviewId;

        // Generate Questions
        console.log('4. Generating Questions...');
        const qRes = await axios.post(`${BASE_URL}/interview/${interviewId}/questions`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const questionId = qRes.data[0]._id;

        // Upload Audio Answer
        console.log('5. Uploading Audio Answer & Waiting for Transcript...');
        const dummyAudioPath = path.join(__dirname, 'dummy_audio_stt.webm');
        fs.writeFileSync(dummyAudioPath, 'Dummy Audio Content');

        const formAudio = new FormData();
        formAudio.append('audio', fs.createReadStream(dummyAudioPath), { filename: 'answer.webm', contentType: 'audio/webm' });
        formAudio.append('questionId', questionId);
        formAudio.append('interviewId', interviewId);

        const ansRes = await axios.post(`${BASE_URL}/interview/answer`, formAudio, {
            headers: { ...formAudio.getHeaders(), Authorization: `Bearer ${token}` }
        });

        console.log('Upload Answer Response:', ansRes.data);

        if (ansRes.data.message === 'Answer saved' && ansRes.data.transcript) {
            console.log(`Verification Success: Transcript Received: "${ansRes.data.transcript}"`);
        } else {
            console.log('Verification Failed: Transcript missing.');
        }

        // Cleanup
        try {
            fs.unlinkSync(dummyPath);
            fs.unlinkSync(dummyAudioPath);
        } catch (e) { }

    } catch (error) {
        console.error('Test Failed:', error.response?.data || error.message);
    }
};

verifySTT();
