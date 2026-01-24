const fs = require('fs');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const path = require('path');

const extractText = async (filePath) => {
    const ext = path.extname(filePath).toLowerCase();

    try {
        if (ext === '.pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            return data.text;
        } else if (ext === '.docx' || ext === '.doc') {
            // Note: mammoth works best with docx. .doc binary format is harder, but we'll try mammoth for docx.
            // For standard .doc, we might need other tools, but sticking to requirement of "PDF and DOCX".
            const result = await mammoth.extractRawText({ path: filePath });
            return result.value;
        } else {
            return '';
        }
    } catch (error) {
        console.error('Error extracting text:', error);
        throw error;
    }
};

module.exports = { extractText };
