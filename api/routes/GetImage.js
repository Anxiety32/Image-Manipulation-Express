const express = require('express');
const router = express.Router();

const GetImage = require('../controllers/GetImage')


router.get('/:imageName', GetImage.manipultaion)

module.exports = router;
