const multer = require('multer');
// const path = require('path');

const storage = multer.memoryStorage(); // Store files in memory as Buffer objects

const upload = multer({ storage: storage });

module.exports = upload;