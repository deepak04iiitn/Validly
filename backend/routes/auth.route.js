import express from 'express';
import { signup, signin, google, logout, getProfile, updateProfile, deleteAccount } from '../controllers/auth.controller.js';
import { verifyUser } from '../utils/verifyUser.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/resumes/' });

const router = express.Router();

router.post('/signup' , signup);
router.post('/signin' , signin);
router.post('/google' , google);
router.post('/logout', logout);
router.get('/profile', verifyUser, getProfile);
router.put('/profile', verifyUser, upload.single('resume'), updateProfile);
router.delete('/profile', verifyUser, deleteAccount);

export default router;