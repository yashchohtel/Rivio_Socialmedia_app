import React from 'react'
import "./searchModal.css"

const SearchModal = () => {

    return (
        <>
            <div
                className="searchModal"
                onClick={(e) => {
                    e.stopPropagation()
                }}
            >
                <h1>This is search modal</h1>
            </div>
        </>
    )
}

export default SearchModal