const User =require( "../models/user.js");
const jwt =require( "jsonwebtoken");
const  AppError  =require( "../utils/appError.js"); 
const asyncWraper=require('../utils/asyncWraper.js')
// Function to register a new user
const sendVerificationEmail=require('../service/emailService.js').sendVerificationEmail
const nodemailer = require("nodemailer");


// Set up nodemailer transport (use environment variables in production)

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(400).json({ message: "Invalid verification link." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified." });
    }

    user.isVerified = true;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Verification failed or link expired." });
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const userRole = role || "user";
    const newUser = await User.create({
      name: `${firstName} ${lastName}`,
      email,
      password,
      role: userRole,
      isVerified: false, // Add this field to your user model
    });

    // Generate token for email verification
    const verificationToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    await sendVerificationEmail(newUser, verificationToken);

    return res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res
      .status(500)
      .json({ message: "Server error during registration." });
  }
};


// Function to login user and generate JWT
 const loginUser = async (req, res, next) => {
  console.log(req.body)
  const { email, password } = req.body;

  // Check if the user exists
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new AppError("Invalid email or password", 401));
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, role: user.role,name:user.name },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d", // Token expires in 30 days
    }
  );

  // Send success response with token
  res.status(200).json({
    message: "User logged in successfully",
    token,
  });
};



// Protect routes
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    req.user = user; // Attach user to request object
    next();
  } catch (err) {
    return next(new AppError('Invalid token. Please log in again.', 401));
  }
};
const getAllUsers = asyncWraper(async (req, res, next) => {
  const users = await User.find({}, "name email");

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

module.exports = { loginUser, registerUser, protect,getAllUsers ,verifyEmail};