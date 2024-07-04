const express = require("express");
const router = express.Router();
const postController = require("./posts.controller");
const { validate } = require("../../middleware/schemaValidation");
const { authenticateUser } = require("../../middleware/auth");
const {
  postSchema,
  postCommentSchema,
  postLikeSchema,
  postIdSchema,
  postDeleteCommentSchema,
} = require("./posts.schemas");

router.post(
  "/",
  authenticateUser,
  validate(postSchema),
  postController.createPost
);

router.get("/", authenticateUser, postController.getAllPosts);

router.get("/me", authenticateUser, postController.getUserPosts);

router.get(
  "/:postId",
  authenticateUser,
  validate(postIdSchema),
  postController.getPostById
);

router.post(
  "/:postId/likes",
  authenticateUser,
  validate(postLikeSchema),
  postController.likePost
);

router.post(
  "/:postId/comments",
  authenticateUser,
  validate(postCommentSchema),
  postController.commentPost
);

router.delete(
  "/:postId",
  authenticateUser,
  validate(postIdSchema),
  postController.deletePost
);

router.delete(
  "/:postId/comments/:commentId",
  authenticateUser,
  validate(postDeleteCommentSchema),
  postController.deleteComment
);

module.exports = router;
