import mongoose from "mongoose"; // Import mongoose

// Creating a post schema
const postSchema = new mongoose.Schema({

    // caption of the post
    caption: {
        type: String,
        trim: true,
        default: "",
    },

    // id user who created the post
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // media array to store images/videos
    media: [
        {
            mediaType: {
                type: String, enum: ["image", "video"],
                required: true
            }, // media type (image/video)

            url: {
                type: String,
                required: true
            },  // Cloudinary/S3 URL

            cloudinaryPublicId: {
                type: String,
                required: true
            } // Cloudinary public id

        }
    ],

    // likes array to store user ids who liked the post
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    // comments array to store comment ids
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],

    // array to store user ids who is tagged in the post
    tags: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" // tagged users
        }
    ],

    // array to store share info
    shares: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"  // jo user ne share kiya
        }
    ],

    // location of the post
    location: {
        type: String
    }

}, { timestamps: true });

// Creating a post modal
const Post = mongoose.model("Post", postSchema);

export default Post; // Export the post modal