import express from 'express';
import { createIdea, getAllIdeas, getUserIdeas, getValidStages, updateIdea, deleteIdea, likeIdea, dislikeIdea, addPoll, votePoll, addComment, editComment, likeComment, dislikeComment, addReply, editReply, likeReply, dislikeReply, deleteComment, deleteReply, exportIdeaPDF } from '../controllers/idea.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

// Idea CRUD
router.post('/', verifyUser, createIdea);
router.get('/', getAllIdeas);
router.get('/mine', verifyUser, getUserIdeas);
router.get('/stages', getValidStages);
router.put('/:id', verifyUser, updateIdea);
router.delete('/:id', verifyUser, deleteIdea);

// Like/Dislike
router.post('/:id/like', verifyUser, likeIdea);
router.post('/:id/dislike', verifyUser, dislikeIdea);

// Polls
router.post('/:id/polls', verifyUser, addPoll);
router.post('/:ideaId/polls/:pollId/vote', verifyUser, votePoll);

// Comments
router.post('/:id/comments', verifyUser, addComment);
router.put('/:id/comments/:commentId', verifyUser, editComment);
router.post('/:id/comments/:commentId/like', verifyUser, likeComment);
router.post('/:id/comments/:commentId/dislike', verifyUser, dislikeComment);
// Replies
router.post('/:id/comments/:commentId/replies', verifyUser, addReply);
router.put('/:id/comments/:commentId/replies/:replyId', verifyUser, editReply);
router.post('/:id/comments/:commentId/replies/:replyId/like', verifyUser, likeReply);
router.post('/:id/comments/:commentId/replies/:replyId/dislike', verifyUser, dislikeReply);
router.delete('/:id/comments/:commentId', verifyUser, deleteComment);
router.delete('/:id/comments/:commentId/replies/:replyId', verifyUser, deleteReply);

// Add PDF export route
router.get('/:id/export/pdf', verifyUser, exportIdeaPDF);

export default router; 