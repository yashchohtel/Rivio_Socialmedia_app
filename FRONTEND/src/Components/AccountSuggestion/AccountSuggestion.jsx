import React from 'react'
import "./accountSuggestion.css"
import AccountSuggestSkeleton from '../Skeletons/AccountSuggestionSkeleton/AccountSuggestSkeleton';

const AccountSuggestion = () => {
    return (
        <>
            {/* account suggestion component */}
            <div className="account_suggestion_comp">

                {/* story skeleton when stories is loading */}
                {Array.from({ length: 7 }).map((_, i) => (
                    <AccountSuggestSkeleton key={i} isFirst={i === 0}/>
                ))}

            </div>
        </>
    )
};

export default AccountSuggestion