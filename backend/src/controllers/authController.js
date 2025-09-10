const User =require( "../models/user.js");
const jwt =require( "jsonwebtoken");
const  AppError  =require( "../utils/appError.js"); 
const asyncWraper=require('../utils/asyncWraper.js')
// Function to register a new user
const sendVerificationEmail=require('../service/emailService.js').sendVerificationEmail
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");
 // Your User model
 const crypto = require("crypto");

require("dotenv").config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

const googleLogin = async (req, res, next) => {
 try {
  
   const { token } = req.body;

   if (!token) {
     return res.status(400).json({
       success: false,
       message: "Google token is required",
     });
   }

   // Verify the Google token
   const ticket = await client.verifyIdToken({
     idToken: token,
     audience: process.env.GOOGLE_CLIENT_ID,
   });

   const payload = ticket.getPayload();
   const { email, name, picture, sub: googleId } = payload;

   // Check if user already exists
   let user = await User.findOne( 
    {
     $or: [{ email }, { googleId }],
   }
  );

   if (!user) {
     // Create new user if doesn't exist
     user = new User({
       email,
       name,
       googleId,
       avatar: picture,
       isVerified: true, // Google verified emails are already verified
       authMethod: "google",
     });
     await user.save();
   } else {
     // Update existing user with Google info if needed
     if (!user.googleId) {
       user.googleId = googleId;
       user.authMethod = "google";
       await user.save();
     }
   }

   // Generate JWT token
   const jwtToken = jwt.sign(
     {
       userId: user._id,
       email: user.email,
       role: user.role,
     },
     process.env.JWT_SECRET,
     { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
   );

   res.json({
     success: true,
     message: "Google authentication successful",
     token: jwtToken,
     user: {
       id: user._id,
       email: user.email,
       name: user.name,
       role: user.role,
       avatar: user.avatar,
     },
   });
 } catch (error) {
   console.error("Google auth error:", error);
   res.status(500).json({
     success: false,
     message: "Google authentication failed",
     error: error.message,
   });
 }
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
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const forgotPassword = asyncWraper(async (req, res, next) => {
   try {
     const { email } = req.body;

     if (!email) {
       return res.status(400).json({
         success: false,
         message: "Email is required",
       });
     }

     // Find user by email
     const user = await User.findOne({ email });

     // Always return success even if email doesn't exist (for security)
     if (!user) {
       return res.json({
         success: true,
         message:
           "If the email exists, password reset instructions have been sent",
       });
     }

     // Generate reset token
     const resetToken = crypto.randomBytes(32).toString("hex");
     const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

     // Save reset token to user
     user.resetPasswordToken = resetToken;
     user.resetPasswordExpires = resetTokenExpiry;
     await user.save();

     // Create reset URL
     const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

     // Email content
     const mailOptions = {
       to: user.email,
       from: process.env.EMAIL_FROM,
       subject: "Password Reset Request - EagleLion Task Management",
       html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #801A1A;">Password Reset Request</h2>
          <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
          <p>Please click on the following link, or paste this into your browser to complete the process:</p>
          <p>
            <a href="${resetUrl}" style="background-color: #801A1A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Reset Password
            </a>
          </p>
          <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
          <p>This reset link will expire in 1 hour.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            EagleLion Task Management System<br>
            This is an automated message, please do not reply.
          </p>
        </div>
      `,
     };

     // Send email
     await transporter.sendMail(mailOptions);

     res.json({
       success: true,
       message: "Password reset instructions have been sent to your email",
     });
   } catch (error) {
     console.error("Forgot password error:", error);
     res.status(500).json({
       success: false,
       message: "Error sending password reset email",
     });
   }
})
const resetPassword=asyncWraper(async (req, res, next) => {
try {
  const { token, newPassword, confirmPassword } = req.body;

  if (!token || !newPassword || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Token, new password, and confirmation are required",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Passwords do not match",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long",
    });
  }

  // Find user by reset token and check expiry
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Password reset token is invalid or has expired",
    });
  }

  // Update password and clear reset token
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.authMethod = "local"; // Ensure auth method is local after password reset
  await user.save();

  // Send confirmation email
  const mailOptions = {
    to: user.email,
    from: process.env.EMAIL_FROM,
    subject: "Password Reset Successful - EagleLion Task Management",
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #801A1A;">Password Reset Successful</h2>
          <p>Your password has been successfully reset.</p>
          <p>If you did not perform this action, please contact our support team immediately.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            EagleLion Task Management System<br>
            This is an automated message, please do not reply.
          </p>
        </div>
      `,
  };

  await transporter.sendMail(mailOptions);

  res.json({
    success: true,
    message: "Password has been reset successfully",
  });
} catch (error) {
  console.error("Reset password error:", error);
  res.status(500).json({
    success: false,
    message: "Error resetting password",
  });
}
})
const validateResetToken=asyncWraper(async (req, res, next) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Password reset token is invalid or has expired",
      });
    }

    res.json({
      success: true,
      message: "Token is valid",
      email: user.email,
    });
  } catch (error) {
    console.error("Validate token error:", error);
    res.status(500).json({
      success: false,
      message: "Error validating token",
    });
  }
})
module.exports = { loginUser,googleLogin,validateResetToken, forgotPassword,resetPassword,registerUser, protect,getAllUsers ,verifyEmail};