const express = require('express');
const fileController = require('../controllers/image-upload-controller');
const router = express.Router();

router.post('/upload/:name', fileController.uploadImage , fileController.resizeImage , fileController.sendImageServerUrl);

module.exports = router;