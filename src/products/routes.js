const express = require("express");
const router = express.Router();
const addProducts = require('./controller')

router.post('/addProducts', addProducts)

module.exports = router;