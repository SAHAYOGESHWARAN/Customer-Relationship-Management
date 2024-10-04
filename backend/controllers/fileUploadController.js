import multer from 'multer';
import path from 'path';

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage }).single('file');

// File upload handler
export const uploadFile = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.status(200).json({ filePath: req.file.path });
    });
};
