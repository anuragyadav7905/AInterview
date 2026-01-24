const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';

const verifyProgress = async () => {
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
        const dummyPath = path.join(__dirname, 'dummy_cv_prog.pdf');
        fs.writeFileSync(dummyPath, 'Dummy Content');
        const formCV = new FormData();
        formCV.append('file', fs.createReadStream(dummyPath), { filename: 'dummy_cv_prog.pdf', contentType: 'application/pdf' });
        await axios.post(`${BASE_URL}/upload-cv`, formCV, {
            headers: { ...formCV.getHeaders(), Authorization: `Bearer ${token}` }
        });

        // Create 2 Interviews with Scores
        console.log('3. simulating 2 interviews...');

        // Interview 1
        const start1 = await axios.post(`${BASE_URL}/interview/start`, { role: 'Role 1', difficulty: 'Easy', style: 'HR' }, { headers: { Authorization: `Bearer ${token}` } });
        const i1 = start1.data.interviewId;
        const qRes1 = await axios.post(`${BASE_URL}/interview/${i1}/questions`, {}, { headers: { Authorization: `Bearer ${token}` } });
        const q1 = qRes1.data[0];

        // Answer & Evaluate 1 (Resulting in some score)
        const dummyAudio = path.join(__dirname, 'dummy_audio_prog.webm');
        fs.writeFileSync(dummyAudio, 'Audio Content');
        const f1 = new FormData();
        f1.append('audio', fs.createReadStream(dummyAudio), { filename: 'a1.webm', contentType: 'audio/webm' });
        f1.append('questionId', q1._id);
        f1.append('interviewId', i1);
        await axios.post(`${BASE_URL}/interview/answer`, f1, { headers: { ...f1.getHeaders(), Authorization: `Bearer ${token}` } });
        await axios.post(`${BASE_URL}/interview/evaluate`, { questionId: q1._id, interviewId: i1 }, { headers: { Authorization: `Bearer ${token}` } });


        // Interview 2
        const start2 = await axios.post(`${BASE_URL}/interview/start`, { role: 'Role 2', difficulty: 'Hard', style: 'Technical' }, { headers: { Authorization: `Bearer ${token}` } });
        const i2 = start2.data.interviewId;
        const qRes2 = await axios.post(`${BASE_URL}/interview/${i2}/questions`, {}, { headers: { Authorization: `Bearer ${token}` } });
        const q2 = qRes2.data[0];

        // Answer & Evaluate 2
        const f2 = new FormData();
        f2.append('audio', fs.createReadStream(dummyAudio), { filename: 'a2.webm', contentType: 'audio/webm' });
        f2.append('questionId', q2._id);
        f2.append('interviewId', i2);
        await axios.post(`${BASE_URL}/interview/answer`, f2, { headers: { ...f2.getHeaders(), Authorization: `Bearer ${token}` } });
        await axios.post(`${BASE_URL}/interview/evaluate`, { questionId: q2._id, interviewId: i2 }, { headers: { Authorization: `Bearer ${token}` } });


        // Get Progress
        console.log('4. Fetching Progress Data...');
        const progressRes = await axios.get(`${BASE_URL}/interview/progress`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = progressRes.data;
        console.log('Progress Data:', data);

        if (Array.isArray(data) && data.length === 2 && data[0].date && data[0].score) {
            console.log('Verification Success: Progress data format correct.');
        } else {
            console.log('Verification Failed: Incorrect data format.');
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

verifyProgress();
