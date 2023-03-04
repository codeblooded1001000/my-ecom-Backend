const express = require("express");
const router = express.Router();
const { addProducts, addMultipleProducts, updateProductById, getAll } = require('./controller')

/********************************************* HANDLED REQUEST IN ROUTES FILE ******************************************/

// DEFINED ROUTES AND CALLBACKS WITH THE APPROPRIATE METHOD
router.get('/getAll', getAll)
router.post('/addProducts', addProducts)
router.post('/addMultipleProducts', addMultipleProducts)
router.patch('/updateProductById/:id', updateProductById)

module.exports = router;