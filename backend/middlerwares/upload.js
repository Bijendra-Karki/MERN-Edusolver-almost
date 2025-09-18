import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure folders exist
const ensureFolderExists = (folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
};

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = 'uploads/others/';
    if (file.fieldname === 'image') folder = 'uploads/images/';
    else if (file.fieldname === 'subjectFile') folder = 'uploads/pdfs/';
    else if (file.fieldname === 'instructorAvatar') folder = 'uploads/avatars/';

    ensureFolderExists(folder); // make sure folder exists
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const cleanName = file.originalname.replace(/\s+/g, '-'); // replace spaces with dash
    cb(null, `${timestamp}-${cleanName}`);
  },
});

// File filter (images & PDFs only)
const fileFilter = (req, file, cb) => {
  const imageTypes = /jpeg|jpg|png|gif/;
  const pdfTypes = /pdf/;
  const ext = path.extname(file.originalname).toLowerCase();

  // Check based on fieldname
  if (file.fieldname === 'image' || file.fieldname === 'instructorAvatar') {
    if (imageTypes.test(ext)) {
      return cb(null, true);
    }
    return cb(new Error('Only image files are allowed!'), false);
  } else if (file.fieldname === 'subjectFile') {
    if (pdfTypes.test(ext)) {
      return cb(null, true);
    }
    return cb(new Error('Only PDF files are allowed!'), false);
  } else {
    // This is the fallback for any field not explicitly handled.
    // If this error is triggered, it's a field not in `upload.fields`.
    cb(new Error(`Unexpected field: ${file.fieldname}`), false);
  }
};

// Create the multer instance. We will call .fields() on this instance in the routes.
const upload = multer({ storage, fileFilter });

export default upload;