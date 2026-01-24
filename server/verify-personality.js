const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';

const verifyPersonality = async () => {
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
        const dummyPath = path.join(__dirname, 'dummy_cv_pers.pdf');
        fs.writeFileSync(dummyPath, 'Dummy Content');
        const formCV = new FormData();
        formCV.append('file', fs.createReadStream(dummyPath), { filename: 'dummy_cv_pers.pdf', contentType: 'application/pdf' });
        await axios.post(`${BASE_URL}/upload-cv`, formCV, {
            headers: { ...formCV.getHeaders(), Authorization: `Bearer ${token}` }
        });

        // 1. Strict Interview
        console.log('3. Starting STRICT Interview...');
        const strictRes = await axios.post(`${BASE_URL}/interview/start`, {
            role: 'Dev', difficulty: 'Medium', style: 'Strict'
        }, { headers: { Authorization: `Bearer ${token}` } });
        const strictId = strictRes.data.interviewId;

        // Generate Qs
        const qRes1 = await axios.post(`${BASE_URL}/interview/${strictId}/questions`, {}, { headers: { Authorization: `Bearer ${token}` } });
        const q1 = qRes1.data[0];

        // Answer
        const dummyAudio = path.join(__dirname, 'dummy_audio_pers.webm');
        fs.writeFileSync(dummyAudio, 'Audio Content');
        const formAudio1 = new FormData();
        formAudio1.append('audio', fs.createReadStream(dummyAudio), { filename: `answer_1.webm`, contentType: 'audio/webm' });
        formAudio1.append('questionId', q1._id);
        formAudio1.append('interviewId', strictId);
        await axios.post(`${BASE_URL}/interview/answer`, formAudio1, { headers: { ...formAudio1.getHeaders(), Authorization: `Bearer ${token}` } });

        // Evaluate
        const evalStrict = await axios.post(`${BASE_URL}/interview/evaluate`, {
            questionId: q1._id, interviewId: strictId
        }, { headers: { Authorization: `Bearer ${token}` } });

        console.log('Strict Feedback:', evalStrict.data.feedback);
        if (evalStrict.data.feedback.includes('insufficient') || evalStrict.data.feedback.includes('Acceptable')) {
            console.log('Verification Success: Strict tone detected.');
        } else {
            console.log('Verification Warning: Strict tone missing?');
        }

        // 2. Friendly Interview
        console.log('4. Starting FRIENDLY Interview...');
        const friendRes = await axios.post(`${BASE_URL}/interview/start`, {
            role: 'Dev', difficulty: 'Medium', style: 'Friendly'
        }, { headers: { Authorization: `Bearer ${token}` } });
        const friendId = friendRes.data.interviewId;

        // Generate Qs
        const qRes2 = await axios.post(`${BASE_URL}/interview/${friendId}/questions`, {}, { headers: { Authorization: `Bearer ${token}` } });
        const q2 = qRes2.data[0];

        // Answer
        const formAudio2 = new FormData();
        formAudio2.append('audio', fs.createReadStream(dummyAudio), { filename: `answer_2.webm`, contentType: 'audio/webm' });
        formAudio2.append('questionId', q2._id);
        formAudio2.append('interviewId', friendId);
        await axios.post(`${BASE_URL}/interview/answer`, formAudio2, { headers: { ...formAudio2.getHeaders(), Authorization: `Bearer ${token}` } });

        // Evaluate
        const evalFriend = await axios.post(`${BASE_URL}/interview/evaluate`, {
            questionId: q2._id, interviewId: friendId
        }, { headers: { Authorization: `Bearer ${token}` } });

        console.log('Friendly Feedback:', evalFriend.data.feedback);
        if (evalFriend.data.feedback.includes('Great effort')) {
            console.log('Verification Success: Friendly tone detected.');
        } else {
            console.log('Verification Warning: Friendly tone missing?');
        }

        // Cleanup
        try {
            fs.unlinkSync(dummyPath);
            fs.unlinkSync(dummyAudio);
        } catch (e) { }

    } catch (error) {
        console.error('Test Failed:', error.response?.data || error.message);
    }
};

verifyPersonality();
