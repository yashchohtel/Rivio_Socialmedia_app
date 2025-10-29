// function to create send and store JWT token for user authentication
export const sendToken = (user, statusCode, res) => {

    // creating JWT token for the user
    const token = user.getJwtToken();

    console.log(token);
    
    // options for cookie
    const options = {
        httpOnly: true, // cookie is not accessible via JavaScript
        maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie expires in 7 days
    }

    // user data to send in response
    const userData = {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        profileImage: user.profileImage,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        posts: user.posts,
        bookmarks: user.bookmarks,
        isVerified: user.isVerified,
        isPrivate: user.isPrivate,
    }

    // send response with cookie
    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        message: `Welcome, ${user.fullName}`,
        userData
    })

}