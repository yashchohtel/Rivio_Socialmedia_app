import mongoose from "mongoose"; // Import mongoose
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing
import jwt from "jsonwebtoken"; // Import JWT for authentication

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

    // cloudinary public id for profile image
    cloudinaryPublicId: {
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
        enum: ["male", "female", "other", "none"],
        default: "none",
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

// Pre-save hook to hash the password before saving
userSchema.pre("save", async function (next) {

    try {

        // if password not modified skip hashing
        if (!this.isModified("password")) return next();

        // hash and replace password
        this.password = await bcrypt.hash(this.password, 10);

        // proceed to save
        next();

    } catch (err) {

        // call next with error if error occurs
        next(err);

    }

});

// Creating a JWT token for the user
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
}

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password); // Compare entered password with hashed password
}

// Create a user model
const User = mongoose.model("User", userSchema);

// Export the user model
export default User;