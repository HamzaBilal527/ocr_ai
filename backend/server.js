const express = require('express');
const multer = require('multer');
const cors = require('cors');
const Tesseract = require('tesseract.js');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());

const upload = multer({ dest: 'uploads/' });

app.post('/api/ocr', upload.single('image'), async (req, res) => {
    const imagePath = path.join(__dirname, req.file.path);

    try {
        const result = await Tesseract.recognize(
            imagePath,
            'eng',
            { logger: m => console.log(m) }
        );

        fs.unlinkSync(imagePath);
        res.json({ text: result.data.text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'OCR failed' });
    }
});

app.listen(5000, () => console.log('Server running on port 5000'));
