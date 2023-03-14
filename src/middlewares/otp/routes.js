const express = require("express");
const { verifyToken } = require("../auth");
const router = express.Router();
const {verifyOtp} = require('./controller')

router.post('/verifyOtp', verifyOtp)

module.exports = router