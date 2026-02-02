const PostCardFooter = (props) => {

    // initilize dispatch
    const dispatch = useDispatch();

    // Get auth loading state from Redux store
    const { likeStatus } = useSelector((state) => state.post);

    /* -------------------------------------- */

    // destructure proops
    const { postId, commentsCount, likesCount, sharesCount, isLiked } = props;

    // like count of post
    const [uiLikesCount, setUiLikesCount] = useState(likesCount);

    // state for stroing liked stated
    const [uiIsLiked, setUiIsLiked] = useState(isLiked);

    //  trigger animation
    const [triggerAnimation, setTriggerAnimation] = useState(false);

    // state to store liking process
    const [isLiking, setIsLiking] = useState(false);

    // state to store last intetion
    const [lastIntentin, setLastIntention] = useState(null)

    /* -------------------------------------- */

    // handle like click
    const handleLikeClick = () => {

        // decide users last intention like/unlike the post
        const intention = uiIsLiked ? "unlike" : "like";
        setLastIntention(intention);

        // set liked status inverse of previous state
        setUiIsLiked(prev => !prev);

        // set ui like count plus minus accordint to liked liked
        setUiLikesCount(prev => (uiIsLiked ? prev - 1 : prev + 1));

        // set trigger animation
        setTriggerAnimation(true);

        // rapid click lock
        if (isLiking) return;

        // set isLiking to true
        setIsLiking(true);

        // dispatch handle post like thunk
        dispatch(handlePostLike(postId));

    };

    /* -------------------------------------- */

    // effect to set liking status fasle
    useEffect(() => {

        if (likeStatus === "success" || likeStatus === "error") {
            setIsLiking(false);
        }

    }, [likeStatus]);

    useEffect(() => {
        console.log("UPDATED lastIntention:", lastIntentin);
        console.log("isLiking " + isLiking);
    }, [lastIntentin, isLiking]);
bhai itne se like feature / optimistic ui / multiple like click / 