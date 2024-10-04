import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const UPLOADS_DIR = 'uploads/';
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

// File type validation function
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif|pdf/; // Allowed file types
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images and PDFs are allowed.'));
    }
};

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
}).single('file');

// File upload handler
export const uploadFile = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).send('File too large. Max size is 5MB.');
            }
            return res.status(400).send(err.message);
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        res.status(200).json({
            message: 'File uploaded successfully',
            filePath: req.file.path,
            fileName: req.file.filename
        });
    });
};
