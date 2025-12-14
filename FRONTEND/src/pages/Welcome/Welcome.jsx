import React from 'react'
import './welcome.css'
import RegisterLogin from '../../Components/RegisterLoginForm/RegisterLogin'

const Welcome = () => {

    // state to show hide image
    const [formChange, setFormChange] = React.useState("none");
    
    // handle form change
    function handleFormChange() {
        setFormChange("changed");
    }
    
    return (
        <>
            {/* welcome page */}
            <section className='welcomepage'>

                {/* welcome page image container */}
                {/* {formChange !== "changed" && (
                   <div className="imageContainer">
                        <img src="/images/welcomeImagep.png" alt="welcome" />
                    </div> 
                )} */}

                {/* welcome page */}
                <div className="welcomePageForm">

                    {/* form container */}
                    <div className="welcFormContainer">

                        {/* register/logn form component */}
                        <RegisterLogin handleImageChange={handleFormChange} />

                    </div>

                </div>

            </section>
        </>
    )
};

export default Welcome;