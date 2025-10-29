import multer from 'multer'; // Importing multer for handling file uploads
import path from 'path'; // Importing path module for handling file paths
import fs from 'fs'; // Importing fs module for file system operations
import crypto from 'crypto'; // Importing crypto module for generating unique filenames

// folder to store tem uploads
const tmpDir = path.join(process.cwd(), 'public', 'tmpUploads');

// create the tmp directory if it doesn't exist
fs.mkdirSync(tmpDir, { recursive: true });

// Multer storage configuration
const storage = multer.diskStorage({

    // destination where files will be stored
    destination: (req, file, cb) => {
        cb(null, tmpDir)
    },

    // filename configuration to avoid name conflicts
    filename: (req, file, cb) => {

        crypto.randomBytes(12, (err, buff) => {
            const unikeFileName = buff.toString('hex') + path.extname(file.originalname);
            cb(null, unikeFileName);
        })
    },

});

// Multer file filter to accept only images
const imageFilter = (req, file, cb) => {

    // allowed file types
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (allowed.includes(file.mimetype)) {
        cb(null, true); // accept file
    } else {
        cb(new Error('Only images are allowed!'), false); // reject file
    }
};

// Export multer middleware
export const upload = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // limit file size to 10MB
});