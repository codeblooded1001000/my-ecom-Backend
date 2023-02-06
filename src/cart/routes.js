const express = require("express");
const router = express.Router();
const addItemToCart = require('./controller')

router.post('/addItemToCart', addItemToCart)

module.exports = router