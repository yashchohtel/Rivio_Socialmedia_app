import React from 'react'
import './emojiPicker.css'
import Picker from "emoji-picker-react";

const EmojiPicker = ({ handleEmojiSelect }) => {

    return (
        <>
            {/* emoji icker */}
            <div className="emojipicker">
                <Picker
                    onEmojiClick={(emojiObject) => handleEmojiSelect(emojiObject.emoji)}
                    theme="dark"
                    previewConfig={{ showPreview: false }}
                    autoFocusSearch={false}
                    width={340}
                    height={380}
                    lazyLoadEmojis={true}
                />
            </div>
        </>
    )
}

export default EmojiPicker