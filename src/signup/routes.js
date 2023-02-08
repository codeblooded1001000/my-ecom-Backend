const express = require("express");
const router = express.Router();
const {signUp, login, sendOtp, getAll, verifyOtp, updateUser} = require('./controller')

/********************************************* HANDLED REQUEST IN ROUTES FILE ******************************************/

 // DEFINED ROUTES AND CALLBACKS WITH THE APPROPRIATE METHOD
router.get('/sendOtp', sendOtp)
router.post("/signUp", signUp)
router.post("/login", login)
router.get("/getAll", getAll)
router.post('/verifyOtp', verifyOtp)
router.patch('/updateUser', updateUser)

module.exports = router;