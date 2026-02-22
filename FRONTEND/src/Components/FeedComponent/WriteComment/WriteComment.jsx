import React, { useEffect, useRef, useState } from 'react'
import './writeComment.css'
import { FaRegFaceSmileWink } from "react-icons/fa6";
import EmojiPicker from '../../EmojiPicker/EmojiPicker';
import { useDispatch, useSelector } from 'react-redux';
import { addCommentOptimistic } from '../../../features/comment/commentSlice';
import { addComment } from '../../../features/comment/commentThunk';

const WriteComment = ({ postId }) => {

    // configure dispatch use to dispatch actions
    const dispatch = useDispatch();

    /* -------------------------------------- */

    // Get auth loading state from Redux store
    const currentUser = useSelector((state) => state.auth.user);

    /* -------------------------------------- */

    // refrence of textarea content
    const textareaRef = useRef(null);

    // functino to handle input 
    const handleInput = () => {

        // text area element
        const el = textareaRef.current;

        // same as CSS max-height
        const maxHeight = 100;

        // setting element style auto
        el.style.height = "auto";

        // if scroll height is less then or equal to max height 
        if (el.scrollHeight <= maxHeight) {
            el.style.height = `${el.scrollHeight}px`;
            el.style.overflowY = "hidden";
        } else {

            // if scroll height is greater than max height
            el.style.height = `${maxHeight}px`;
            el.style.overflowY = "auto";
        }
    };

    /* -------------------------------------- */

    // state to store comment value
    const [value, setValue] = useState("");

    const handleEmojiSelect = (emoji) => {

        // text area 
        const textarea = textareaRef.current;

        // return if no text area
        if (!textarea) return;

        // cursor posion start
        const start = textarea.selectionStart;

        // cursor position end
        const end = textarea.selectionEnd;

        const newValue = value.slice(0, start) + emoji + value.slice(end);

        // set new value
        setValue(newValue);

        handleInput()

        setTimeout(() => {
            textarea.focus();
            textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        }, 0);
    };

    /* -------------------------------------- */

    // state to open and close emoji picker
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

    // function to open close 
    const handleEmojiPickOpenClose = () => {
        setIsEmojiPickerOpen(!isEmojiPickerOpen)
    }

    /* -------------------------------------- */

    // handle coment post
    const handlePostComment = () => {

        // return if value is empty or only spaces
        if (!value.trim()) return;

        // create temp comment for optimistic update
        const tempComment = {
            _id: "temp-" + Date.now(),
            text: value,
            createdAt: new Date().toISOString(),
            user: currentUser,
            isOptimistic: true
        };

        // STEP 1: optimistic update
        dispatch(addCommentOptimistic({
            postId: postId,
            tempComment
        }));

        // STEP 2: backend call
        dispatch(addComment({
            postId: postId,
            text: value
        }));

        // clear textarea value
        setValue("");
        
    };

    /* -------------------------------------- */

    // focus textarea on component load
    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    // effect to manage textarea height on no vlaue
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;

        if (value === "") {
            el.style.height = "3rem";      // reset to 1 line
            el.style.overflowY = "hidden";
        }
    }, [value]);

    return (
        <>

            {/* write comment box */}
            <div className="writeCommentBox">

                {/* emoji picker close close overlay */}
                {isEmojiPickerOpen && (
                    <div className="pickerCloseOverlay"
                        onClick={() => handleEmojiPickOpenClose()}
                    ></div>
                )}

                {/* emoji picker */}
                {isEmojiPickerOpen && (
                    <div className="emojiPickerCont">
                        <EmojiPicker
                            handleEmojiSelect={handleEmojiSelect}
                        />
                    </div>
                )}

                {/* emoji open */}
                <div
                    className={`imojiOpen ${isEmojiPickerOpen ? "active" : ""}`}
                    onClick={() => handleEmojiPickOpenClose()}
                >
                    <FaRegFaceSmileWink />
                </div>

                {/* text area text*/}
                <textarea
                    rows={1}
                    className="textArea"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onInput={handleInput}
                    ref={textareaRef}
                    placeholder='Add a comment...'
                />

                {/* post button */}
                <button
                    className={`postCommentBtn ${value.trim() ? "active" : ""}`}
                    onClick={handlePostComment}
                >
                    POST
                </button>

            </div>

        </>
    )
}

export default WriteComment;

// Hello mike how are man 😅🤣😂😍😊🫠😃🙂🙂😃 this is me for no reason i'm here and now i want you to say something so please coprate me for that ok 😇