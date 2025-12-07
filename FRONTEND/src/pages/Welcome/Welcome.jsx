import React from 'react'
import './welcome.css'
import RegisterLogin from '../../Components/RegisterLoginForm/RegisterLogin'

const Welcome = () => {

    const formType = "login";

    return (
        <>
            {/* welcome page */}
            <section className='welcomepage'>

                {/* welcome page image container */}
                <div className="imageContainer">
                    <img src="/images/welcomeImage.png" alt="welcome" />
                </div>

                {/* welcome page */}
                <div className="welcomePageForm">

                    {/* logo image */}
                    <div className="logoImage">
                        <img src="/images/transparentLogoWhite.png" alt="logo" />
                    </div>

                    {/* form container */}
                    <div className="welcFormContainer">

                        {/* register/logn form component */}
                        <RegisterLogin formType={formType}/>

                    </div>

                </div>

            </section>
        </>
    )
}

export default Welcome