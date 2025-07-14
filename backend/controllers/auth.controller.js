import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export const signup = async (req , res , next) => {
    
    const { username , email , password } = req.body;

    if(!username || !email || !password || username === '' || email === '' || password === '')
    {
        next(errorHandler(400 , 'All fields are required!'));
    }

    const hashedPassword = bcryptjs.hashSync(password , 10);

    const newUser = new User({
        username,
        email,
        password : hashedPassword,
    });

    try {
        
        await newUser.save();

        res.json('Signup successfull!');

    } catch (error) {
        next(error);
    }

}


export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password || email === '' || password === '') {
        next(errorHandler(400, 'All fields are required!'));
    }

    try {
        const validUser = await User.findOne({ email });

        if (!validUser) {
            return next(errorHandler(404, 'Invalid credentials!'));
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password);

        if (!validPassword) {
            return next(errorHandler(400, 'Invalid credentials!'));
        }

        const expiresInSeconds = 60 * 60; // 1 hour
        const token = jwt.sign(
            { 
                id: validUser._id,
                isUserAdmin: validUser.isUserAdmin  // Include isUserAdmin in the token
            },
            process.env.JWT_SECRET,
            { expiresIn: expiresInSeconds } // Set token expiry to 1 hour
        );
        const expiresAt = Date.now() + expiresInSeconds * 1000;
        const { password: pass, ...rest } = validUser._doc;

        res.status(200)
           .cookie('access_token', token, {
                httpOnly: true
           })
           .json({ ...rest, token, expiresAt });

    } catch (error) {
        next(error);
    }
}

// 2. Modify the google auth function to handle admin status
export const google = async(req, res, next) => {
    const { name, email, googlePhotoUrl } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user) {
            const expiresInSeconds = 60 * 60; // 1 hour
            const token = jwt.sign(
                {
                    id: user._id,
                    isUserAdmin: user.isUserAdmin  // Include isUserAdmin in the token
                },
                process.env.JWT_SECRET,
                { expiresIn: expiresInSeconds } // Set token expiry to 1 hour
            );
            const expiresAt = Date.now() + expiresInSeconds * 1000;
            const { password, ...rest } = user._doc;

            res.status(200)
               .cookie('access_token', token, {
                    httpOnly: true
               })
               .json({ ...rest, token, expiresAt });
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + 
                                    Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + 
                         Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
                isUserAdmin: false  // Set default admin status for new users
            });

            await newUser.save();

            const expiresInSeconds = 60 * 60; // 1 hour
            const token = jwt.sign(
                {
                    id: newUser._id,
                    isUserAdmin: newUser.isUserAdmin  // Include isUserAdmin in the token
                },
                process.env.JWT_SECRET,
                { expiresIn: expiresInSeconds } // Set token expiry to 1 hour
            );
            const expiresAt = Date.now() + expiresInSeconds * 1000;
            const { password, ...rest } = newUser._doc;

            res.status(200)
               .cookie('access_token', token, {
                    httpOnly: true
               })
               .json({ ...rest, token, expiresAt });
        }
    } catch (error) {
        next(error);
    }
}

export const logout = (req, res) => {
  res.clearCookie('access_token', {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  });
  res.status(200).json({ success: true, message: 'Signed out successfully.' });
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updateFields = { ...req.body };
    // If resume file uploaded, set resume field
    if (req.file && req.file.path) {
      updateFields.resume = {
        path: req.file.path,
        originalName: req.file.originalname
      };
    }
    // Mark profile as completed if all required fields are present
    const requiredFields = ['fullName', 'skills', 'location', 'bio', 'role', 'userType'];
    let isProfileCompleted = true;
    for (const field of requiredFields) {
      if (!updateFields[field] || updateFields[field] === '') {
        isProfileCompleted = false;
        break;
      }
    }
    updateFields.isProfileCompleted = isProfileCompleted;
    // Parse bestWorks if sent as JSON string
    if (updateFields.bestWorks && typeof updateFields.bestWorks === 'string') {
      try {
        updateFields.bestWorks = JSON.parse(updateFields.bestWorks);
      } catch (e) {
        // fallback: ignore or set to []
        updateFields.bestWorks = [];
      }
    }
    const user = await User.findByIdAndUpdate(req.user.id, updateFields, { new: true, runValidators: true }).select('-password');
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.clearCookie('access_token', {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    });
    res.status(200).json({ success: true, message: 'Account deleted successfully.' });
  } catch (err) {
    next(err);
  }
};


export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 1000 * 60 * 60; // 1 hour
    user.resetPasswordToken = token;
    user.resetPasswordExpires = expiry;
    await user.save();

    // Set up nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or your preferred email provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      html: `<p>You requested a password reset.</p><p>Click <a href="${resetUrl}">here</a> to reset your password. This link will expire in 1 hour.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending reset email', error: err.message });
  }
};


export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    res.status(200).json({ message: 'Password has been reset' });
  } catch (err) {
    res.status(500).json({ message: 'Error resetting password', error: err.message });
  }
};