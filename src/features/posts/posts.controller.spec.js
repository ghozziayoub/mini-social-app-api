const postController = require("./posts.controller");
const postService = require("./posts.service");
const { AppError } = require("../../middleware/errorHandler");

jest.mock("./posts.service");
beforeEach(() => {
  const mockReq = {
    body: {},
    user: { id: "user123" },
    params: {},
  };
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  };
  const mockNext = jest.fn();

  req = mockReq;
  res = mockRes;
  next = mockNext;
});

describe("Post Controller", () => {
  describe("Create Post", () => {
    it("should create a new post and return 201 status", async () => {
      const mockPostData = {
        content: "Test post content",
      };
      const mockNewPost = {
        _id: "post123",
        content: "Test post content",
      };

      postService.createPost.mockResolvedValue(mockNewPost);

      req.body = mockPostData;
      await postController.createPost(req, res, next);

      expect(postService.createPost).toHaveBeenCalledWith(
        mockPostData,
        req.user.id
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockNewPost);
    });

    it("should handle errors", async () => {
      const errorMessage = "Failed to create post";

      postService.createPost.mockRejectedValue(new AppError(errorMessage, 500));

      req.body = { content: "Test post content" };
      await postController.createPost(req, res, next);

      expect(postService.createPost).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0].message).toBe(errorMessage);
    });
  });
  describe("getAllPosts", () => {
    it("should get all posts and return 200 status", async () => {
      const mockPosts = [
        { _id: "post1", content: "Post 1", user: { fullName: "User 1" } },
        { _id: "post2", content: "Post 2", user: { fullName: "User 2" } },
      ];

      postService.getAllPosts.mockResolvedValue(mockPosts);

      await postController.getAllPosts(req, res, next);

      expect(postService.getAllPosts).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockPosts);
    });

    it("should handle errors", async () => {
      const errorMessage = "Failed to fetch posts";

      postService.getAllPosts.mockRejectedValue(
        new AppError(errorMessage, 500)
      );

      await postController.getAllPosts(req, res, next);

      expect(postService.getAllPosts).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0].message).toBe(errorMessage);
    });
  });
  describe("getPostById", () => {
    it("should get a post by id and return 200 status", async () => {
      const mockPostId = "post123";
      const mockPost = {
        _id: mockPostId,
        content: "Test Post",
        user: { fullName: "User" },
        createdAt: new Date(),
      };

      req.params.postId = mockPostId;
      postService.getPostById.mockResolvedValue(mockPost);

      await postController.getPostById(req, res, next);

      expect(postService.getPostById).toHaveBeenCalledWith(mockPostId);
      expect(res.json).toHaveBeenCalledWith(mockPost);
    });

    it("should handle post not found", async () => {
      const mockPostId = "post123";
      const errorMessage = "Post not found";

      req.params.postId = mockPostId;
      postService.getPostById.mockRejectedValue(
        new AppError(errorMessage, 404)
      );

      await postController.getPostById(req, res, next);

      expect(postService.getPostById).toHaveBeenCalledWith(mockPostId);
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0].message).toBe(errorMessage);
      expect(next.mock.calls[0][0].statusCode).toBe(404);
    });

    it("should handle errors", async () => {
      const mockPostId = "post123";
      const errorMessage = "Failed to fetch post";

      req.params.postId = mockPostId;
      postService.getPostById.mockRejectedValue(
        new AppError(errorMessage, 500)
      );

      await postController.getPostById(req, res, next);

      expect(postService.getPostById).toHaveBeenCalledWith(mockPostId);
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0].message).toBe(errorMessage);
      expect(next.mock.calls[0][0].statusCode).toBe(500);
    });
  });

  describe("getUserPosts", () => {
    it("should get user posts and return 200 status", async () => {
      const mockUserId = "user123";
      const mockUserPosts = [
        { _id: "1", content: "User Post 1", user: { fullName: "User" } },
        { _id: "2", content: "User Post 2", user: { fullName: "User" } },
      ];

      req.user = { id: mockUserId };
      postService.getUserPosts.mockResolvedValue(mockUserPosts);

      await postController.getUserPosts(req, res, next);

      expect(postService.getUserPosts).toHaveBeenCalledWith(mockUserId);
      expect(res.json).toHaveBeenCalledWith(mockUserPosts);
    });

    it("should handle errors and call next with AppError", async () => {
      const mockUserId = "user123";
      const errorMessage = "Failed to fetch user posts";

      req.user = { id: mockUserId };
      postService.getUserPosts.mockRejectedValue(
        new AppError(errorMessage, 500)
      );

      await postController.getUserPosts(req, res, next);

      expect(postService.getUserPosts).toHaveBeenCalledWith(mockUserId);
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
    });
  });

  describe("likePost", () => {
    it("should like a post and return updated post", async () => {
      const mockPostId = "post123";
      const mockUserId = "user123";
      const mockLiked = true;
      const mockUpdatedPost = {
        _id: mockPostId,
        content: "Updated Post",
        likes: [mockUserId],
      };

      req.params.postId = mockPostId;
      req.user = { id: mockUserId };
      req.body.liked = mockLiked;
      postService.likePost.mockResolvedValue(mockUpdatedPost);

      await postController.likePost(req, res, next);

      expect(postService.likePost).toHaveBeenCalledWith(
        mockPostId,
        mockUserId,
        mockLiked
      );
      expect(res.json).toHaveBeenCalledWith(mockUpdatedPost);
    });

    it("should handle errors and call next with AppError", async () => {
      const mockPostId = "post123";
      const mockUserId = "user123";
      const mockLiked = true;
      const errorMessage = "Failed to like post";

      req.params.postId = mockPostId;
      req.user = { id: mockUserId };
      req.body.liked = mockLiked;
      postService.likePost.mockRejectedValue(new AppError(errorMessage, 500));

      await postController.likePost(req, res, next);

      expect(postService.likePost).toHaveBeenCalledWith(
        mockPostId,
        mockUserId,
        mockLiked
      );
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0].message).toBe(errorMessage);
      expect(next.mock.calls[0][0].statusCode).toBe(500);
    });
  });

  describe("commentPost", () => {
    it("should comment on a post and return updated post", async () => {
      const mockPostId = "post123";
      const mockUserId = "user123";
      const mockContent = "New comment";
      const mockUpdatedPost = {
        _id: mockPostId,
        content: "Updated Post",
        comments: [{ user: mockUserId, content: mockContent }],
      };

      req.params.postId = mockPostId;
      req.user = { id: mockUserId };
      req.body.content = mockContent;
      postService.commentPost.mockResolvedValue(mockUpdatedPost);

      await postController.commentPost(req, res, next);

      expect(postService.commentPost).toHaveBeenCalledWith(
        mockPostId,
        mockUserId,
        mockContent
      );
      expect(res.json).toHaveBeenCalledWith(mockUpdatedPost);
    });

    it("should handle errors and call next with AppError", async () => {
      const mockPostId = "post123";
      const mockUserId = "user123";
      const mockContent = "New comment";
      const errorMessage = "Failed to comment on post";

      req.params.postId = mockPostId;
      req.user = { id: mockUserId };
      req.body.content = mockContent;
      postService.commentPost.mockRejectedValue(
        new AppError(errorMessage, 500)
      );

      await postController.commentPost(req, res, next);

      expect(postService.commentPost).toHaveBeenCalledWith(
        mockPostId,
        mockUserId,
        mockContent
      );
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0].message).toBe(errorMessage);
      expect(next.mock.calls[0][0].statusCode).toBe(500);
    });
  });

  describe("Delete Post", () => {
    it("should delete a post and return 204 status", async () => {
      const mockPostId = "post123";

      postService.deletePost.mockResolvedValue();

      req.params = { postId: mockPostId };
      req.user = { _id: "user123" };
      await postController.deletePost(req, res, next);

      expect(postService.deletePost).toHaveBeenCalledWith(
        mockPostId,
        req.user._id
      );
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("should handle errors during post deletion", async () => {
      const mockPostId = "post123";
      const errorMessage = "Post not found";

      postService.deletePost.mockRejectedValue(new AppError(errorMessage, 404));

      req.params = { postId: mockPostId };
      req.user = { _id: "user123" };
      await postController.deletePost(req, res, next);

      expect(postService.deletePost).toHaveBeenCalledWith(
        mockPostId,
        req.user._id
      );
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
    });
  });

  describe("deleteComment", () => {
    it("should delete a comment and return 204 status", async () => {
      const mockPostId = "post123";
      const mockCommentId = "comment123";
      const mockUserId = "user123";

      const mockPost = {
        comments: [
          { _id: mockCommentId, user: mockUserId }, // Simulate comment existence
        ],
      };

      // Mock implementation for postService.deleteComment (successful deletion)
      postService.deleteComment.mockResolvedValue(mockPost);

      const req = {
        params: { postId: mockPostId, commentId: mockCommentId },
        user: { _id: mockUserId },
      };

      await postController.deleteComment(req, res, next);

      expect(postService.deleteComment).toHaveBeenCalledWith(
        mockPostId,
        mockCommentId,
        mockUserId
      );
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it("should handle errors and call next with AppError", async () => {
      const mockPostId = "post123";
      const mockCommentId = "comment123";
      const mockUserId = "user123";
      const errorMessage = "Failed to delete comment";

      req.params.postId = mockPostId;
      req.params.commentId = mockCommentId;
      req.user = { id: mockUserId };
      postService.deleteComment.mockRejectedValue(
        new AppError(errorMessage, 500)
      );

      await postController.deleteComment(req, res, next);

      expect(postService.deleteComment).toHaveBeenCalledWith(
        mockPostId,
        mockCommentId,
        mockUserId
      );
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0].message).toBe(errorMessage);
      expect(next.mock.calls[0][0].statusCode).toBe(500);
    });
  });
});
