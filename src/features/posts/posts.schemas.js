const { isValidObjectId } = require("mongoose");
const { z } = require("zod");

const postSchema = z.object({
  body: z.object({
    content: z
      .string()
      .min(1, { message: "Content must be at least 1 character long." })
      .max(280, { message: "Content cannot exceed 280 characters." }),
  }),
});

const postCommentSchema = z.object({
  body: z.object({
    content: z
      .string()
      .min(1, { message: "Comment must be at least 1 character long." })
      .max(280, { message: "Comment cannot exceed 280 characters." }),
  }),
  params: z.object({
    postId: z.string().refine((value) => isValidObjectId(value)),
  }),
});

const postLikeSchema = z.object({
  body: z.object({
    liked: z.boolean(),
  }),
  params: z.object({
    postId: z.string().refine((value) => isValidObjectId(value)),
  }),
});

const postIdSchema = z.object({
  params: z.object({
    postId: z.string().refine((value) => isValidObjectId(value)),
  }),
});

const postDeleteCommentSchema = z.object({
  params: z.object({
    postId: z.string().refine((value) => isValidObjectId(value)),
    commentId: z.string().refine((value) => isValidObjectId(value)),
  }),
});

module.exports = {
  postSchema,
  postCommentSchema,
  postLikeSchema,
  postIdSchema,
  postDeleteCommentSchema,
};
