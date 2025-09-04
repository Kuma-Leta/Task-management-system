const express =require( "express");
const { registerUser, loginUser, getAllUsers,googleLogin,forgotPassword,resetPassword } =require( "../controllers/authController.js");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.get('/getUsers',getAllUsers)
router.post('/forgot-password',forgotPassword)
router.post('/resetPassword',resetPassword)
module.exports= router;
