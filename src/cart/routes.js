const express = require("express");
const router = express.Router();
const addItemToCart = require('./controller')

/********************************************* HANDLED REQUEST IN ROUTES FILE ******************************************/

 // DEFINED ROUTES AND CALLBACKS WITH THE APPROPRIATE METHOD
router.post('/addItemToCart', addItemToCart)

module.exports = router