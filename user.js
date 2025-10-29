import User from "../models/User.js";
import {
  catchAsyncError
} from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// GET /api/users/suggested
export const getSuggestedUsers = catchAsyncError(async (req, res, next) => {
  const currentUserId = req.user._id;

  // Step 1: get current user
  const currentUser = await User.findById(currentUserId).select("following followers");

  if (!currentUser) { return next(new ErrorHandler("User not found", 404)); }

  // Step 2: get all related user IDs (followers ke followers + following ke followers)
  const relatedUsers = await User.find({ _id: { $in: [...currentUser.followers, ...currentUser.following] } }).select("followers");

  // Step 3: collect all those followers IDs
  let suggestedIds = [];

  relatedUsers.forEach(u => { suggestedIds.push(...u.followers) });

  // Step 4: remove duplicates, yourself, and already followed users
  const uniqueIds = [...new Set(suggestedIds)].filter(id =>
    id.toString() !== currentUserId.toString() &&
    !currentUser.following.includes(id) &&
    !currentUser.followers.includes(id)
  );

  // Step 5: get suggested user details (limit 10)
  const suggestedUsers = await User.find({ _id: { $in: uniqueIds } }).select("_id username fullName profileImage isPrivate").limit(10);

  // Step 6: send response
  res.status(200).json({
    success: true,
    count: suggestedUsers.length,
    users: suggestedUsers,
  });
});
