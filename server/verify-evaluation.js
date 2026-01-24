const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';

const verifyEvaluation = async () => {
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
        const dummyPath = path.join(__dirname, 'dummy_cv_eval.pdf');
        fs.writeFileSync(dummyPath, 'Dummy Content');
        const formCV = new FormData();
        formCV.append('file', fs.createReadStream(dummyPath), { filename: 'dummy_cv_eval.pdf', contentType: 'application/pdf' });
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
        const questionId = qRes.data[0]._id;

        // Upload Answer (Simulate long answer for better score)
        console.log('5. Uploading Answer...');
        const dummyAudioPath = path.join(__dirname, 'dummy_audio_eval.webm');
        fs.writeFileSync(dummyAudioPath, 'A sufficiently long fake audio content to ensure it is not rejected as empty.');

        const formAudio = new FormData();
        formAudio.append('audio', fs.createReadStream(dummyAudioPath), { filename: 'answer.webm', contentType: 'audio/webm' });
        formAudio.append('questionId', questionId);
        formAudio.append('interviewId', interviewId);

        await axios.post(`${BASE_URL}/interview/answer`, formAudio, {
            headers: { ...formAudio.getHeaders(), Authorization: `Bearer ${token}` }
        });

        // Evaluate
        console.log('6. Requesting Evaluation...');
        const evalRes = await axios.post(`${BASE_URL}/interview/evaluate`, {
            questionId: questionId,
            interviewId: interviewId
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Evaluation Result:', evalRes.data);

        if (evalRes.data.score && evalRes.data.feedback) {
            console.log(`Verification Success: Score ${evalRes.data.score}/10`);
        } else {
            console.log('Verification Failed: Missing score/feedback.');
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

verifyEvaluation();
