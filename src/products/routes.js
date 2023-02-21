const express = require("express");
const router = express.Router();
const {addProducts, updateProductById} = require('./controller')

/********************************************* HANDLED REQUEST IN ROUTES FILE ******************************************/

 // DEFINED ROUTES AND CALLBACKS WITH THE APPROPRIATE METHOD
router.post('/addProducts', addProducts)
router.patch('/updateProductById/:id', updateProductById)

module.exports = router;