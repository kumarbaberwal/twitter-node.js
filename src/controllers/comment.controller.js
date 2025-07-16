import asyncHandler from 'express-async-handler';
import Comment from '../models/comment.model.js';
import { getAuth } from '@clerk/express';
import User from '../models/user.model.js';
import Post from '../models/post.model.js';
import Notification from '../models/notification.model.js';
import mongoose from 'mongoose';

export const getComments = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
        .sort({ createdAt: -1 })
        .populate("user", "userName firstName lastName profilePicture")

    res.status(200).json({ comments })
})


export const createComment = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req)
    const { postId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === "") {
        return res.status(400).json({
            error: "Comment content is required"
        })
    }

    const user = await User.findOne({ clerkId: userId })
    const post = await Post.findById(postId)

    if (!user || !post) {
        return res.status(404).json({
            error: "User or post not found"
        })
    }

    const session = await mongoose.startSession();
    let newComment;

    try {
        await session.withTransaction(async () => {
            [newComment] = await Comment.create([{
                user: user._id,
                post: postId,
                content,

            }], { session })

            // Link the comment to the post

            await Post.findByIdAndUpdate(postId, {
                $push: { comments: newComment._id }
            }, { session })
        });
    } catch (error) {
        console.error("Transaction failed:", error);
        throw error; // or handle appropriately
    } finally {
        await session.endSession();
    }


    // Create notification if not commenting on own post
    if (post.user.toString() !== user._id.toString()) {
        await Notification.create({
            from: user._id,
            to: post.user,
            type: "comment",
            post: post._id,
            comment: newComment._id,
        });
    }

    res.status(201).json({
        newComment
    })
})


export const deleteComment = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { commentId } = req.params;

    const user = await User.findOne({ clerkId: userId });
    const comment = await Comment.findById(commentId);

    if (!user || !comment) {
        return res.status(404).json({
            error: "User or comment not found",
        });
    }

    if (user._id.toString() !== comment.user.toString()) {
        return res.status(400).json({
            error: "You can only delete your own comments",
        });
    }

    // remove comment from post
    await Post.findByIdAndDelete(comment.post, {
        $pull: { comments: commentId }
    })

    // delete the comment
    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({
        message: "Comment deleted successfully",
    })
})