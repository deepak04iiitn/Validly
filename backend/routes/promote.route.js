import express from 'express';
import { verifyUser } from '../utils/verifyUser.js';
import { createPromotePost, deletePromotion, dislikePromote, getAllPromotePosts, getUserPromotions, likePromote, updatePromotion } from '../controllers/promote.controller.js';

const router = express.Router();

router.post('/promote' , verifyUser , createPromotePost);
router.get('/getAllPromotions' , getAllPromotePosts)
router.get('/mine', verifyUser, getUserPromotions);

router.put('/:id', verifyUser, updatePromotion);
router.delete('/:id', verifyUser, deletePromotion);

router.post('/:id/like', verifyUser, likePromote);
router.post('/:id/dislike', verifyUser, dislikePromote);

export default router;