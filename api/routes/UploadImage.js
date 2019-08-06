const express = require('express');
const router = express.Router();
const multer = require('multer');

const uploadImage = require('../controllers/UploadImage')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);

    }
})


const fileFilter = (req, file, cb) => {
    //reject file
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false)
    }
}

//filter size of image
const upload = multer({
    storage: storage, limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

router.post('/',  upload.single('image'), uploadImage.uploadSingleImage)

module.exports = router;
