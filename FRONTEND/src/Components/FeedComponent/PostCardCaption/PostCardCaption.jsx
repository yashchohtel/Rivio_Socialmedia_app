import React from 'react'
import './postCardCaption.css'
import { MdVerified } from "react-icons/md";

const PostCardCaption = ({ caption, user }) => {

    // state to store more caption toggle
    const [seeMoreCaption, setSeeMoreCaption] = React.useState(false);

    // destructure user data
    const { username, isVerified } = user;

    // creating short caption
    const WORD_LIMIT = 15;
    const words = caption.trim().split(/\s+/);
    const shortCaption = words.slice(0, WORD_LIMIT).join(" ");

    return (
        <>

            {/* caption box */}
            <div className="captionBox">

                {/* caption */}
                {caption && (
                    <>
                        <p className="caption">

                            <span className="usernameAndVerified">

                                {/* username */}
                                <span className="username" >{username}</span >

                                {/* verified batch */}
                                {isVerified && (
                                    <span className="icon">
                                        <MdVerified />
                                    </span>
                                )}

                            </span>

                            {seeMoreCaption ? caption : shortCaption}

                            {caption.length > shortCaption.length && (
                                <span
                                    className="seeMore"
                                    onClick={() => setSeeMoreCaption(!seeMoreCaption)}
                                >
                                    {seeMoreCaption ? "  ...less" : "  ...more"}
                                </span>
                            )}

                        </p>
                    </>
                )}

            </div>

        </>
    )
}

export default PostCardCaption

