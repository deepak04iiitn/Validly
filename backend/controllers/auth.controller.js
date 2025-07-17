import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signup = async (req , res , next) => {
    
    const { username, email, password, securityQuestion, securityAnswer } = req.body;
    if (!username || !email || !password || !securityQuestion || !securityAnswer || username === '' || email === '' || password === '' || securityQuestion === '' || securityAnswer === '') {
        return next(errorHandler(400, 'All fields are required!'));
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const hashedAnswer = bcryptjs.hashSync(securityAnswer, 10);
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        securityQuestion,
        securityAnswerHash: hashedAnswer,
    });
    try {
        await newUser.save();
        res.json('Signup successfull!');
    } catch (error) {
        next(error);
    }
}

// Get security question for a given email
export const getSecurityQuestion = async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required!' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found!' });
        }
        res.status(200).json({ success: true, securityQuestion: user.securityQuestion });
    } catch (error) {
        next(error);
    }
};

// Reset password with security answer
export const resetPasswordWithSecurityAnswer = async (req, res, next) => {
    const { email, securityAnswer, newPassword } = req.body;
    if (!email || !securityAnswer || !newPassword) {
        return res.status(400).json({ success: false, message: 'All fields are required!' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found!' });
        }
        const isAnswerCorrect = bcryptjs.compareSync(securityAnswer, user.securityAnswerHash);
        if (!isAnswerCorrect) {
            return res.status(400).json({ success: false, message: 'Incorrect answer to security question.' });
        }
        const hashedPassword = bcryptjs.hashSync(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ success: true, message: 'Password reset successful!' });
    } catch (error) {
        next(error);
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password || email === '' || password === '') {
        return res.status(400).json({ success: false, message: 'All fields are required!' });
    }

    try {
        const validUser = await User.findOne({ email });

        if (!validUser) {
            return res.status(404).json({ success: false, message: 'Invalid credentials!' });
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password);

        if (!validPassword) {
            return res.status(400).json({ success: false, message: 'Invalid credentials!' });
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

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, '-password');
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};