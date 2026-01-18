import React, { useState, useRef } from 'react'
import "./createPostModal.css"
import { IoClose } from "react-icons/io5";
import { FaArrowLeftLong } from "react-icons/fa6";
import DiscardModal from '../DiscardModal/DiscardModal';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useDispatch, useSelector } from "react-redux";
import { IoLocationOutline } from "react-icons/io5";
import { createPost } from '../../../features/posts/postThunk';

const CreatePostModal = ({ closeModal }) => {

    /* -------------------------------------- */

    // get user state form store
    const { user } = useSelector((state) => state.auth);

    // initialize use dispatch
    const dispatch = useDispatch();

    /* -------------------------------------- */

    // refrence of select file input
    const fileInputRef = useRef(null);

    // state to store file
    const [files, setFiles] = useState([]);

    // state to store text daa location,caption
    const [postData, setPostData] = useState({
        caption: "",
        location: "",
    });

    // to handle text input change
    const handleTextChange = (e) => {

        // getting name and value from event target
        const { name, value } = e.target;

        setPostData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };

    // handleFileInputOpen
    const handleFileInputOpen = () => {
        fileInputRef.current.click()
    };

    // function to handle choose file input change
    const handleFileInputChange = (e) => {

        // getting all files user selected
        const newFiles = [...e.target.files]

        // get files from event and store them in files state
        setFiles(newFiles)

        // move to edit window if images is selected - select → edit
        if (newFiles.length > 0) {
            setWindowStep("edit")
        }

    };

    // hande post submit
    const handlePostSubmit = () => {

        // dispatch
        dispatch(createPost({ files, postData, }));

    };

    /* -------------------------------------- */
    // state to track WindowStep - "select" | "edit" | "post"
    const [windowStep, setWindowStep] = useState("select")

    // state to store discard modal open claose
    const [discardOpen, setDiscardOpen] = useState(false);

    /* -------------------------------------- */

    // open discard modal
    const openDiscardModal = () => {
        setDiscardOpen(true)
    }

    // close discard modal
    const closeDiscardModal = () => {
        setDiscardOpen(false)
    }

    // handle modal overlay click
    const handleCreateModalClose = () => {

        // if step is not equal to select then firs ask to dicard image upload
        if (windowStep !== "select") {

            // open discard modal
            openDiscardModal();

        } else {

            // close modal
            closeModal()

        }

    };

    // handle discard click
    const handleDiscardClick = () => {

        // cleare files state
        setFiles([]);

        // close discard modal
        closeDiscardModal();

        // close create image modal
        closeModal();

    }

    /* -------------------------------------- */

    return (

        <>

            {/* discard modal */}
            {discardOpen && (
                <DiscardModal
                    closeDiscardModal={closeDiscardModal} // to close modal
                    handleDiscardClick={handleDiscardClick} // handle discard click
                />
            )}

            <div className="createModal overlay" onClick={() => handleCreateModalClose()} >

                <div className="modal" onClick={(e) => e.stopPropagation()} >

                    {/* Header */}
                    <div className="modal-header">

                        {/* select area header content*/}
                        {windowStep === "select" && (
                            <>
                                {/* title */}
                                <h2 className='title'>Create new post</h2>

                                <span
                                    className="headerIcon"
                                    onClick={() => {
                                        handleCreateModalClose()
                                    }}
                                > <IoClose />
                                </span>
                            </>
                        )}

                        {/* select area header content*/}
                        {windowStep === "edit" && (
                            <>

                                {/* back icon */}
                                <span className="headerIcon"
                                    onClick={openDiscardModal}
                                >
                                    <FaArrowLeftLong />
                                </span>

                                {/* title */}
                                <h2 className='title'>Edit</h2>

                                {/* next button */}
                                <span className="next"
                                    onClick={() => setWindowStep("post")}
                                >
                                    Next
                                </span>

                            </>
                        )}

                        {/* post area header content*/}
                        {windowStep === "post" && (
                            <>
                                {/* back icon */}
                                <span className="headerIcon"
                                    onClick={() => setWindowStep("edit")}
                                >
                                    <FaArrowLeftLong />
                                </span>

                                {/* title */}
                                <h2 className='title'>Create Post</h2>

                                {/* next button */}
                                <span className="next"
                                    onClick={handlePostSubmit}
                                >
                                    Share
                                </span>
                            </>
                        )}

                    </div>

                    {/* body - upload area */}
                    {windowStep === "select" && (

                        <div className="select-area">

                            {/* play icon image */}
                            <div className="imgIcon">
                                <img src="/images/imageVideo.webp" className="" alt="logo" />
                            </div>

                            {/* description */}
                            <p>Drag photos and videos here</p>

                            {/* button to select iage */}
                            <button className='btn-blue'
                                onClick={handleFileInputOpen}
                            >
                                Select from computer
                            </button>

                            {/* input to select file */}
                            <input type="file"
                                hidden
                                multiple
                                ref={fileInputRef}
                                onChange={handleFileInputChange}
                            />

                        </div>

                    )}

                    {/* body - edit area */}
                    {windowStep === "edit" && (

                        // edit area
                        <div className="edit-area">

                            {/* image preview Container */}
                            <div className="ImagePreviewCont">

                                {/* if image is only one */}
                                {files.length === 1 && (
                                    <div className="Image">
                                        <img src={URL.createObjectURL(files[0])} alt="preview" />
                                    </div>
                                )}

                                {/* if image is more than one - swiper.js slider */}
                                {files.length > 1 && (
                                    <>
                                        <Swiper
                                            modules={[Navigation, Pagination]}
                                            loop={true}
                                            navigation
                                            pagination={{ clickable: true }}
                                            watchOverflow={true}
                                            className="imageSwiper"
                                        >
                                            {files.map((file, i) => (
                                                <SwiperSlide key={i}>
                                                    <div className="Image">
                                                        <img src={URL.createObjectURL(file)} />
                                                    </div>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </>
                                )}

                            </div>

                        </div>
                    )}

                    {/* body - post area */}
                    {windowStep === "post" && (

                        // image post area
                        <div className="post-area">

                            {/* image preview Container */}
                            <div className="ImagePreviewCont">

                                {/* if image is only one */}
                                {files.length === 1 && (
                                    <div className="Image">
                                        <img src={URL.createObjectURL(files[0])} alt="preview" />
                                    </div>
                                )}

                                {/* if image is more than one - swiper.js slider */}
                                {files.length > 1 && (
                                    <>
                                        <Swiper
                                            modules={[Navigation, Pagination]}
                                            navigation
                                            loop={true}
                                            pagination={{ clickable: true }}
                                            watchOverflow={true}
                                            className="imageSwiper"
                                        >
                                            {files.map((file, i) => (
                                                <SwiperSlide key={i}>
                                                    <div className="Image">
                                                        <img src={URL.createObjectURL(file)} />
                                                    </div>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </>
                                )}

                            </div>

                            {/* post content writing area */}
                            <div className="contentWritingArea">

                                {/* user row */}
                                <div className="userRow">

                                    {/* profile image  */}
                                    <div className="avatar">
                                        {user.profileImage ?
                                            <img src={user.profileImage} alt="profile" />
                                            :
                                            <img src="/images/userprofile.jpeg" alt="profile" />
                                        }
                                    </div>

                                    {/* user name */}
                                    <span className="username">{user.username}</span>

                                </div>

                                {/* caption */}
                                <textarea
                                    className="captionInput"
                                    placeholder="Write a caption..."
                                    maxLength={2200}
                                    name='caption'
                                    onChange={(e) => handleTextChange(e)}
                                    value={postData.caption}
                                />

                                <div className="captionFooter">
                                    <span className="emoji"></span>
                                    <span className="count">{postData.caption.trim().length} / 2,200</span>
                                </div>

                                {/* location */}
                                <div className="locationRow">
                                    <input
                                        type="text"
                                        placeholder="Add location"
                                        className="locationInput"
                                        name='location'
                                        onChange={(e) => handleTextChange(e)}
                                        value={postData.location}
                                        autoComplete='off'

                                    />
                                    <span className="locationIcon"> <IoLocationOutline /> </span>
                                </div>

                                {/* note */}
                                <p className="note"> Tag feature will be added soon</p>

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </>
    )
};

export default CreatePostModal