import Idea from '../models/idea.model.js';
import { errorHandler } from '../utils/error.js';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import PDFDocument from 'pdfkit';
import getStream from 'get-stream';

// Create a new idea
export const createIdea = async (req, res, next) => {
  try {
    const { problem, solution, stage, link, autoDeleteAfterDays, polls } = req.body;
    if (!problem || !solution || !stage) {
      return next(errorHandler(400, 'Problem, Solution, and Stage are required.'));
    }
    
    // Validate stage
    const validStages = ['Concept', 'Prototype', 'MVP', 'Beta', 'Production'];
    if (!validStages.includes(stage)) {
      return next(errorHandler(400, 'Invalid stage. Must be one of: Concept, Prototype, MVP, Beta, Production'));
    }
    // Ensure pollId/optionId
    let processedPolls = [];
    if (Array.isArray(polls)) {
      processedPolls = polls.map(poll => ({
        ...poll,
        pollId: poll.pollId || uuidv4(),
        options: Array.isArray(poll.options)
          ? poll.options.map(opt => ({ ...opt, optionId: opt.optionId || uuidv4(), votes: opt.votes || [] }))
          : [],
      }));
    }
    const idea = new Idea({
      problem,
      solution,
      stage,
      link,
      autoDeleteAfterDays,
      userRef: req.user.id,
      polls: processedPolls,
    });
    await idea.save();
    res.status(201).json(idea);
  } catch (err) {
    next(err);
  }
};

// Get all ideas
export const getAllIdeas = async (req, res, next) => {
  try {
    const ideas = await Idea.find().sort({ createdAt: -1 });
    res.status(200).json(ideas);
  } catch (err) {
    next(err);
  }
};

// Get ideas for logged-in user
export const getUserIdeas = async (req, res, next) => {
  try {
    const ideas = await Idea.find({ userRef: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(ideas);
  } catch (err) {
    next(err);
  }
};

// Get valid development stages
export const getValidStages = async (req, res, next) => {
  try {
    const validStages = [
      { value: 'Concept', label: 'Concept', color: 'from-blue-100 to-indigo-100' },
      { value: 'Prototype', label: 'Prototype', color: 'from-yellow-100 to-orange-100' },
      { value: 'MVP', label: 'MVP', color: 'from-green-100 to-emerald-100' },
      { value: 'Beta', label: 'Beta', color: 'from-purple-100 to-violet-100' },
      { value: 'Production', label: 'Production', color: 'from-red-100 to-pink-100' }
    ];
    res.status(200).json(validStages);
  } catch (err) {
    next(err);
  }
};

// Update an idea (only owner)
export const updateIdea = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return next(errorHandler(404, 'Idea not found.'));
    if (idea.userRef !== req.user.id) return next(errorHandler(403, 'Unauthorized.'));
    const { problem, solution, stage, link, autoDeleteAfterDays, polls } = req.body;
    if (problem !== undefined) idea.problem = problem;
    if (solution !== undefined) idea.solution = solution;
    if (stage !== undefined) {
      // Validate stage
      const validStages = ['Concept', 'Prototype', 'MVP', 'Beta', 'Production'];
      if (!validStages.includes(stage)) {
        return next(errorHandler(400, 'Invalid stage. Must be one of: Concept, Prototype, MVP, Beta, Production'));
      }
      idea.stage = stage;
    }
    if (link !== undefined) idea.link = link;
    if (autoDeleteAfterDays !== undefined) idea.autoDeleteAfterDays = autoDeleteAfterDays;
    if (polls !== undefined) {
      idea.polls = Array.isArray(polls)
        ? polls.map(poll => ({
            ...poll,
            pollId: poll.pollId || uuidv4(),
            options: Array.isArray(poll.options)
              ? poll.options.map(opt => ({ ...opt, optionId: opt.optionId || uuidv4(), votes: opt.votes || [] }))
              : [],
          }))
        : [];
    }
    idea.updatedAt = Date.now();
    await idea.save();
    res.status(200).json(idea);
  } catch (err) {
    next(err);
  }
};

// Delete an idea (only owner)
export const deleteIdea = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return next(errorHandler(404, 'Idea not found.'));
    if (idea.userRef !== req.user.id) return next(errorHandler(403, 'Unauthorized.'));
    await idea.deleteOne();
    res.status(200).json({ message: 'Idea deleted.' });
  } catch (err) {
    next(err);
  }
};

// Like an idea
export const likeIdea = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return next(errorHandler(404, 'Idea not found.'));
    if (!idea.likes.includes(req.user.id)) {
      idea.likes.push(req.user.id);
      idea.numberOfLikes = idea.likes.length;
      // Remove dislike if present
      idea.dislikes = idea.dislikes.filter(id => id !== req.user.id);
      idea.numberOfDislikes = idea.dislikes.length;
      await idea.save();
    }
    res.status(200).json(idea);
  } catch (err) {
    next(err);
  }
};

// Dislike an idea
export const dislikeIdea = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return next(errorHandler(404, 'Idea not found.'));
    if (!idea.dislikes.includes(req.user.id)) {
      idea.dislikes.push(req.user.id);
      idea.numberOfDislikes = idea.dislikes.length;
      // Remove like if present
      idea.likes = idea.likes.filter(id => id !== req.user.id);
      idea.numberOfLikes = idea.likes.length;
      await idea.save();
    }
    res.status(200).json(idea);
  } catch (err) {
    next(err);
  }
};

// Add a poll to an idea (only owner)
export const addPoll = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return next(errorHandler(404, 'Idea not found.'));
    if (idea.userRef !== req.user.id) return next(errorHandler(403, 'Unauthorized.'));
    const { question, options } = req.body;
    if (!question || !options || !Array.isArray(options) || options.length < 2) {
      return next(errorHandler(400, 'Poll must have a question and at least two options.'));
    }
    idea.polls.push({ question, options });
    await idea.save();
    res.status(201).json(idea);
  } catch (err) {
    next(err);
  }
};

// Vote in a poll
export const votePoll = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.ideaId);
    if (!idea) return next(errorHandler(404, 'Idea not found.'));
    // Find poll by pollId
    const poll = idea.polls.find(p => p.pollId === req.params.pollId);
    if (!poll) return next(errorHandler(404, 'Poll not found.'));
    const { optionId } = req.body;
    // Remove previous vote by this user
    poll.options.forEach(opt => {
      opt.votes = opt.votes.filter(uid => uid !== req.user.id);
    });
    // Add vote
    const option = poll.options.find(opt => opt.optionId === optionId);
    if (!option) return next(errorHandler(404, 'Option not found.'));
    option.votes.push(req.user.id);
    await idea.save();
    res.status(200).json(idea);
  } catch (err) {
    next(err);
  }
};

// Add a comment to an idea
export const addComment = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return next(errorHandler(404, 'Idea not found.'));
    const { text } = req.body;
    if (!text) return next(errorHandler(400, 'Comment text required.'));
    const userFullName = req.user.fullName || req.user.username || 'User';
    const comment = {
      commentId: uuidv4(),
      userId: req.user.id,
      userFullName,
      text,
      likes: [],
      dislikes: [],
      replies: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    idea.comments.unshift(comment);
    await idea.save();
    res.status(201).json(idea);
  } catch (err) { next(err); }
};
// Edit a comment
export const editComment = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return next(errorHandler(404, 'Idea not found.'));
    const comment = idea.comments.find(c => c.commentId === req.params.commentId);
    if (!comment) return next(errorHandler(404, 'Comment not found.'));
    if (comment.userId !== req.user.id) return next(errorHandler(403, 'Unauthorized.'));
    comment.text = req.body.text;
    comment.updatedAt = new Date();
    await idea.save();
    res.status(200).json(idea);
  } catch (err) { next(err); }
};
// Like a comment
export const likeComment = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return next(errorHandler(404, 'Idea not found.'));
    const comment = idea.comments.find(c => c.commentId === req.params.commentId);
    if (!comment) return next(errorHandler(404, 'Comment not found.'));
    if (!comment.likes.includes(req.user.id)) comment.likes.push(req.user.id);
    comment.dislikes = comment.dislikes.filter(id => id !== req.user.id);
    await idea.save();
    res.status(200).json(idea);
  } catch (err) { next(err); }
};
// Dislike a comment
export const dislikeComment = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return next(errorHandler(404, 'Idea not found.'));
    const comment = idea.comments.find(c => c.commentId === req.params.commentId);
    if (!comment) return next(errorHandler(404, 'Comment not found.'));
    if (!comment.dislikes.includes(req.user.id)) comment.dislikes.push(req.user.id);
    comment.likes = comment.likes.filter(id => id !== req.user.id);
    await idea.save();
    res.status(200).json(idea);
  } catch (err) { next(err); }
};
// Add a reply to a comment
export const addReply = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return next(errorHandler(404, 'Idea not found.'));
    const comment = idea.comments.find(c => c.commentId === req.params.commentId);
    if (!comment) return next(errorHandler(404, 'Comment not found.'));
    const { text } = req.body;
    if (!text) return next(errorHandler(400, 'Reply text required.'));
    const userFullName = req.user.fullName || req.user.username || 'User';
    const reply = {
      replyId: uuidv4(),
      userId: req.user.id,
      userFullName,
      text,
      likes: [],
      dislikes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    comment.replies.push(reply);
    await idea.save();
    res.status(201).json(idea);
  } catch (err) { next(err); }
};
// Edit a reply
export const editReply = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return next(errorHandler(404, 'Idea not found.'));
    const comment = idea.comments.find(c => c.commentId === req.params.commentId);
    if (!comment) return next(errorHandler(404, 'Comment not found.'));
    const reply = comment.replies.find(r => r.replyId === req.params.replyId);
    if (!reply) return next(errorHandler(404, 'Reply not found.'));
    if (reply.userId !== req.user.id) return next(errorHandler(403, 'Unauthorized.'));
    reply.text = req.body.text;
    reply.updatedAt = new Date();
    await idea.save();
    res.status(200).json(idea);
  } catch (err) { next(err); }
};
// Like a reply
export const likeReply = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return next(errorHandler(404, 'Idea not found.'));
    const comment = idea.comments.find(c => c.commentId === req.params.commentId);
    if (!comment) return next(errorHandler(404, 'Comment not found.'));
    const reply = comment.replies.find(r => r.replyId === req.params.replyId);
    if (!reply) return next(errorHandler(404, 'Reply not found.'));
    if (!reply.likes.includes(req.user.id)) reply.likes.push(req.user.id);
    reply.dislikes = reply.dislikes.filter(id => id !== req.user.id);
    await idea.save();
    res.status(200).json(idea);
  } catch (err) { next(err); }
};
// Dislike a reply
export const dislikeReply = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return next(errorHandler(404, 'Idea not found.'));
    const comment = idea.comments.find(c => c.commentId === req.params.commentId);
    if (!comment) return next(errorHandler(404, 'Comment not found.'));
    const reply = comment.replies.find(r => r.replyId === req.params.replyId);
    if (!reply) return next(errorHandler(404, 'Reply not found.'));
    if (!reply.dislikes.includes(req.user.id)) reply.dislikes.push(req.user.id);
    reply.likes = reply.likes.filter(id => id !== req.user.id);
    await idea.save();
    res.status(200).json(idea);
  } catch (err) { next(err); }
};

// Delete a comment
export const deleteComment = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return next(errorHandler(404, 'Idea not found.'));
    const idx = idea.comments.findIndex(c => c.commentId === req.params.commentId);
    if (idx === -1) return next(errorHandler(404, 'Comment not found.'));
    if (idea.comments[idx].userId !== req.user.id) return next(errorHandler(403, 'Unauthorized.'));
    idea.comments.splice(idx, 1);
    await idea.save();
    res.status(200).json(idea);
  } catch (err) { next(err); }
};
// Delete a reply
export const deleteReply = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return next(errorHandler(404, 'Idea not found.'));
    const comment = idea.comments.find(c => c.commentId === req.params.commentId);
    if (!comment) return next(errorHandler(404, 'Comment not found.'));
    const idx = comment.replies.findIndex(r => r.replyId === req.params.replyId);
    if (idx === -1) return next(errorHandler(404, 'Reply not found.'));
    if (comment.replies[idx].userId !== req.user.id) return next(errorHandler(403, 'Unauthorized.'));
    comment.replies.splice(idx, 1);
    await idea.save();
    res.status(200).json(idea);
  } catch (err) { next(err); }
};

// Export a PDF report for an idea
export const exportIdeaPDF = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return next(errorHandler(404, 'Idea not found.'));

    // Create a PDF document
    const doc = new PDFDocument({ margin: 48, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=idea-report-${idea._id}.pdf`);
    doc.pipe(res);

    // Modern Header
    doc
      .rect(0, 0, doc.page.width, 60)
      .fill('#6D28D9')
      .fillColor('white')
      .fontSize(28)
      .font('Helvetica-Bold')
      .text('Validly Idea Report', 0, 20, { align: 'center', width: doc.page.width });
    doc.moveDown(2.5);
    doc.fillColor('#22223B').font('Helvetica');

    // Section Helper
    const baseIndent = 48;
    const section = (title) => {
      doc.moveDown(1.2);
      doc.fontSize(16).fillColor('#6D28D9').font('Helvetica-Bold').text(title, baseIndent, undefined, { underline: true });
      doc.moveDown(0.3);
      doc.fontSize(12).fillColor('#22223B').font('Helvetica');
    };

    // Problem
    section('Problem');
    doc.text(idea.problem || '', baseIndent, undefined, { indent: 0, lineGap: 2 });

    // Solution
    section('Solution');
    doc.text(idea.solution || '', baseIndent, undefined, { indent: 0, lineGap: 2 });

    // Stage
    section('Development Stage');
    doc.text(idea.stage || '', baseIndent, undefined, { indent: 0, lineGap: 2 });

    // Reference Link
    if (idea.link) {
      section('Reference Link');
      doc.fillColor('#2563EB').text(idea.link, baseIndent, undefined, { link: idea.link, underline: true });
      doc.fillColor('#22223B');
    }

    // Reactions
    section('Reactions');
    doc.text(`Likes: ${idea.numberOfLikes || idea.likes?.length || 0}    Dislikes: ${idea.numberOfDislikes || idea.dislikes?.length || 0}`, baseIndent);

    // Polls
    if (idea.polls && idea.polls.length > 0) {
      section('Community Polls');
      idea.polls.forEach((poll, idx) => {
        doc.font('Helvetica-Bold').fillColor('#4F46E5').fontSize(13).text(`${idx + 1}. ${poll.question}`, baseIndent + 8);
        poll.options.forEach((opt, i) => {
          doc.font('Helvetica').fillColor('#22223B').fontSize(12).text(`• ${opt.text}: ${opt.votes ? opt.votes.length : 0} votes`, baseIndent + 24);
        });
        doc.moveDown(0.3);
      });
    }

    // Comments
    if (idea.comments && idea.comments.length > 0) {
      section('Comments');
      idea.comments.forEach((comment, idx) => {
        doc.font('Helvetica-Bold').fillColor('#4F46E5').fontSize(13).text(`${idx + 1}. ${comment.text}`, baseIndent + 8);
        if (comment.replies && comment.replies.length > 0) {
          comment.replies.forEach((reply, i) => {
            doc.moveDown(0.1);
            doc.font('Helvetica').fillColor('#6366F1').fontSize(12).text(`• ${reply.text}`, baseIndent + 24);
          });
        }
        doc.moveDown(0.5);
      });
    }

    // Footer
    doc.moveDown(2);
    doc.fontSize(10).fillColor('#A1A1AA').font('Helvetica-Oblique').text('Generated by Validly', 0, doc.page.height - 50, { align: 'center', width: doc.page.width });

    doc.end();
  } catch (err) {
    next(err);
  }
};

// Cron job: Auto-delete expired ideas
export const autoDeleteExpiredIdeas = async () => {
  const now = dayjs();
  const ideas = await Idea.find({ autoDeleteAfterDays: { $exists: true, $ne: null } });
  for (const idea of ideas) {
    if (idea.autoDeleteAfterDays) {
      const created = dayjs(idea.createdAt);
      if (now.diff(created, 'day') >= idea.autoDeleteAfterDays) {
        await idea.deleteOne();
      }
    }
  }
}; 