const multer = require('multer');

// Set up multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Export the upload middleware
module.exports = upload;
