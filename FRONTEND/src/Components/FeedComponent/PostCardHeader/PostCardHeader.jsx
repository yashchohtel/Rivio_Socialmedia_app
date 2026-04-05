import { MdVerified } from "react-icons/md";
import { HiDotsHorizontal } from "react-icons/hi";
import { timeAgo } from "../../../utility/postCardUtility";
import { useNavigate } from "react-router-dom";
import './postCardHeader.css';
import { useDispatch } from "react-redux";
import { openFeedActionOption } from "../../../features/ui/uiSlice";

const PostCardHeader = ({ user, createdAt, location, isOwnPost, isFollowing, componentType }) => {

    // initilize useNavigate 
    const navigate = useNavigate();

    /* -------------------------------------- */

    // configure dispatch use to dispatch actions
    const dispatch = useDispatch();

    /* -------------------------------------- */
    
    // safety check (important because tumne user null bhi rakha hai)
    if (!user) return null;
    
    /* -------------------------------------- */
    
    // destructure user data
    const { id, profileImage, username, isVerified } = user;

    // function to handle navigate to user profile
    const navigateToProfile = (id) => {

        // navigate to profile page with user profile data
        navigate(`/app/profile/${id}`, {
            state: { user: user }
        })

    };

    /* -------------------------------------- */

    // function to open feed action option modal
    const handleOpenModal = () => {

        // dispatch open feed action option modal action
        dispatch(openFeedActionOption());

    }

    return (

        <div className="postCardHeader">

            {/* user info */}
            <div className="userInfo" onClick={() => navigateToProfile(id)}>

                {/* avatar */}
                <div className="avatar">
                    <img src={profileImage || "/images/userprofile.jpeg"} alt="profile" />
                </div>

                {/* info */}
                <div className="userInfoDetail">

                    {/* user name and time */}
                    <div className="userNameAndTime">

                        {/* username */}
                        <span className="username">{username}</span>

                        {/* verified batch */}
                        {isVerified && (
                            <span className="icon">
                                <MdVerified />
                            </span>
                        )}

                        {/* dot */}
                        <span className="dot">•</span>

                        {/* time */}
                        <span className="time">{timeAgo(createdAt)}</span>

                    </div>

                    {/* location */}
                    {location && componentType === "postCard" && (
                        <div className="location">{location}</div>
                    )}

                </div>

            </div>

            {/* follow + options */}
            <div className="btnAndOptions">

                {/* follow/unfollow button */}
                {!isOwnPost && (
                    <div className="followBtn">
                        {isFollowing ? (
                            <button className="unfollow">Unfollow</button>
                        ) : (
                            <button className="follow">Follow</button>
                        )}
                    </div>
                )}

                {/* option */}
                <div className="option"
                    onClick={() => handleOpenModal()}
                >
                    <span className="icon">
                        <HiDotsHorizontal />
                    </span>
                </div>

            </div>

        </div>
    );
};

export default PostCardHeader;
