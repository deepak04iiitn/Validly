import HackathonTeammatePost from '../models/hackathon.model.js';
import { errorHandler } from '../utils/error.js';

// Create a new hackathon teammate post
export const createHackathonPost = async (req, res, next) => {
  try {
    const {
      hackathonName,
      hackathonLink,
      teammatesRequired,
      skills,
      prize,
      location,
      city,
      startDate,
      endDate,
      description,
      status,
    } = req.body;
    if (!hackathonName || !hackathonLink || !teammatesRequired || !skills || !location || !startDate || !endDate || !description) {
      return next(errorHandler(400, 'All required fields must be filled.'));
    }
    const post = new HackathonTeammatePost({
      hackathonName,
      hackathonLink,
      teammatesRequired,
      skills,
      prize,
      location,
      city,
      startDate,
      endDate,
      description,
      status: status || 'Open',
      user: req.user.id,
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

// Get all hackathon teammate posts
export const getAllHackathonPosts = async (req, res, next) => {
  try {
    const posts = await HackathonTeammatePost.find().populate('user', 'username fullName profilePicture').sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

// Get a single hackathon teammate post by ID
export const getHackathonPostById = async (req, res, next) => {
  try {
    const post = await HackathonTeammatePost.findById(req.params.id).populate('user', 'username fullName profilePicture');
    if (!post) return next(errorHandler(404, 'Post not found.'));
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

// Delete a hackathon teammate post (only owner)
export const deleteHackathonPost = async (req, res, next) => {
  try {
    const post = await HackathonTeammatePost.findById(req.params.id);
    if (!post) return next(errorHandler(404, 'Post not found.'));
    if (post.user.toString() !== req.user.id) return next(errorHandler(403, 'Unauthorized.'));
    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted.' });
  } catch (err) {
    next(err);
  }
};

// Update a hackathon teammate post (only owner)
export const updateHackathonPost = async (req, res, next) => {
  try {
    const post = await HackathonTeammatePost.findById(req.params.id);
    if (!post) return next(errorHandler(404, 'Post not found.'));
    if (post.user.toString() !== req.user.id) return next(errorHandler(403, 'Unauthorized.'));

    // Only update allowed fields
    const allowedFields = [
      'hackathonName', 'hackathonLink', 'teammatesRequired', 'skills', 'prize',
      'location', 'city', 'startDate', 'endDate', 'description', 'status'
    ];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        post[field] = req.body[field];
      }
    });
    await post.save();
    await post.populate('user', 'username fullName profilePicture');
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
}; 