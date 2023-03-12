const express = require("express");
const router = express.Router();
const {
  signUp,
  login,
  getAll,
  updateUser,
  deleteUser,
  deleteUserByEmail,
  //   emptyUsersDB,
} = require("./controller");

/********************************************* HANDLED REQUEST IN ROUTES FILE ******************************************/

// DEFINED ROUTES AND CALLBACKS WITH THE APPROPRIATE METHOD
// router.get('/sendOtp', sendOtp)
router.post("/signUp", signUp);
router.post("/login", login);
router.get("/getAll", getAll);
router.delete("/deleteUser/:id", deleteUser);
router.delete(`/deleteUserByEmail`, deleteUserByEmail);
// router.post('/verifyOtp', verifyOtp)
router.patch("/updateUser/:id", updateUser);

// router.post("/emptyUsersDB", emptyUsersDB);   //DELETES WHOLE COLLECTION

module.exports = router;
