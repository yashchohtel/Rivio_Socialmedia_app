import React from 'react'
import "./stories.css"
import StorySkeleton from '../../Skeletons/StorySkeleton/StorySkeleton'

const Stories = () => {
    return (
        <>
            {/* story component */}
            <div className="stories_component">

                {/* story skeleton when stories is loading */}
                {Array.from({ length: 6 }).map((_, i) => (
                    <StorySkeleton key={i} />
                ))}

            </div>
        </>
    )
}

export default Stories