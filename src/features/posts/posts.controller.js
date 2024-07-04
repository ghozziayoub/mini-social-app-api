const postService = require("./posts.service");

const createPost = async (req, res, next) => {
  const { content } = req.body;
  const userId = req.user.id;

  try {
    const newPost = await postService.createPost({ content }, userId);
    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};

const getAllPosts = async (_req, res, next) => {
  try {
    const posts = await postService.getAllPosts();
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await postService.getPostById(postId);
    if (!post) {
      throw new AppError("Post not found.", 404);
    }
    res.json(post);
  } catch (error) {
    next(error);
  }
};

const getUserPosts = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const userPosts = await postService.getUserPosts(userId);
    res.json(userPosts);
  } catch (error) {
    next(error);
  }
};

const likePost = async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user.id;
  const { liked } = req.body;

  try {
    const post = await postService.likePost(postId, userId, liked);
    res.json(post);
  } catch (error) {
    next(error);
  }
};

const commentPost = async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user.id;
  const { content } = req.body;

  try {
    const post = await postService.commentPost(postId, userId, content);
    res.json(post);
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;
    await postService.deletePost(postId, userId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const userId = req.user._id;
    await postService.deleteComment(postId, commentId, userId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  getUserPosts,
  likePost,
  commentPost,
  deletePost,
  deleteComment,
};
