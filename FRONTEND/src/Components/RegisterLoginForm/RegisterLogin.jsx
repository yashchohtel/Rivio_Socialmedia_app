import React, { useState } from 'react'
import './registerLogin.css'

import { LuEye } from "react-icons/lu";
import { LuEyeClosed } from "react-icons/lu";

const RegisterLogin = ({ handleFormChange }) => {

    // state to show/hide password
    const [showPassword, setShowPassword] = useState(false);

    /* -------------------------------------- */

    // state to toggle between register and login forms
    const [formType, setFormType] = useState("signup");

    // handle form toggle function
    function handleFormToggle() {

        // Toggle form type between signup and login
        setFormType(formType === "signup" ? "login" : "signup");

        // Notify parent component about the form change
        handleFormChange();
    }

    /* -------------------------------------- */

    // state to store form data
    const [formData, setFormData] = useState({
        username: "",
        fullname: "",
        email: "",
        identifier: "",
        password: "",
        confirmPassword: "",
        dateOfBirth: "",
        gender: ""
    });

    // function to handle form data change
    const handleInputChange = (e) => {

        // destructuring name and value from event target
        const { name, value } = e.target;

        // updating form data state with the new value
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };
    
    return (
        <>

            <div className="registerLoginFormContainer">

                {/* form container */}
                <div className="formContainer">

                    {/* logo image */}
                    <div className="logoImage">
                        <img src="/images/instalogowhite.png" alt="logo" />
                    </div>

                    {/* tagline */}
                    <p className='authMessage'>
                        {formType === "signup" ? "Sign up to see photos and stories from your friends." : "Login to continue!"}
                    </p>

                    {/* rule */}
                    <div className="rule">
                        <div className="fullLine"></div>
                    </div>

                    {/* form */}
                    <form className="RegisterLoignForm">

                        {/* identifier (Login) */}
                        {formType !== "signup" && (
                            <div className="input-group">
                                <div className="field">
                                    <input
                                        type="text"
                                        id="identifier"
                                        name='identifier'
                                        placeholder=""
                                        autoComplete="off"
                                        value={formData.identifier}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <label htmlFor="loginId">Email or Username</label>
                                </div>
                            </div>
                        )}

                        {/* Email (Register) */}
                        {formType === "signup" && (
                            <div className="input-group">
                                <div className="field">
                                    <input
                                        type="email"
                                        id="email"
                                        name='email'
                                        placeholder=''
                                        autoComplete="off"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <label htmlFor="email">Email</label>
                                </div>
                            </div>
                        )}

                        {/* Username (Register) */}
                        {formType === "signup" && (
                            <div className="input-group">
                                <div className="field">
                                    <input
                                        type="text"
                                        id="username"
                                        name='username'
                                        placeholder=''
                                        autoComplete="off"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <label htmlFor="username">Username</label>
                                </div>
                            </div>
                        )}

                        {/* Full Name (Register) */}
                        {formType === "signup" && (
                            <div className="input-group">
                                <div className="field">
                                    <input
                                        type="text"
                                        id="fullname"
                                        name='fullname'
                                        placeholder=''
                                        autoComplete="off"
                                        value={formData.fullname}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <label htmlFor="fullname">Full Name</label>
                                </div>
                            </div>
                        )}

                        {/* Password (Both) */}
                        <div className="input-group">
                            <div className="field">
                                <input
                                    id="password"
                                    placeholder=''
                                    name='password'
                                    autoComplete="off"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    type={showPassword ? "text" : "password"}
                                />
                                <label htmlFor="password">Password</label>

                                <div className="eyeIconCont" onClick={() => setShowPassword(!showPassword)}>
                                    <span className="eyeIcon"> {showPassword ? <LuEye /> : <LuEyeClosed />}  </span>
                                </div>

                            </div>
                        </div>

                        {/* Confirm Password — ONLY for Register */}
                        {formType === "signup" && (
                            <div className="input-group">
                                <div className="field">
                                    <input
                                        id="confirmPassword"
                                        placeholder=''
                                        name='confirmPassword'
                                        autoComplete="off"
                                        onChange={handleInputChange}
                                        required
                                        type={showPassword ? "text" : "password"}
                                    />
                                    <label htmlFor="confirmPassword">Confirm Password</label>

                                    <div className="eyeIconCont" onClick={() => setShowPassword(!showPassword)}>
                                        <span className="eyeIcon"> {showPassword ? <LuEye /> : <LuEyeClosed />} </span>
                                    </div>

                                </div>
                            </div>
                        )}

                        {/* aggriment text */}
                        <p className="agreement-text">
                            By {formType == "signup" ? "signup" : "login"} , you agree to our
                            <span className="link">Terms</span>,
                            <span className="link">Privacy</span>
                            and
                            <span className="link">Cookies Policy</span>.
                        </p>

                        {/* submit button */}
                        <button type="submit" className="submitBtn btn-primary ">
                            {formType === "signup" ? "Sign Up" : "Log In"}
                        </button>

                    </form>

                    {/* rule */}
                    {formType === "login" && (
                        <div className="rule">
                            <div className="line"></div>
                            <div className="orText">OR</div>
                            <div className="line"></div>
                        </div>
                    )}

                    {/* forgot password */}
                    {formType !== "signup" && (
                        <p className="forgot-password">
                            <a href="#">Forgot password?</a>
                        </p>
                    )}

                </div>

                {/* form toggle */}
                <div className="formToggle">
                    <p className="toggleText" onClick={handleFormToggle}>
                        {formType === "signup" ? (
                            <>
                                Have an account? <span className="link">Log in</span>
                            </>
                        ) : (
                            <>
                                Don't have an account? <span className="link">Sign up</span>
                            </>
                        )}
                    </p>
                </div>

            </div>
        </>
    )
};

export default RegisterLogin;