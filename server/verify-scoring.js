const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';

const verifyScoring = async () => {
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
        const dummyPath = path.join(__dirname, 'dummy_cv_score.pdf');
        fs.writeFileSync(dummyPath, 'Dummy Content');
        const formCV = new FormData();
        formCV.append('file', fs.createReadStream(dummyPath), { filename: 'dummy_cv_score.pdf', contentType: 'application/pdf' });
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
        const questions = qRes.data;
        const q1 = questions[0];
        const q2 = questions[1];

        // --- Question 1 ---
        console.log('5. Answering Question 1...');
        const dummyAudioPath = path.join(__dirname, 'dummy_audio_score.webm');
        fs.writeFileSync(dummyAudioPath, 'Audio Content');

        const formAudio1 = new FormData();
        formAudio1.append('audio', fs.createReadStream(dummyAudioPath), { filename: 'answer1.webm', contentType: 'audio/webm' });
        formAudio1.append('questionId', q1._id);
        formAudio1.append('interviewId', interviewId);

        await axios.post(`${BASE_URL}/interview/answer`, formAudio1, {
            headers: { ...formAudio1.getHeaders(), Authorization: `Bearer ${token}` }
        });

        console.log('6. Evaluating Question 1...');
        const eval1 = await axios.post(`${BASE_URL}/interview/evaluate`, {
            questionId: q1._id,
            interviewId: interviewId
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log(`Frequency 1: Content: ${eval1.data.score}, Voice: ${eval1.data.voiceScore}, Final: ${eval1.data.finalScore}, Avg: ${eval1.data.averageScore}`);

        // --- Question 2 ---
        console.log('7. Answering Question 2...');
        const formAudio2 = new FormData();
        formAudio2.append('audio', fs.createReadStream(dummyAudioPath), { filename: 'answer2.webm', contentType: 'audio/webm' });
        formAudio2.append('questionId', q2._id);
        formAudio2.append('interviewId', interviewId);

        await axios.post(`${BASE_URL}/interview/answer`, formAudio2, {
            headers: { ...formAudio2.getHeaders(), Authorization: `Bearer ${token}` }
        });

        console.log('8. Evaluating Question 2...');
        const eval2 = await axios.post(`${BASE_URL}/interview/evaluate`, {
            questionId: q2._id,
            interviewId: interviewId
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log(`Frequency 2: Content: ${eval2.data.score}, Voice: ${eval2.data.voiceScore}, Final: ${eval2.data.finalScore}, Avg: ${eval2.data.averageScore}`);

        // Verify Average Score
        const expectedAvg = ((eval1.data.finalScore + eval2.data.finalScore) / 2).toFixed(1);
        if (Number(eval2.data.averageScore) === Number(expectedAvg)) {
            console.log(`Verification Success: Average Match (${expectedAvg})`);
        } else {
            console.log(`Verification Failed: Expected ${expectedAvg}, got ${eval2.data.averageScore}`);
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

verifyScoring();
