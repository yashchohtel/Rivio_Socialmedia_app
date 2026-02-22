// function to create send and store JWT token for user authentication
export const sendToken = (user, statusCode, res) => {

    // creating JWT token for the user
    const token = user.getJwtToken();

    // options for cookie
    const options = {
        httpOnly: true, // cookie is not accessible via JavaScript
        maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie expires in 7 days
    }

    const userData = {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,

        bio: user.bio || "",
        profileImage: user.profileImage || null,

        isVerified: user.isVerified,
        isPrivate: user.isPrivate,

        followersCount: user.followers?.length || 0,
        followingCount: user.following?.length || 0,
        postsCount: user.posts?.length || 0,
        bookmarksCount: user.bookmarks?.length || 0,
    };

    // send response with cookie
    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        message: `Welcome, ${user.fullName}`,
        user: userData
    })

}