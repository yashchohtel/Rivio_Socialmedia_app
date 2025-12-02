import express from "express"; // Express framework for building APIs
import catchAsyncError from "../middleware/catchAsyncError.js"; // Import async error handler middleware
import { isUserAuth } from "../middleware/auth.js"; // Import authentication middleware
import { bookMarkPost, commentOnPost, createPost, deleteCommentOrReply, deletePost, getAllPosts, getCommentsForPost, getMyPosts, likeCommentAndReplay, likePost, replyOnComment } from "../controllers/postController.js";
import { upload } from "../middleware/multer.js"; // Import multer middleware for file uploads

const postRouter = express.Router(); // Creating an instance of Express Router

// POSTS RELATED ROUTES -------------------- //

// Create post [POST]
postRouter.post('/createPost', isUserAuth, upload.array("postImage", 10), catchAsyncError(createPost));
// 'http://localhost:5000/api/posts/createPost'

// Get all post [GET]
postRouter.get('/getAllPosts', isUserAuth, catchAsyncError(getAllPosts));
// 'http://localhost:5000/api/posts/getAllPosts'

// Get my posts [GET]
postRouter.get('/getMyPosts', isUserAuth, catchAsyncError(getMyPosts));
// 'http://localhost:5000/api/posts/getMyPosts'

// Like - Unlike post [PATCH]
postRouter.patch('/likePost/:targetPostId', isUserAuth, catchAsyncError(likePost));
// 'http://localhost:5000/api/posts/likePost/:targetPostId'

// Comment on post [POST]
postRouter.post('/commentOnPost/:targetPostId', isUserAuth, catchAsyncError(commentOnPost));
// 'http://localhost:5000/api/posts/commentOnPost/:targetPostId'

// Replay on commont of post [POST]
postRouter.post('/replyOnComment/:commentId', isUserAuth, catchAsyncError(replyOnComment));
// 'http://localhost:5000/api/posts/replyOnComment/:commentId'

// Like - Unlike main comment [PATCH]
postRouter.patch('/likeComments/:commentId', isUserAuth, catchAsyncError(likeCommentAndReplay));
// 'http://localhost:5000/api/posts/likeComments/:commentId'

// Like - Unlike comment replay [PATCH]
postRouter.patch('/likeComments/:commentId/:replyId', isUserAuth, catchAsyncError(likeCommentAndReplay));
// 'http://localhost:5000/api/posts/likeComments/:commentId/:replyId'

// Delete main comment [DELETE]
postRouter.delete('/DeleteComment/:commentId', isUserAuth, catchAsyncError(deleteCommentOrReply));
// 'http://localhost:5000/api/posts/DeleteComment/:commentId'

// Delete reply [DELETE]
postRouter.delete('/DeleteComment/:commentId/:replyId', isUserAuth, catchAsyncError(deleteCommentOrReply));
// 'http://localhost:5000/api/posts/DeleteComment/:commentId/:replyId'

// Delete post [DELETE]
postRouter.delete('/deletePost/:postId', isUserAuth, upload.array("postImage", 10), catchAsyncError(deletePost));
// 'http://localhost:5000/api/posts/deletePost/:postId'

// Get posts comments [GET]
postRouter.get('/getCommentsForPost/:postId', catchAsyncError(getCommentsForPost));
// 'http://localhost:5000/api/posts/getCommentsForPost/:postId'

// Bookmark posts [PATCH]
postRouter.patch('/bookMarkPost/:postId', isUserAuth, catchAsyncError(bookMarkPost));
// 'http://localhost:5000/api/posts/bookMarkPost/:postId'

export default postRouter; // export user router