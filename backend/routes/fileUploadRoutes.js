import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';

// AWS S3 configuration
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
});

// Multer S3 storage configuration
const storage = multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    key: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    }
});

// Use multer with S3 storage
const upload = multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter
}).single('file');
