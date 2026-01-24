const { parseCV } = require('./services/cvParser');

const mockText = `
Anurag Yadav
anurag@example.com
123-456-7890

Education
Bachelor of Computer Science, XYZ University, 2020-2024

Experience
Software Engineer, ABC Corp, 2024-Present
- Built React apps.

Skills
JavaScript, Node.js, React, MongoDB

Projects
Interview Prep App
- MERN stack application.
`;

const parsed = parseCV(mockText);

console.log('--- Mock Parsing Result ---');
console.log(JSON.stringify(parsed, null, 2));

if (parsed.name === 'Anurag Yadav' && parsed.email === 'anurag@example.com' && parsed.education.includes('Bachelor')) {
    console.log('Verification Success: Parsing logic works correctly.');
} else {
    console.log('Verification Failed: Parsing logic incorrect.');
    process.exit(1);
}
