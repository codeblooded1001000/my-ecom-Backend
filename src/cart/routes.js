const express = require("express");
const { verifyToken } = require("../middlewares/auth");
const router = express.Router();
const addItemToCart = require('./controller')

/********************************************* HANDLED REQUEST IN ROUTES FILE ******************************************/

 // DEFINED ROUTES AND CALLBACKS WITH THE APPROPRIATE METHOD
router.post('/addItemToCart', verifyToken ,addItemToCart)

module.exports = router