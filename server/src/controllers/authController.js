import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Register new user
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all required fields' 
      });
    }

    // Check if user exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword
    });

    // Generate token
    const token = generateToken(newUser._id);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Send welcome email
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Welcome to Our Service',
      html: `
        <h1>Welcome ${name}!</h1>
        <p>Your account has been successfully created.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    // Return response without password
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      isAccountVerified: newUser.isAccountVerified
    };

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userResponse
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

// Login user
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide email and password' 
      });
    }

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Return response without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAccountVerified: user.isAccountVerified
    };

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

// Logout user
export const logout = (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    return res.status(200).json({ 
      success: true,
      message: 'Logged out successfully' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

// Check authentication status
export const isAuthenticated = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authenticated' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Authenticated',
      user
    });

  } catch (error) {
    console.error('Auth check error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

// Send verification OTP
export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = res.locals.userId;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    if (user.isAccountVerified) {
      return res.status(400).json({ 
        success: false,
        message: 'Account already verified' 
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verifyOtp = otp;
    user.verifyOtpExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Verify Your Account',
      html: `
        <p>Your verification code is: <strong>${otp}</strong></p>
        <p>This code will expire in 24 hours.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ 
      success: true,
      message: 'Verification OTP sent' 
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to send OTP' 
    });
  }
};

// Verify email with OTP
export const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const userId = res.locals.userId;

  try {
    const user = await userModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    if (user.isAccountVerified) {
      return res.status(400).json({ 
        success: false,
        message: 'Account already verified' 
      });
    }

    if (user.verifyOtp !== otp) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid OTP' 
      });
    }

    if (user.verifyOtpExpiry < new Date()) {
      return res.status(400).json({ 
        success: false,
        message: 'OTP expired' 
      });
    }

    user.isAccountVerified = true;
    user.verifyOtp = undefined;
    user.verifyOtpExpiry = undefined;
    await user.save();

    return res.status(200).json({ 
      success: true,
      message: 'Account verified successfully' 
    });

  } catch (error) {
    console.error('Verify email error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to verify email' 
    });
  }
};

// Send password reset OTP
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Password Reset OTP',
      html: `
        <p>Your password reset code is: <strong>${otp}</strong></p>
        <p>This code will expire in 15 minutes.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ 
      success: true,
      message: 'Password reset OTP sent' 
    });

  } catch (error) {
    console.error('Send reset OTP error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to send reset OTP' 
    });
  }
};

// Verify password reset OTP
export const verifyResetOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid OTP' 
      });
    }

    if (user.resetOtpExpiry < new Date()) {
      return res.status(400).json({ 
        success: false,
        message: 'OTP expired' 
      });
    }

    return res.status(200).json({ 
      success: true,
      message: 'OTP verified successfully' 
    });

  } catch (error) {
    console.error('Verify reset OTP error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to verify OTP' 
    });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Verify OTP again for security
    if (user.resetOtp !== otp || user.resetOtpExpiry < new Date()) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid or expired OTP' 
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();

    return res.status(200).json({ 
      success: true,
      message: 'Password reset successfully' 
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to reset password' 
    });
  }
};