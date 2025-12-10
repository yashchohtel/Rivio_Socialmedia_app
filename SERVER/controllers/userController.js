import User from "../models/profileModel/userModel.js"; // Import User model
import ErrorHandler from "../utils/errorHandler.js"; // Import custom error handler
import { sendToken } from "../utils/sendJwtToken.js"; // Import function to send JWT token
import fs from "fs"; // Import file system module
import cloudinary from "../config/cloudinary.js"; // Import Cloudinary configuration
import mongoose from "mongoose";

// REGISTRATION 
export const registerUser = async (req, res, next) => {

    // Extract user details from request body
    const { fullName, username, email, password, dateOfBirth } = req.body;

    // Check if all required fields are provided
    if (!fullName || !username || !email || !password || !dateOfBirth) {
        return next(new ErrorHandler("Missing user details", 400));
    }

    // Check if a user with the given username already exists
    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
        return next(new ErrorHandler("username already exists", 400));
    }

    // Check if the email already exists in the database
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
        return next(new ErrorHandler("Email already exists", 400));
    }

    // creating user details
    const newUser = await User.create({
        username,
        fullName,
        email,
        password,
        dateOfBirth
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // sending token to the user
    sendToken(savedUser, 200, res);

};

// LOGIN 
export const loginUser = async (req, res, next) => {

    // Extracting data from body, "identifier" can be either email or username
    const { identifier, password } = req.body;

    // Check if all required fields are provided
    if (!identifier || !password) {
        return next(new ErrorHandler("Missing user details", 400));
    }

    // Find user by email or username
    const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }]
    });

    // If user not found, return error
    if (!user) {
        return next(new ErrorHandler("Invalid credentials", 401));
    }

    // Check if the password matches
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid credentials", 401));
    }

    // sending token to the user
    sendToken(user, 200, res);

}

// LOGOUT
export const logoutUser = async (req, res, next) => {

    // Clear the cookie 
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    });

    // Return success response
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });

}

// GET MY PROFILE
export const getMyProfile = async (req, res, next) => {

    // Extract user ID from request parameters
    const { id } = req.user;

    // Find user by ID and exclude password from the result
    const user = await User.findById(id).select("-password");

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // send user profile as response
    res.status(200).json({
        success: true,
        user
    });

}

// GET USER PROFILE 
export const getUserProfile = async (req, res, next) => {

    // Extract user ID from request parameters
    const { id } = req.params;

    // Find user by ID and exclude password from the result
    const user = await User.findById(id).select("-password");

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // send user profile as response
    res.status(200).json({
        success: true,
        user
    });
};

// EDIT PROFILE 
export const editProfile = async (req, res, next) => {

    // Extract user ID from request
    const { id } = req.user;

    // Find user by ID and exclude password from the result
    const user = await User.findById(id).select("-password");

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Extract profile details from request body
    const { fullName, bio, gender, isPrivate, dateOfBirth } = req.body;

    // Update text fields if provided
    if (fullName) user.fullName = fullName;
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (typeof isPrivate !== "undefined") user.isPrivate = isPrivate;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;

    // extract profile details from request body
    const profilePic = req.file;

    // Check file and upload if provided
    if (profilePic) {

        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: 'RIVIO_profile_pics' });

        // delete old image if exist on uploading new one
        if (user.profileImage && user.cloudinaryPublicId) {
            await cloudinary.uploader.destroy(user.cloudinaryPublicId);
        }

        // Save new image info in user
        user.profileImage = uploadResult.secure_url;
        user.cloudinaryPublicId = uploadResult.public_id;

        // delete temp file
        await fs.promises.unlink(req.file.path);

    };

    // save the user details
    await user.save();

    // send success response
    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user
    });

}

// REMOVE PROFILE PICTURE
export const removeProfilePicture = async (req, res, next) => {

    const { id } = req.user; // Logged-in user ID

    const user = await User.findById(id).select("profileImage cloudinaryPublicId");
    if (!user) return next(new ErrorHandler("User not found", 404));

    // Delete from Cloudinary if image exists
    if (user.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(user.cloudinaryPublicId);
    }

    // Remove image info from DB (or set to default)
    user.profileImage = null;
    user.cloudinaryPublicId = null;

    // save user
    await user.save();

    // return response
    res.status(200).json({
        success: true,
        message: "Profile image removed successfully",
        user
    });

}

// GET SUGGESTED USERS
export const getSuggestedUsers = async (req, res, next) => {

    // Extract user ID from request
    const { id } = req.user;

    // Find current user
    const currentUser = await User.findById(id).select("following followers").select("-password");
    if (!currentUser) return next(new ErrorHandler("User not found", 404));

    // Get all related user IDs (followers ke followers + following ke followers)
    const relatedUsers = await User.find({
        _id: { $in: [...currentUser.followers, ...currentUser.following] }
    }).select("followers following");

    // Collect all those followers and following IDs
    let suggestedIds = [];
    relatedUsers.forEach(user => {
        suggestedIds.push(...user.followers, ...user.following);
    });

    // Converting to string for comparison
    const followingIds = currentUser.following.map(f => f.toString());
    const followerIds = currentUser.followers.map(f => f.toString());
    const suggestedIdsString = suggestedIds.map(s => s.toString());

    // Remove duplicates, yourself, and already followed/following users
    const uniqueIds = [...new Set(suggestedIdsString)].filter(id => {
        return (
            id !== currentUser._id.toString() &&
            !followingIds.includes(id) &&
            !followerIds.includes(id)
        );
    });

    // suggested users array
    let suggestedUsers = [];

    if (uniqueIds.length > 0) {

        // Get suggested user details (limit 10)
        suggestedUsers = await User.find({ _id: { $in: uniqueIds } }).select("_id username fullName profileImage isPrivate").limit(10);

    } else {

        // Fallback: Get random users excluding current user (limit 10)
        suggestedUsers = await User.find({ _id: { $ne: currentUser._id } }).select("-password").limit(10);

    }

    // Send success response
    res.status(200).json({
        success: true,
        message: "Suggested users fetched successfully",
        count: suggestedUsers.length,
        suggestedUsers
    });

};

// FOLLOW AND UNFOLLOW USER
export const followUnfollowUser = async (req, res, next) => {

    // Extract information from request
    const { id } = req.user
    const { targetUserId } = req.params;

    // Find both users
    const currentUser = await User.findById(id).select("following followers");
    const targetUser = await User.findById(targetUserId).select("followers following isPrivate username");

    // Check if both users exist
    if (!currentUser || !targetUser) return next(new ErrorHandler("User not found", 404));

    // Prevent user from following/unfollowing themselves
    if (currentUser._id.toString() === targetUserId) {
        return next(new ErrorHandler("You cannot follow/unfollow yourself", 400));
    }

    // If target is private, reject here (we're handling public only now)
    if (targetUser.isPrivate) {
        return next(new ErrorHandler("This account is private — follow request required", 403));
    }

    // Check if already following
    const followingIds = (currentUser.following || []).map(x => x.toString()); // Normalize arrays to string ids for safe comparison
    const isFollowing = followingIds.includes(targetUserId);

    if (isFollowing) {

        // Unfollow logic
        currentUser.following = currentUser.following.filter(f => f.toString() !== targetUserId);
        targetUser.followers = targetUser.followers.filter(f => f.toString() !== currentUser._id.toString());

        // save both user
        await currentUser.save();
        await targetUser.save();

        // return response
        return res.status(200).json({
            success: true,
            message: `you unfollowed ${targetUser.username}`,
        });

    } else {

        // avoid duplicates just in case
        if (!followingIds.includes(targetUserId)) {
            currentUser.following.push(targetUserId);
        }

        const targetFollowers = (targetUser.followers || []).map(x => x.toString());
        if (!targetFollowers.includes(currentUser._id.toString())) {
            targetUser.followers.push(currentUser._id);
        }

        await currentUser.save();
        await targetUser.save();

        return res.status(200).json({
            success: true,
            message: `now you following ${targetUser.username}`,
        });

    }

}