import ErrorHandler from "../utils/errorHandler.js"; // Import custom error handler
import User from "../models/profileModel/userModel.js"; // Import User model
import Post from "../models/profileModel/postModel.js"; // Import Post model
import Comment from "../models/profileModel/commentModel.js"; // Import Comment model
import fs from "fs"; // Import file system module
import cloudinary from "../config/cloudinary.js"; // Import Cloudinary configuration
import mongoose from "mongoose"; // Import mongoose for ObjectId
import { optimizeImage, uploadFileToCloudinary } from "../utils/postUplodUtils.js"; // Import image upload utilities

// CREATE POST
export const createPost = async (req, res, next) => {

    // Extract user ID from request
    const { id } = req.user;

    // access files from request
    const files = req.files || [];

    // Extract caption, location, tags from request body
    const caption = req.body.caption?.trim() || "";
    const location = req.body.location?.trim() || "";

    // Parse & convert tags string to array of ObjectIds
    let tags = [];
    if (req.body.tags) {
        const parsed = JSON.parse(req.body.tags);
        tags = parsed.map((id) => new mongoose.Types.ObjectId(id));
    }

    // to keep track of uploaded files for cleanup in case of error
    let uploadResults = []

    // to keep track of optimize files for cleanup in case of error
    let optimizedPaths = [];

    // folder name on Cloudinary
    const folderName = "RIVIO_posts";

    try {

        // Find user by ID and exclude password from the result
        const user = await User.findById(id).select("-password");
        if (!user) return next(new ErrorHandler("User not found", 404));

        // Check if files are uploaded
        if (!files || files.length === 0) return next(new ErrorHandler("No files uploaded", 400));

        // Optimize all images concurrently using potimizeImage utility
        optimizedPaths = await Promise.all(files.map(f => optimizeImage(f.path)));

        // Upload each file to Cloudinary by uploadFileToCloudinary helper
        uploadResults = await Promise.all(files.map((file, index) =>
            uploadFileToCloudinary(file.path, file.mimetype, optimizedPaths[index], folderName,)
        ));

        // Build media array for post
        const media = uploadResults.map((r) => ({
            mediaType: r.mediaType,
            url: r.url,
            cloudinaryPublicId: r.public_id || r.publicId || r.public_id,
        }));

        // Create new post document
        const post = new Post({
            caption,
            user: user._id,
            media,
            tags,
            location: location || undefined
        });

        // save post to database
        const postResult = await post.save();

        // Add post reference to user's posts array
        user.posts.push(postResult._id);

        // Save updated user document
        await user.save();

        // Clean up temporary files (both original and optimized)              
        await Promise.allSettled([
            // temp original files delete
            ...files.map(f => fs.promises.unlink(f.path)
                .catch(err => console.warn("Original delete fail:", f.path, err.message))
            ),

            // temp optimized files delete
            ...optimizedPaths.map(p => fs.promises.unlink(p)
                .catch(err => console.warn("Optimized delete fail:", p, err.message))
            )
        ]);

        // prepare data for response -------------

        // populating post for user data
        const populatedPost = await Post.findById(postResult._id).populate({
            path: "user",
            select: "username fullName profileImage isVerified isPrivate",
        });

        // formated response object
        const formattedPost = {
            ...populatedPost.toObject(),

            // counts
            likesCount: 0,
            commentsCount: 0,
            sharesCount: 0,

            // flags
            isOwnPost: true,
            isFollowing: false,
            isLiked: false,
            isBookmarked: false,

            bookmarkLoading: false,
            bookmarkStatus: null,
        };

        // send success response
        res.status(201).json({
            success: true,
            formattedPost,
        });

    } catch (error) {

        console.error("Post creation failed:", error);

        // cleanup original temp files
        await Promise.all(files.map((f) => fs.promises.unlink(f.path).catch(() => { })));

        // cleanup optimized files (optional)
        await Promise.all((optimizedPaths || []).map(p => fs.promises.unlink(p).catch(() => { })));

        // cleanup cloudinary uploads if any succeeded
        if (uploadResults.length > 0) {
            await Promise.all(
                uploadResults.map((r) =>
                    cloudinary.uploader.destroy(r.public_id || r.publicId).catch(() => { })
                )
            );
        }

        return next(new ErrorHandler(error.message || "Server Error", 500));
    }

};

// GET ALL POSTS
export const getAllPosts = async (req, res, next) => {

    // Extract user ID from request
    const userId = req.user.id;

    // extract cursor from req send from frontend
    const { cursor } = req.query;

    // Find user by ID and exclude password from the result
    const currentUser = await User.findById(userId).select("followers following bookmarks");
    if (!currentUser) return next(new ErrorHandler("User not found", 404));

    // array of allowed users id's
    const allowedUserIds = [
        userId,
        ...(currentUser.following || []),
        ...(currentUser.followers || [])
    ];

    // cursor condition
    const cursorCondition = cursor ? { createdAt: { $lt: new Date(cursor) } } : {};

    // Post Limit
    const postLimit = 10;

    // getting all post from db
    const posts = await Post.find(cursorCondition)
        .sort({ createdAt: -1 })
        .limit(postLimit)
        .populate({
            path: "user",
            select: "username fullName profileImage email isVerified isPrivate followers following posts bookmarks",
            match: {
                $or: [
                    { isPrivate: false },
                    { _id: { $in: allowedUserIds } }
                ]
            }
        });

    // filter: public OR allowed
    const visiblePosts = posts.filter(post => post.user);

    // posts array with isFollwing (current user followin owner of post) flag.
    const postsWithExtraData = visiblePosts.map(post => {

        // post user id
        const postUserId = post.user._id.toString();

        // current user id
        const currentUserId = userId.toString();

        // own post check
        const isOwnPost = postUserId === currentUserId;

        // follow check (only if not own post)
        const isFollowing = isOwnPost ? false : currentUser.following?.some(id => id.toString() === postUserId);

        // like check 
        const isLiked = post.likes?.some(id => id.toString() === currentUserId);

        // bookmark check
        const isBookmarked = currentUser.bookmarks?.some(id => id.toString() === post._id.toString());

        // destructure user for optimized response (avoid sending unnecessary data)
        const user = post.user;

        // optimized user object for response
        const optimizedUser = {
            id: user._id,
            username: user.username,
            fullName: user.fullName,
            profileImage: user.profileImage || null,
            isVerified: user.isVerified,
            isPrivate: user.isPrivate,

            followersCount: user.followers?.length || 0,
            followingCount: user.following?.length || 0,
            postsCount: user.posts?.length || 0,
            bookmarksCount: user.bookmarks?.length || 0,
        };

        // return result
        return {
            ...post.toObject(),   // mongoose doc → plain object
            user: optimizedUser, // populated and optimized user object
            isOwnPost, // is own post flag
            isFollowing, // is current user following
            isLiked, // is liked flag
            isBookmarked, // is post is bookmarked or not
            bookmarkLoading: false, // UI loading (per post)
            bookmarkStatus: null, // "saved" | "unsaved" (for message)
        };

    });

    // next cursor (last post)
    const nextCursor = visiblePosts.length > 0 ? visiblePosts[visiblePosts.length - 1].createdAt : null;

    // hasMore flag to show DB has more posts or not
    const hasMore = visiblePosts.length === postLimit;

    // send response
    return res.status(200).json({
        success: true,
        count: visiblePosts.length,
        nextCursor,
        posts: postsWithExtraData,
        hasMore,
    });

};

// GER MY POSTS
export const getMyPosts = async (req, res, next) => {

    // extract user id 
    const userId = req.user.id;

    // ensure user exists
    const user = await User.findById(userId).select("_id");
    if (!user) return next(new ErrorHandler("User not found", 404));

    // fetch user's posts, newest first, populate basic user info and comment authors
    const posts = await Post.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate("user", "username fullName profileImage isVerified isPrivate")
        .populate({
            path: "comments",
            populate: { path: "user", select: "username profileImage" }
        });

    // console.log(posts[0]._doc);

    // return response
    return res.status(200).json({
        success: true,
        count: posts.length,
        posts,
    });

};

// LIKE POST
export const likePost = async (req, res, next) => {

    // Extract user ID from request
    const userId = req.user.id;

    // extract post id from params
    const postId = req.params.targetPostId;

    // find user
    const user = await User.findById(userId).select("-password");
    if (!user) return next(new ErrorHandler("User not found", 404));

    // find post 
    const post = await Post.findById(postId);
    if (!post) return next(new ErrorHandler("Post not found", 404));

    // check if user already liked the post
    const alreadyLiked = post.likes.some(likeId => likeId.equals(userId));

    let message;

    if (alreadyLiked) {

        // unlike, remove user id from likes
        post.likes.pull(userId); // mongoose array pull
        post.likesCount -= 1; // update likes count
        message = "unlike";

    } else {

        // like, add user id to likes
        post.likes.push(userId);
        post.likesCount += 1; //update likes count
        message = "like";

    }

    // save the post
    await post.save();

    return res.status(200).json({
        success: true,
        message,
        postId,
        liked: !alreadyLiked,
        likesCount: post.likes.length,
    });

}

// COMMENT ON POST
export const commentOnPost = async (req, res, next) => {

    // Extract user ID from request
    const userId = req.user.id;

    // Extract post ID from params
    const postId = req.params.targetPostId;

    // Extract comment text from body
    const { text } = req.body;

    // Validate comment text
    if (!text || text.trim().length === 0) {
        return next(new ErrorHandler("Comment text cannot be empty", 400));
    }

    // Find user
    const user = await User.findById(userId).select("username fullName profileImage email isVerified isPrivate followers following posts bookmarks");
    if (!user) return next(new ErrorHandler("User not found", 404));

    // Find post
    const post = await Post.findById(postId);
    if (!post) return next(new ErrorHandler("Post not found", 404));

    // Create new comment
    const comment = new Comment({
        post: postId,
        user: userId,
        text: text.trim(),
    });

    // Save comment to database
    const savedComment = await comment.save();

    // Add comment reference to post's comments array
    post.comments.push(savedComment._id);
    post.commentsCount += 1;
    await post.save();

    // optimize user data for response (avoid sending unnecessary data)
    const optimizedUser = {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        profileImage: user.profileImage || null,
        isVerified: user.isVerified,
        isPrivate: user.isPrivate,

        followersCount: user.followers?.length || 0,
        followingCount: user.following?.length || 0,
        postsCount: user.posts?.length || 0,
        bookmarksCount: user.bookmarks?.length || 0,
    };

    // comment data to send in response (optimized)
    const optimizedCommmentData = {
        _id: savedComment._id, // comment id
        post: postId, // post id
        text: savedComment.text, // comment text
        user: optimizedUser, // comment user (optimized)
        likesCount: 0, // new comment
        repliesCount: 0, // new comment
        replies: [], // empty but structure maintained
        createdAt: savedComment.createdAt, // timestamp of comment
        updatedAt: savedComment.updatedAt  // timestamp of comment
    };

    // Send success response
    return res.status(201).json({
        success: true,
        message: "Comment added successfully",
        comment: optimizedCommmentData
    });

};

// GET COMMENTS OF POST
export const getCommentsForPost = async (req, res, next) => {

    // get postid
    const postId = req.params.postId;

    // validate post exists (optional but useful)
    const post = await Post.findById(postId).select("_id");
    if (!post) return next(new ErrorHandler("Post not found", 404));

    // find the comment and populate user and replies' user data, sort by newest first
    const comments = await Comment.find({ post: postId })
        .sort({ createdAt: -1 })
        .populate("user", "username fullName profileImage email isVerified isPrivate followers following posts bookmarks")
        .populate({
            path: "replies.repliedBy",
            select: "username fullName profileImage email isVerified isPrivate followers following posts bookmarks"
        })
        .populate({
            path: "replies.repliedTo",
            select: "username fullName profileImage email isVerified isPrivate followers following posts bookmarks"
        });

    // map to a lighter payload: include counts and populated user objects
    const mapped = comments.map((c) => {

        // optimize user data for main comment user 
        const optimizedUser = c.user ? {
            id: c.user._id,
            username: c.user.username,
            fullName: c.user.fullName,
            profileImage: c.user.profileImage || null,
            isVerified: c.user.isVerified,
            isPrivate: c.user.isPrivate,

            followersCount: c.user.followers?.length || 0,
            followingCount: c.user.following?.length || 0,
            postsCount: c.user.posts?.length || 0,
            bookmarksCount: c.user.bookmarks?.length || 0,
        } : null;

        return {

            _id: c._id, // comment id
            post: c.post, // post id
            text: c.text, // comment text
            user: optimizedUser, // comment user (optimized)
            likesCount: Array.isArray(c.likes) ? c.likes.length : 0, // likes count of main comment
            repliesCount: Array.isArray(c.replies) ? c.replies.length : 0, // replies count

            replies: (c.replies || []).map(r => {

                // optimize user data for reply's repliedBy user
                const repliedBy = r.repliedBy ? {
                    id: r.repliedBy._id,
                    username: r.repliedBy.username,
                    fullName: r.repliedBy.fullName,
                    email: r.repliedBy?.email || null,
                    profileImage: r.repliedBy.profileImage || null,
                    isVerified: r.repliedBy.isVerified,
                    isPrivate: r.repliedBy.isPrivate,

                    followersCount: r.repliedBy.followers?.length || 0,
                    followingCount: r.repliedBy.following?.length || 0,
                    postsCount: r.repliedBy.posts?.length || 0,
                    bookmarksCount: r.repliedBy.bookmarks?.length || 0,
                } : null;

                // optimize user data for reply's repliedTo user
                const repliedTo = r.repliedTo ? {
                    id: r.repliedTo._id,
                    username: r.repliedTo.username,
                    fullName: r.repliedTo.fullName,
                    email: r.repliedTo?.email || null,
                    profileImage: r.repliedTo.profileImage || null,
                    isVerified: r.repliedTo.isVerified,
                    isPrivate: r.repliedTo.isPrivate,

                    followersCount: r.repliedTo.followers?.length || 0,
                    followingCount: r.repliedTo.following?.length || 0,
                    postsCount: r.repliedTo.posts?.length || 0,
                    bookmarksCount: r.repliedTo.bookmarks?.length || 0,
                } : null;

                return {
                    _id: r._id, // reply id
                    repliedBy: repliedBy,
                    repliedTo: repliedTo,
                    text: r.text, // reply text
                    likesCount: Array.isArray(r.likes) ? r.likes.length : 0, // likes count of reply
                    createdAt: r.createdAt // timestamp of reply
                };
            }),

            createdAt: c.createdAt, // timestamp of main comment
            updatedAt: c.updatedAt // timestamp of main comment
        };
    });

    // return response
    return res.status(200).json({
        success: true,
        postId,
        count: mapped.length,
        comments: mapped
    });

}

// REPLAY ON COMMENT
export const replyOnComment = async (req, res, next) => {

    // Extract user ID from request
    const userId = req.user.id;

    // parent comment
    const commentId = req.params.commentId;

    // replayed to whom and replay text
    const { repliedTo, text } = req.body;

    // Validate user - repliedBy
    const user = await User.findById(userId).select("_id username profileImage");
    if (!user) return next(new ErrorHandler("User not found", 404));

    // Validate user - repliedTo
    const repliedToUser = await User.findById(repliedTo).select("_id username profileImage");
    if (!repliedToUser) return next(new ErrorHandler("The user you're replying to does not exist", 404));

    // Validate reply text
    if (!text || text.trim().length === 0) {
        return next(new ErrorHandler("Reply text cannot be empty", 400));
    }

    // Validate comment
    const comment = await Comment.findById(commentId);
    if (!comment) return next(new ErrorHandler("Comment not found", 404));

    // create reply
    const reply = {
        repliedBy: userId,
        repliedTo: repliedTo,
        text: text.trim(),
        createdAt: Date.now()
    };

    // Push reply inside the comment
    comment.replies.push(reply);
    await comment.save();

    // Get the newly added reply (last element)
    const newReply = comment.replies[comment.replies.length - 1];

    // Populate repliedBy & repliedTo fields
    await comment.populate([
        { path: "replies.repliedBy", select: "username profileImage" },
        { path: "replies.repliedTo", select: "username profileImage" }
    ]);

    // getting populed replay
    const populatedReply = comment.replies.id(newReply._id); // get the fully populated reply

    // Success response
    return res.status(201).json({
        success: true,
        message: "Reply added successfully",
        reply: populatedReply
    });

};

// LIKE COMMENT AND REPLY
export const likeCommentAndReplay = async (req, res, next) => {

    // getting user id
    const userId = req.user.id;

    // replyId optional
    const { commentId, replyId } = req.params;

    // liking the replay on a comments
    if (replyId) {

        // load only that reply (min fields)
        const comment = await Comment.findOne({ _id: commentId, "replies._id": replyId })
            .select("replies._id replies.likes");

        if (!comment) return next(new ErrorHandler("Comment or reply not found", 404));

        const reply = comment.replies.id(replyId);
        const alreadyLiked = reply.likes.some(l => l.toString() === userId);

        if (alreadyLiked) {
            // unlike: pull userId from replies.$.likes
            await Comment.updateOne(
                { _id: commentId, "replies._id": replyId },
                { $pull: { "replies.$.likes": userId } }
            );
        } else {
            // like: addToSet userId into replies.$.likes
            await Comment.updateOne(
                { _id: commentId, "replies._id": replyId },
                { $addToSet: { "replies.$.likes": userId } }
            );
        }

        // fetch fresh like count for that reply
        const fresh = await Comment.findOne({ _id: commentId, "replies._id": replyId })
            .select("replies._id replies.likes");
        const freshReply = fresh.replies.id(replyId);

        return res.status(200).json({
            success: true,
            type: "reply",
            liked: !alreadyLiked,
            likesCount: freshReply.likes.length,
            replyId: replyId,
            commentId: commentId
        });
    }

    // Otherwise operate on the main comment 
    const comment = await Comment.findById(commentId).select("likes");
    if (!comment) return next(new ErrorHandler("Comment not found", 404));

    const alreadyLiked = comment.likes.some(l => l.toString() === userId);

    if (alreadyLiked) {
        await Comment.updateOne(
            { _id: commentId },
            { $pull: { likes: userId } }
        );
    } else {
        await Comment.updateOne(
            { _id: commentId },
            { $addToSet: { likes: userId } }
        );
    }

    // fresh count
    const freshComment = await Comment.findById(commentId).select("likes");
    return res.status(200).json({
        success: true,
        type: "comment",
        liked: !alreadyLiked,
        likesCount: freshComment.likes.length,
        commentId
    });
}

// DELETE COMMENT AND REPLY
export const deleteCommentOrReply = async (req, res, next) => {

    // get user id
    const userId = req.user.id;

    // main commentId and replyId
    const { commentId, replyId } = req.params;

    // Delete a reply (subdocument)
    if (replyId) {

        // find the comment that contains this reply
        const comment = await Comment.findOne({ _id: commentId, "replies._id": replyId }).select("replies");
        if (!comment) return next(new ErrorHandler("Comment or reply not found", 404));

        const reply = comment.replies.id(replyId);
        if (!reply) return next(new ErrorHandler("Reply not found", 404));

        // only the user who wrote the reply can delete it
        if (reply.repliedBy.toString() !== userId) {
            return next(new ErrorHandler("Not authorized to delete this reply", 403));
        }

        // remove the reply
        await Comment.updateOne(
            { _id: commentId },
            { $pull: { replies: { _id: replyId } } }
        );

        return res.status(200).json({
            success: true,
            message: "Reply deleted successfully",
            commentId,
            replyId
        });
    }

    // Delete a main comment
    const comment = await Comment.findById(commentId).select("user post");
    if (!comment) return next(new ErrorHandler("Comment not found", 404));

    // only the comment owner can delete the comment
    if (comment.user.toString() !== userId) {
        return next(new ErrorHandler("Not authorized to delete this comment", 403));
    }

    // delete the comment document
    await Comment.deleteOne({ _id: commentId });

    // remove comment reference from the post's comments array (if you store it)
    if (comment.post) {
        await Post.updateOne(
            { _id: comment.post },
            { $pull: { comments: commentId } }
        );
    }

    return res.status(200).json({
        success: true,
        message: "Comment deleted successfully",
        commentId
    });
};

// DELETE POST
export const deletePost = async (req, res, next) => {

    // get user id
    const userId = req.user.id;

    // post id
    const { postId } = req.params;

    // find the post first to get owner and media info
    const post = await Post.findById(postId).select("user media");
    if (!post) return next(new ErrorHandler("Post not found", 404));

    // authorization: only post owner can delete (extend for admin if needed)
    if (post.user.toString() !== userId) {
        return next(new ErrorHandler("Not authorized to delete this post", 403));
    }

    // delete media from Cloudinary (if any)
    if (post.media && post.media.length > 0) {
        await Promise.all(
            post.media.map(async (m) => {
                const publicId = m.cloudinaryPublicId || m.publicId || m.public_id;
                if (!publicId) return Promise.resolve();
                try {
                    return await cloudinary.uploader.destroy(publicId);
                } catch { }
            })
        );
    }

    // delete the post document
    await Post.deleteOne({ _id: postId });

    // remove post reference from user's posts array
    await User.updateOne(
        { _id: post.user },
        { $pull: { posts: postId } }
    );

    // delete all comments associated with this post
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
        success: true,
        message: "Post deleted successfully",
        postId
    });
};

// BOOKMARK POST
export const bookMarkPost = async (req, res, next) => {

    // get user id
    const userId = req.user.id;

    // post id
    const { postId } = req.params;

    // ensure post exists
    const post = await Post.findById(postId).select("_id");
    if (!post) return next(new ErrorHandler("Post not found", 404));

    // load user's bookmarks (minimal)
    const user = await User.findById(userId).select("bookmarks");
    if (!user) return next(new ErrorHandler("User not found", 404));

    // checking already saved or not
    const alreadyBookmarked = user.bookmarks.some(b => b.toString() === postId);

    if (alreadyBookmarked) {

        // remove bookmark
        await User.updateOne({ _id: userId }, { $pull: { bookmarks: postId } });

    } else {

        // add bookmark (no duplicates)
        await User.updateOne({ _id: userId }, { $addToSet: { bookmarks: postId } });

    }

    // fresh count
    const fresh = await User.findById(userId).select("bookmarks");

    // return response
    return res.status(200).json({
        success: true,
        bookmarked: !alreadyBookmarked,
        bookmarksCount: fresh.bookmarks.length,
        postId
    });

};

