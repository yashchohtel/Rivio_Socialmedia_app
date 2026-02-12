import React from 'react'
import './home.css'
import AccountSuggestion from '../../Components/AccountSuggestion/AccountSuggestion';
import Stories from '../../Components/Story Component/Stories/Stories';
import Feed from '../../Components/FeedComponent/Feed/Feed';

const Home = () => {
    
    return (
        <>
            {/* home page */}
            <div className="homePage">

                {/* home page container */}
                <div className="homePageContentCont">

                    {/* story and feed container */}
                    <div className="storyAndFeedCont">

                        {/* story */}
                        <div className="storyCont">

                            {/* story component */}
                            <Stories />

                        </div>

                        {/* feed area */}
                        <div className="feedCont">

                            {/* feed component */}
                            <Feed/>
                            
                        </div>

                    </div>

                    {/* suggestion contaienr */}
                    <div className="accountSuggestionCont">

                        {/* account suggestion component */}
                        <AccountSuggestion />

                    </div>

                </div>

            </div>
        </>

    );
};

export default Home;