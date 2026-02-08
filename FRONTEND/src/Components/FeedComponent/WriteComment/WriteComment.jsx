import React, { useRef, useState } from 'react'
import './writeComment.css'
import { FaRegFaceSmileWink } from "react-icons/fa6";

const WriteComment = () => {


    // refrence of textarea content
    const textareaRef = useRef(null);

    const handleInput = () => {

        // getting textarea element
        const el = textareaRef.current;

        // setting height auto 
        el.style.height = "auto";

        // reset 
        el.style.height = `${el.scrollHeight}px`;

        if (el.scrollHeight >= 144) {         // same as max-height
            el.style.overflowY = "auto";
        } else {
            el.style.overflowY = "hidden";
        }
    };

    /* -------------------------------------- */


    

    const [value, setValue] = useState("");

    return (
        <>

            {/* write comment box */}
            <div className="writeCommentBox">

                {/* emoji open */}
                <div className="imojiOpen">
                    <FaRegFaceSmileWink />
                </div>

                {/* text area wrap*/}
                <div className="textAreaWrap">

                    {!value && <span className="fakePlaceholder">Add a comment...</span>}

                    <textarea
                        className="textArea"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onInput={handleInput}
                        ref={textareaRef}
                    />

                </div>


                {/* post button */}
                <button className="post">POST</button>

            </div>
        </>
    )
}

export default WriteComment