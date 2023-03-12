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
const { verifyToken, checkAdmin } = require('../middlewares/auth')
/********************************************* HANDLED REQUEST IN ROUTES FILE ******************************************/

// DEFINED ROUTES AND CALLBACKS WITH THE APPROPRIATE METHOD

router.post("/signUp", signUp)
router.post("/login", login)
router.get("/getAll", verifyToken, checkAdmin,getAll)
router.delete('/deleteUser/:id', verifyToken , checkAdmin, deleteUser)
router.delete(`/deleteUserByEmail`, verifyToken, deleteUserByEmail)
router.patch('/updateUser/:id', verifyToken ,updateUser)
// router.post("/emptyUsersDB", emptyUsersDB); 

module.exports = router;
