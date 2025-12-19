import React, { useState } from 'react'
import './registerLogin.css'
import { LuEye } from "react-icons/lu";
import { LuEyeClosed } from "react-icons/lu";

import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../features/auth/authThunk';

const RegisterLogin = ({ handleImageChange }) => {

    // configure dispatch use to dispatch actions 
    const dispatch = useDispatch();

    // getting required Data from global store using useSelector
    const { loading, successMessage, error, user, isAuthenticated } = useSelector((state) => state.auth);

    // state to show/hide password
    const [showPassword, setShowPassword] = useState(false);

    // state to toggle between register and login forms
    const [formType, setFormType] = useState("signup");

    // state for storing errors
    const [errors, setErrors] = useState({});

    // state to track current form page
    const [currentFormPage, setCurrentFormPage] = useState(1);

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

    /* -------------------------------------- */

    // handle form toggle function
    function handleFormToggle() {

        // Toggle form type between signup and login
        setFormType(formType === "signup" ? "login" : "signup");

        // Notify parent component about the form change
        handleImageChange();
    }

    /* -------------------------------------- */

    // function to toggle between login and register form
    const toggleFormReset = () => {

        // reset form data to empty string
        setFormData({
            username: "",
            fullname: "",
            email: "",
            identifier: "",
            password: "",
            confirmPassword: "",
            dateOfBirth: "",
            gender: ""
        });

        // reset errors to empty object
        setErrors({});

    };

    /* -------------------------------------- */

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

    /* -------------------------------------- */

    // function to process form to next page
    const handleFormProcess = (currentPage) => {

        if (currentPage === "page1") {
            setCurrentFormPage((prev) => prev + 1);
        } else if (currentPage === "page2") {

            // go back to previous page - dont change page if page is 1
            if (currentFormPage > 1) {
                setCurrentFormPage((prev) => prev - 1);
            }
        }

    };

    // handle next page function with validation
    const handleNext = () => {

        // your validation function
        const newErrors = validateForm();

        // if there are errors, do not proceed to next page
        if (Object.keys(newErrors).length > 0) {
            return;
        }

        // If no errors → move to next page
        handleFormProcess("page1");
    };

    /* -------------------------------------- */

    // function for form validation
    const validateForm = () => {

        // temporary object to store errors
        const newErrors = {};

        // Password (COMMON)
        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        } else if (formType === "signup" && formData.password.length < 8) {
            newErrors.password = "Password must be 8+ chars";
        }

        // login validation
        if (formType === "login") {

            // Identifier (Email or Username)
            if (!formData.identifier.trim()) {
                newErrors.identifier = "Email or Username is required";
            }
        }

        // register validation
        if (formType === "signup") {

            // Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!formData.email.trim()) {
                newErrors.email = "Email is required";
            } else if (!emailRegex.test(formData.email)) {
                newErrors.email = "Email format is invalid";
            }

            // Username
            if (!formData.username.trim()) {
                newErrors.username = "Username is required";
            } else if (formData.username.length < 4 || formData.username.length > 20) {
                newErrors.username = "Username must be 4–20 chars";
            }

            // Full Name
            if (!formData.fullname.trim()) {
                newErrors.fullname = "Full Name is required";
            } else if (formData.fullname.length < 4 || formData.fullname.length > 20) {
                newErrors.fullname = "Full Name must be 4–20 chars";
            }

            // Confirm Password
            if (!formData.confirmPassword.trim()) {
                newErrors.confirmPassword = "Confirm Password is required";
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match";
            }

            // Date of Birth
            if (currentFormPage == 2) {
                if (!formData.dateOfBirth.trim()) {
                    newErrors.dateOfBirth = "Date of Birth is required";
                } else {

                    const dob = new Date(formData.dateOfBirth);
                    const today = new Date();

                    let age = today.getFullYear() - dob.getFullYear();
                    const monthDiff = today.getMonth() - dob.getMonth();

                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                        age--;
                    }

                    if (age < 13) {
                        newErrors.dateOfBirth = "You must be at least 13 years old";
                    }
                }
            }

        }

        // update errors state
        setErrors(newErrors);

        return newErrors;
    };

    /* -------------------------------------- */

    const handleFormSubmit = (e) => {

        // prevent default form submission behavior
        e.preventDefault();

        // Handle form submission logic here
        if (formType === "signup") {

            // validate form before submission
            const newErrors = validateForm();

            // if there are errors, do not proceed with form submission
            if (Object.keys(newErrors).length > 0) {
                return;
            }

            // Handle signup logic
            console.log("Signup data:", formData);

        } else {

            // validate form before submission
            const newErrors = validateForm();

            // if there are errors, do not proceed with form submission
            if (Object.keys(newErrors).length > 0) {
                return;
            }

            // Handle login logic
            console.log("Login data:", formData);

        }
    }

    /* -------------------------------------- */

    return (

        <>
            {/* register form container */}
            <div className="registerLoginFormContainer page1">

                {/* form container */}
                <div className="formContainer">

                    {/* logo image */}
                    <div className="logoImage">
                        <img src="/images/instalogowhite.png" alt="logo" />
                    </div>

                    {/* head info page 1*/}
                    {currentFormPage == "1" && (
                        <p className='authMessage'>
                            {formType === "signup" ? "Sign up to see photos and stories from your friends." : "Login to continue!"}
                        </p>
                    )}

                    {/* head info page 2 */}
                    {currentFormPage == "2" && (
                        <p className='agreement-text'>
                            This won't be a part of your public profile. <br />
                            <span className='link'>Why do i need to provide my birthday?</span>
                        </p>
                    )}

                    {/* rule */}
                    <div className="rule">
                        <div className="fullLine"></div>
                    </div>

                    {/* form */}
                    <form className="RegisterLoignForm">

                        {/* identifier (Login) */}
                        {formType !== "signup" && currentFormPage == "1" && (
                            <>
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
                                        />
                                        <label htmlFor="identifier">Email or Username</label>
                                    </div>
                                </div>

                                {/* error */}
                                {errors.identifier && (<span className="formError">{errors.identifier}</span>)}

                            </>
                        )}

                        {/* Email (Register) */}
                        {formType === "signup" && currentFormPage == "1" && (
                            <>
                                <div className="input-group">
                                    <div className="field">
                                        <input
                                            type="email"
                                            id="email"
                                            name='email'
                                            placeholder=''
                                            autoComplete="on"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                        <label htmlFor="email">Email</label>
                                    </div>
                                </div>

                                {/* error */}
                                {errors.email && (<span className="formError">{errors.email}</span>)}

                            </>
                        )}

                        {/* Username (Register) */}
                        {formType === "signup" && currentFormPage == "1" && (
                            <>
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
                                        />
                                        <label htmlFor="username">Username</label>
                                    </div>
                                </div>

                                {/* error */}
                                {errors.username && (<span className="formError">{errors.username}</span>)}

                            </>
                        )}

                        {/* Full Name (Register) */}
                        {formType === "signup" && currentFormPage == "1" && (
                            <>
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
                                        />
                                        <label htmlFor="fullname">Full Name</label>
                                    </div>
                                </div>

                                {/* error */}
                                {errors.fullname && (<span className="formError">{errors.fullname}</span>)}

                            </>
                        )}

                        {/* Password (Both) */}
                        {formType && currentFormPage == "1" && (
                            <>
                                <div className="input-group">
                                    <div className="field">
                                        <input
                                            id="password"
                                            placeholder=''
                                            name='password'
                                            autoComplete="off"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            type={showPassword ? "text" : "password"}
                                        />
                                        <label htmlFor="password">Password</label>

                                        <div className="eyeIconCont" onClick={() => setShowPassword(!showPassword)}>
                                            <span className="eyeIcon"> {showPassword ? <LuEye /> : <LuEyeClosed />}  </span>
                                        </div>

                                    </div>
                                </div>

                                {/* error */}
                                {errors.password && (<span className="formError">{errors.password}</span>)}

                            </>
                        )}

                        {/* Confirm Password — (Register) */}
                        {formType === "signup" && currentFormPage == "1" && (
                            <>
                                <div className="input-group">
                                    <div className="field">
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            placeholder=""
                                            autoComplete="off"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            type={showPassword ? "text" : "password"}
                                        />

                                        <label htmlFor="confirmPassword">Confirm Password</label>

                                        <div className="eyeIconCont" onClick={() => setShowPassword(!showPassword)}>
                                            <span className="eyeIcon"> {showPassword ? <LuEye /> : <LuEyeClosed />} </span>
                                        </div>

                                    </div>
                                </div>

                                {/* error */}
                                {errors.confirmPassword && (<span className="formError">{errors.confirmPassword}</span>)}

                            </>
                        )}

                        {/* calander - (Register)*/}
                        {formType === "signup" && currentFormPage == "2" && (
                            <>
                                <p className="page2label">You need to enter the date you were born</p>

                                <div className="input-group inputGroupPage2">
                                    <input
                                        id="dateOfBirth"
                                        name='dateOfBirth'
                                        placeholder=''
                                        autoComplete="off"
                                        value={formData.dateOfBirth}
                                        onChange={handleInputChange}
                                        type="date"
                                    />
                                </div>

                                {/* error */}
                                {errors.dateOfBirth && (<span className="formError">{errors.dateOfBirth}</span>)}

                            </>
                        )}

                        {/* gender radio - (Register)*/}
                        {formType === "signup" && currentFormPage == "2" && (
                            <>
                                <p className="page2label">Select your gender (optional)</p>

                                <div className="gender-container">
                                    <label className="gender-option">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="male"
                                            checked={formData.gender === "male"}
                                            onChange={handleInputChange}
                                        />
                                        <span>Male</span>
                                    </label>

                                    <label className="gender-option">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="female"
                                            checked={formData.gender === "female"}
                                            onChange={handleInputChange}
                                        />
                                        <span>Female</span>
                                    </label>

                                    <label className="gender-option">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="other"
                                            checked={formData.gender === "other"}
                                            onChange={handleInputChange}
                                        />
                                        <span>Other</span>
                                    </label>

                                    <label className="gender-option">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="none"
                                            checked={formData.gender === "none"}
                                            onChange={handleInputChange}
                                        />
                                        <span>none</span>
                                    </label>
                                </div>

                                {/* error */}
                                {errors.gender && (<span className="formError">{errors.gender}</span>)}

                            </>
                        )}

                        {/* aggriment text */}
                        <p className="agreement-text">
                            By {formType == "signup" ? "signup" : "login"} , you agree to our
                            <span className="link">Terms</span>,
                            <span className="link">Privacy</span>
                            and
                            <span className="link">Cookies Policy</span>.
                        </p>

                        {/* submit button for login*/}
                        {formType === "login" && currentFormPage == "1" && (

                            <button
                                type="submit"
                                className={`submitBtn btn-primary ${Object.values(formData).filter(v => v.trim() !== "").length >= 2 ? "btn-pri-active" : ""}`}
                                onClick={(e) => {
                                    handleFormSubmit(e);
                                }}>
                                Log In
                            </button>
                        )}

                        {/* move to next page button for signup form*/}
                        {formType === "signup" && currentFormPage == "1" && (

                            <button
                                type='button'
                                className={`submitBtn btn-primary ${Object.values(formData).filter(v => v.trim() !== "").length >= 5 ? "btn-pri-active" : ""}`}
                                onClick={() => {
                                    handleImageChange(); // notify parent component about form change
                                    handleNext(); // validate and move to next page
                                }}
                            >
                                Next
                            </button>

                        )}

                        {/* submit button for register*/}
                        {formType === "signup" && currentFormPage == "2" && (
                            <button
                                type="submit"
                                className={`submitBtn btn-primary ${Object.values(formData).filter(v => v.trim() !== "").length >= 6 ? "btn-pri-active" : ""}`}
                                onClick={(e) => {
                                    handleFormSubmit(e);
                                }}>
                                Sign Up
                            </button>
                        )}

                        {/* go back button */}
                        {formType === "signup" && currentFormPage == "2" && (
                            <button
                                className="backBtn"
                                onClick={() => {
                                    handleImageChange(); // notify parent component about form change
                                    handleFormProcess("page2")
                                }}
                            >
                                Go back
                            </button>
                        )}

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

                    <p
                        className="toggleText"
                        onClick={() => {
                            handleFormToggle();
                            toggleFormReset();
                            handleFormProcess("page2")
                        }}
                    >
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

export default RegisterLogin