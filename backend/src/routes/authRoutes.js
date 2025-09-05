const express =require( "express");
const { registerUser, loginUser, getAllUsers,googleLogin,forgotPassword,resetPassword, validateResetToken } =require( "../controllers/authController.js");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.get('/getUsers',getAllUsers)
router.post('/forgot-password',forgotPassword)
router.post('/reset-password',resetPassword)
router.get('/validate-reset-token/:token',validateResetToken)
module.exports= router;
