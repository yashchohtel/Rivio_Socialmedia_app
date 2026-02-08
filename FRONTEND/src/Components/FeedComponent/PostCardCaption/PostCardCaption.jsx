import React from 'react'
import './postCardCaption.css'
import { MdVerified } from "react-icons/md";

const PostCardCaption = ({ caption, user, componentType }) => {

    // state to store more caption toggle
    const [seeMoreCaption, setSeeMoreCaption] = React.useState(false);

    // destructure user data
    const { username, isVerified } = user;

    // creating short caption
    const WORD_LIMIT = 15;
    const words = caption.trim().split(/\s+/);
    const shortCaption = words.slice(0, WORD_LIMIT).join(" ");

    const renderCaptionWithHashtags = (text) => {
        return text.split(" ").map((word, index) => {
            if (word.startsWith("#")) {
                return (
                    <span key={index} className="hashtag">
                        {word + " "}
                    </span>
                );
            }
            return word + " ";
        });
    };

    return (
        <>

            {/* caption box */}
            <div className="captionBox">

                {/* caption */}
                {caption && (
                    <>
                        <p className="caption">

                            <span className="usernameAndVerified">
                                <span className="username">{username}</span>
                                {isVerified && (
                                    <span className="icon">
                                        <MdVerified />
                                    </span>
                                )}
                            </span>

                            {componentType === "postCard" ? (


                                <>
                                    {seeMoreCaption ? renderCaptionWithHashtags(caption) : renderCaptionWithHashtags(shortCaption)}

                                    {caption.length > shortCaption.length && (
                                        <span
                                            className="seeMore"
                                            onClick={() => setSeeMoreCaption(prev => !prev)}
                                        >
                                            {seeMoreCaption ? "  ...less" : "  ...more"}
                                        </span>
                                    )}
                                </>
                            ) : (
                                renderCaptionWithHashtags(caption)
                            )}

                        </p>
                    </>
                )}

            </div>

        </>
    )
}

export default PostCardCaption

