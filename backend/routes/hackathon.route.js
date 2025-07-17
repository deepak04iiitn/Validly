import express from 'express';
import { createHackathonPost, getAllHackathonPosts, getHackathonPostById, deleteHackathonPost, updateHackathonPost } from '../controllers/hackathon.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

// Create a new post
router.post('/', verifyUser, createHackathonPost);
// Get all posts
router.get('/', getAllHackathonPosts);
// Get a single post by ID
router.get('/:id', getHackathonPostById);
// Delete a post (only owner)
router.delete('/:id', verifyUser, deleteHackathonPost);
// Update a post (only owner)
router.put('/:id', verifyUser, updateHackathonPost);

export default router; 