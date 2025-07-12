import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ideas: [],
  userIdeas: [],
  loading: false,
  error: null,
};

const ideaSlice = createSlice({
  name: 'ideas',
  initialState,
  reducers: {
    fetchIdeasStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchIdeasSuccess: (state, action) => {
      state.ideas = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchIdeasFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchUserIdeasSuccess: (state, action) => {
      state.userIdeas = action.payload;
      state.loading = false;
      state.error = null;
    },
    addIdeaSuccess: (state, action) => {
      state.ideas.unshift(action.payload);
      state.userIdeas.unshift(action.payload);
      state.loading = false;
      state.error = null;
    },
    updateIdeaSuccess: (state, action) => {
      state.ideas = state.ideas.map(idea => idea._id === action.payload._id ? action.payload : idea);
      state.userIdeas = state.userIdeas.map(idea => idea._id === action.payload._id ? action.payload : idea);
      state.loading = false;
      state.error = null;
    },
    deleteIdeaSuccess: (state, action) => {
      state.ideas = state.ideas.filter(idea => idea._id !== action.payload);
      state.userIdeas = state.userIdeas.filter(idea => idea._id !== action.payload);
      state.loading = false;
      state.error = null;
    },
    addCommentSuccess: (state, action) => {
      // Replace the updated idea in both lists
      state.ideas = state.ideas.map(idea => idea._id === action.payload._id ? action.payload : idea);
      state.userIdeas = state.userIdeas.map(idea => idea._id === action.payload._id ? action.payload : idea);
      state.loading = false;
      state.error = null;
    },
    editCommentSuccess: (state, action) => {
      state.ideas = state.ideas.map(idea => idea._id === action.payload._id ? action.payload : idea);
      state.userIdeas = state.userIdeas.map(idea => idea._id === action.payload._id ? action.payload : idea);
      state.loading = false;
      state.error = null;
    },
    likeCommentSuccess: (state, action) => {
      state.ideas = state.ideas.map(idea => idea._id === action.payload._id ? action.payload : idea);
      state.userIdeas = state.userIdeas.map(idea => idea._id === action.payload._id ? action.payload : idea);
      state.loading = false;
      state.error = null;
    },
    dislikeCommentSuccess: (state, action) => {
      state.ideas = state.ideas.map(idea => idea._id === action.payload._id ? action.payload : idea);
      state.userIdeas = state.userIdeas.map(idea => idea._id === action.payload._id ? action.payload : idea);
      state.loading = false;
      state.error = null;
    },
    addReplySuccess: (state, action) => {
      state.ideas = state.ideas.map(idea => idea._id === action.payload._id ? action.payload : idea);
      state.userIdeas = state.userIdeas.map(idea => idea._id === action.payload._id ? action.payload : idea);
      state.loading = false;
      state.error = null;
    },
    editReplySuccess: (state, action) => {
      state.ideas = state.ideas.map(idea => idea._id === action.payload._id ? action.payload : idea);
      state.userIdeas = state.userIdeas.map(idea => idea._id === action.payload._id ? action.payload : idea);
      state.loading = false;
      state.error = null;
    },
    likeReplySuccess: (state, action) => {
      state.ideas = state.ideas.map(idea => idea._id === action.payload._id ? action.payload : idea);
      state.userIdeas = state.userIdeas.map(idea => idea._id === action.payload._id ? action.payload : idea);
      state.loading = false;
      state.error = null;
    },
    dislikeReplySuccess: (state, action) => {
      state.ideas = state.ideas.map(idea => idea._id === action.payload._id ? action.payload : idea);
      state.userIdeas = state.userIdeas.map(idea => idea._id === action.payload._id ? action.payload : idea);
      state.loading = false;
      state.error = null;
    },
    deleteCommentSuccess: (state, action) => {
      state.ideas = state.ideas.map(idea => idea._id === action.payload._id ? action.payload : idea);
      state.userIdeas = state.userIdeas.map(idea => idea._id === action.payload._id ? action.payload : idea);
      state.loading = false;
      state.error = null;
    },
    deleteReplySuccess: (state, action) => {
      state.ideas = state.ideas.map(idea => idea._id === action.payload._id ? action.payload : idea);
      state.userIdeas = state.userIdeas.map(idea => idea._id === action.payload._id ? action.payload : idea);
      state.loading = false;
      state.error = null;
    },
    ideaActionFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchIdeasStart,
  fetchIdeasSuccess,
  fetchIdeasFailure,
  fetchUserIdeasSuccess,
  addIdeaSuccess,
  updateIdeaSuccess,
  deleteIdeaSuccess,
  addCommentSuccess,
  editCommentSuccess,
  likeCommentSuccess,
  dislikeCommentSuccess,
  addReplySuccess,
  editReplySuccess,
  likeReplySuccess,
  dislikeReplySuccess,
  deleteCommentSuccess,
  deleteReplySuccess,
  ideaActionFailure,
} = ideaSlice.actions;

export default ideaSlice.reducer; 