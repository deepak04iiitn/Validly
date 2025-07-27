import Promote from "../models/promote.model.js";
import { errorHandler } from "../utils/error.js";

export const createPromotePost = async(req , res , next) => {
    try {
        const {title , description , link} = req.body;

        if(!title || !description || !link || title === '' || description === '' || link === '')
        {
            return next(errorHandler(400 , 'All fields are required!'));
        }

        const newPromotePost = new Promote({
            title,
            description,
            link,
            user: req.user.id,
        });

        await newPromotePost.save();

        res.status(201).json(newPromotePost);

    } catch (error) {
        next(error);
    }
}


export const getAllPromotePosts = async(req , res , next) => {
    try {
        const posts = await Promote.find().sort({ createdAt: -1});
        res.status(200).json(posts);
    } catch (error) {
        next(error);
    }
}


export const likePromote = async (req, res, next) => {
    try {
      const post = await Promote.findById(req.params.id);

      if(!post) return next(errorHandler(404, 'Post not found.'));

      if(!post.likes.includes(req.user.id)) {

        post.likes.push(req.user.id);
        post.numberOfLikes = post.likes.length;

        // Remove dislike if present
        post.dislikes = post.dislikes.filter(id => id !== req.user.id);
        post.numberOfDislikes = post.dislikes.length;

        await post.save();
      }
      res.status(200).json(post);
    } catch(err) {
      next(err);
    }
  };
  

  // Dislike an idea
  export const dislikePromote = async (req, res, next) => {
    try {
      const post = await Promote.findById(req.params.id);

      if(!post) return next(errorHandler(404, 'Post not found.'));

      if(!post.dislikes.includes(req.user.id)) {

        post.dislikes.push(req.user.id);
        post.numberOfDislikes = post.dislikes.length;

        // Remove like if present
        post.likes = post.likes.filter(id => id !== req.user.id);
        post.numberOfLikes = post.likes.length;

        await post.save();
      }
      res.status(200).json(post);
    } catch (err) {
      next(err);
    }
  };


export const getUserPromotions = async (req, res, next) => {
    try {
      const posts = await Promote.find({ user: req.user.id }).sort({ createdAt: -1 });
      res.status(200).json(posts);
    } catch (err) {
      next(err);
    }
};


export const updatePromotion = async (req, res, next) => {
    try {
      const post = await Promote.findById(req.params.id);

      if(!post) return next(errorHandler(404, 'Post not found.'));

      if(post.user.toString() !== req.user.id) return next(errorHandler(403, 'Unauthorized.'));

      const { title, description, link } = req.body;

      if(title !== undefined) post.title = title;
      if(description !== undefined) post.description = description;
      if(link !== undefined) post.link = link;
      
      post.updatedAt = Date.now();

      await post.save();

      res.status(200).json(post);

    } catch (err) {
      next(err);
    }
  };
  
  
  export const deletePromotion = async (req, res, next) => {
    try {
      const post = await Promote.findById(req.params.id);

      if(!post) return next(errorHandler(404, 'Post not found.'));

      if(post.user.toString() !== req.user.id) return next(errorHandler(403, 'Unauthorized.'));

      await post.deleteOne();

      res.status(200).json({ message: 'Post deleted.' });

    } catch (err) {
      next(err);
    }
  };