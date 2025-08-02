import Job from '../models/job.model.js';

// Get all jobs with pagination and filters
const getAllJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const filters = { isActive: true };
    
    if (req.query.search) {
      filters.$text = { $search: req.query.search };
    }
    
    if (req.query.location) {
      filters.location = new RegExp(req.query.location, 'i');
    }
    
    if (req.query.jobType) {
      filters.jobType = req.query.jobType;
    }

    const [jobs, total] = await Promise.all([
      Job.find(filters)
        .populate('postedBy', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Job.countDocuments(filters)
    ]);

    res.json({
      success: true,
      jobs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalJobs: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs'
    });
  }
};

// Get single job
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'username email')
      .populate('applicants.userId', 'username email');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job'
    });
  }
};

// Apply for job
const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { resume, coverLetter } = req.body;
    const userId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    const hasApplied = job.applicants.some(
      applicant => applicant.userId.toString() === userId
    );

    if (hasApplied) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    job.applicants.push({
      userId,
      resume,
      coverLetter
    });

    await job.save();

    res.json({
      success: true,
      message: 'Application submitted successfully'
    });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to apply for job'
    });
  }
};

// Get user's posted jobs
const getUserJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobs = await Job.find({ postedBy: userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      jobs
    });
  } catch (error) {
    console.error('Error fetching user jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user jobs'
    });
  }
};

export { getAllJobs, getJobById, applyForJob, getUserJobs };