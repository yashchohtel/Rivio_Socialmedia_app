import mongoose from "mongoose"; // Import mongoose

// Creating a user schema
const userSchema = new mongoose.Schema({

    // user name
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true,
    },

    // user email
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
    },

    // user password
    password: {
        type: String,
        required: [true, "Password is required"],
    },

    // user full name
    fullName: {
        type: String,
        required: [true, "Full Name is required"],
        trim: true,
    },

    // user date of birth
    dateOfBirth: {
        type: Date,
        required: true
    },

    // user profile image
    profileImage: {
        type: String,
        default: "",
    },

    // user bio
    bio: {
        type: String,
        default: "",
    },

    // user gender 
    gender: {
        type: String,
        enum: ["make", "female", "other"],
    },

    // user followers
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],

    // user following
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],

    // user posts
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    }],

    // bookmarks
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    }],

    // is user verified
    isVerified: {
        type: Boolean,
        default: false
    },

    // is account private
    isPrivate: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

// Create a user model
const User = mongoose.model("User", userSchema);

// Export the user model
export default User;