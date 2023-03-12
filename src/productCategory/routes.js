const express = require('express');
const { verifyToken, checkAdmin } = require('../middlewares/auth');
const router = express.Router();
const {addNewCategory} = require('./controller')

router.post('/addNewCategory', verifyToken, checkAdmin ,addNewCategory)

module.exports = router