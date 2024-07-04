const Post = require("./posts.model");
const { AppError } = require("../../middleware/errorHandler");

const createPost = async (postData, userId) => {
  const { content } = postData;

  const newPost = new Post({ content, user: userId });
  await newPost.save();

  return newPost;
};

const getAllPosts = async () => {
  const posts = await Post.find().populate("user");
  return posts;
};

const getPostById = async (postId) => {
  const post = await Post.findById(postId)
    .populate({
      path: "user",
    })
    .populate({
      path: "comments.user",
    });

  return post;
};

const getUserPosts = async (userId) => {
  const userPosts = await Post.find({ user: userId }).populate("user");
  return userPosts;
};

const likePost = async (postId, userId, liked) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError("Post not found.", 404);
  }

  if (liked) {
    // Add user to likes if not already liked
    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
      await post.save();
    }
  } else {
    // Remove user from likes if already liked
    post.likes = post.likes.filter((id) => id.toString() !== userId);
    await post.save();
  }

  return post;
};

const commentPost = async (postId, userId, content) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError("Post not found.", 404);
  }

  post.comments.push({ user: userId, content });
  await post.save();

  return post;
};

const deletePost = async (postId, userId) => {
  const post = await Post.findOneAndDelete({ _id: postId, user: userId });

  if (!post) {
    throw new AppError("Post not found or unauthorized", 404);
  }
};

const deleteComment = async (postId, commentId, userId) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const comment = post.comments.find((c) => c._id.toString() === commentId);

  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  if (
    post.user.toString() !== userId.toString() &&
    comment.user.toString() !== userId.toString()
  ) {
    throw new AppError("Unauthorized to delete this comment", 403);
  }

  post.comments = post.comments.filter((c) => c._id.toString() !== commentId);
  await post.save();
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
