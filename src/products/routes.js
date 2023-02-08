const express = require("express");
const router = express.Router();
const addProducts = require('./controller')

/********************************************* HANDLED REQUEST IN ROUTES FILE ******************************************/

 // DEFINED ROUTES AND CALLBACKS WITH THE APPROPRIATE METHOD
router.post('/addProducts', addProducts)

module.exports = router;