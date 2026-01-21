import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/dataBase.js";
import Post from "../models/profileModel/postModel.js";

// load env
dotenv.config();

// migratePosts function to update document according to new schema.
const migratePosts = async () => {
    try {

        // connect DB
        await connectDB();

        // update old posts
        const result = await Post.updateMany(
            {
                $or: [
                    { likesCount: { $exists: false } },
                    { commentsCount: { $exists: false } },
                    { sharesCount: { $exists: false } }
                ]
            },
            {
                $set: {
                    likesCount: 0,
                    commentsCount: 0,
                    sharesCount: 0
                }
            }
        );

        console.log("✅ Migration completed");
        console.log("Matched:", result.matchedCount);
        console.log("Modified:", result.modifiedCount);

        process.exit(0);
        
    } catch (error) {
        console.error("❌ Migration failed:", error);
        process.exit(1);
    }
};

migratePosts();