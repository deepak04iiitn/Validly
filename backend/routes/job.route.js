import express from 'express';
import { 
  getAllJobs, 
  getJobById, 
  applyForJob, 
  getUserJobs 
} from '../controllers/job.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/', getAllJobs);
router.get('/user-jobs', verifyUser, getUserJobs);
router.get('/:id', getJobById);
router.post('/:jobId/apply', verifyUser, applyForJob);

export default router;