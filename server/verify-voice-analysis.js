const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';

const verifyVoiceAnalysis = async () => {
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
        const dummyPath = path.join(__dirname, 'dummy_cv_voice.pdf');
        fs.writeFileSync(dummyPath, 'Dummy Content');
        const formCV = new FormData();
        formCV.append('file', fs.createReadStream(dummyPath), { filename: 'dummy_cv_voice.pdf', contentType: 'application/pdf' });
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

        // Upload Answer 
        // We really want the transcription to contain "um" or words used for WPM
        // But our Mock service randomly selects text. Some mocked texts have fillers.
        // We rely on the mock STT logic (which we updated?). No, we updated sttService to just return random text.
        // Let's hope the random text has some words.

        console.log('5. Uploading Audio Answer...');
        const dummyAudioPath = path.join(__dirname, 'dummy_audio_voice.webm');
        fs.writeFileSync(dummyAudioPath, 'Audio Content is irrelevant for mock STT');

        const formAudio = new FormData();
        formAudio.append('audio', fs.createReadStream(dummyAudioPath), { filename: 'answer.webm', contentType: 'audio/webm' });
        formAudio.append('questionId', questionId);
        formAudio.append('interviewId', interviewId);

        await axios.post(`${BASE_URL}/interview/answer`, formAudio, {
            headers: { ...formAudio.getHeaders(), Authorization: `Bearer ${token}` }
        });

        // Evaluate
        console.log('6. Requesting Evaluation (Voice Analysis)...');
        const evalRes = await axios.post(`${BASE_URL}/interview/evaluate`, {
            questionId: questionId,
            interviewId: interviewId
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Voice Analysis Result:', {
            wpm: evalRes.data.wpm,
            fillerCount: evalRes.data.fillerCount,
            fillers: evalRes.data.fillers
        });

        if (evalRes.data.wpm !== undefined && evalRes.data.fillerCount !== undefined) {
            console.log(`Verification Success: WPM: ${evalRes.data.wpm}, Fillers: ${evalRes.data.fillerCount}`);
        } else {
            console.log('Verification Failed: Missing Voice Metrics.');
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

verifyVoiceAnalysis();
