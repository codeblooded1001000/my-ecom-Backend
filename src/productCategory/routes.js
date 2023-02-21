const express = require('express');
const router = express.Router();
const {addNewCategory} = require('./controller')

router.post('/addNewCategory', addNewCategory)

module.exports = router