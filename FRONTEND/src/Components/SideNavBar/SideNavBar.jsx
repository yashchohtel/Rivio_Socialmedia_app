import "./SideNavBar.css"
import { Link } from 'react-router-dom';

import { IoHomeOutline } from "react-icons/io5";
import { IoHome } from "react-icons/io5";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MdOutlineExplore } from "react-icons/md";
import { MdExplore } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { FaBars } from "react-icons/fa6";
import { PiPaperPlaneTiltBold } from "react-icons/pi";
import { PiPaperPlaneTiltFill } from "react-icons/pi";
import MoreOption from "../Modal Component/MoreOptionModal/MoreOption";
import { useSelector } from "react-redux";

const SideNavBar = (props) => {

    // destructuring props
    const { activeItem, activeModal, isSidebarCollapsed, handlePageLinkClick, handleSBCollapse, handleSBExpande, handleModalLinkClick } = props

    /* -------------------------------------- */

    const { user } = useSelector((state) => state.auth);

    /* -------------------------------------- */

    return (
        <>
            <div className={`sidebar ${isSidebarCollapsed ? "active" : ""}`} >

                {/* navigation container */}
                <div className="navContainer">

                    {/* logo */}
                    <div className="logo">
                        {isSidebarCollapsed ?
                            (<img src="/images/icon-logo.png" className="icon_logo" alt="logo" />)
                            :
                            (<img src="/images/instalogowhite.png" className='name_logo' alt="logo" />)}
                    </div>

                    {/* logo small */}
                    <div className="logoSmall">
                        <img src="/images/icon-logo.png" className="icon_logo" alt="logo" />
                    </div>

                    {/* navigation links */}
                    <div className="navigationLinks">

                        {/* home */}
                        <Link to="/app"
                            onClick={() => {
                                handlePageLinkClick("home")
                            }}
                            className={`linkContainer home ${activeItem === "home" ? "active" : ""}`}
                        >
                            <span className="icon"> {activeItem === "home" ? <IoHome /> : <IoHomeOutline />} </span>

                            {!isSidebarCollapsed && (
                                <span className={`name ${activeItem === "home" ? "active" : ""}`}> Home </span>
                            )}

                        </Link>

                        {/* search */}
                        <div
                            className={`linkContainer search ${activeItem === "search" ? "active" : ""}`}
                            onClick={() => {
                                handleModalLinkClick("search")
                            }}
                        >
                            <span className="icon"> <FaMagnifyingGlass /> </span>

                            {!isSidebarCollapsed && (
                                <span className={`name ${activeItem === "search" ? "active" : ""}`}> Search </span>
                            )}

                        </div>

                        {/* Explore */}
                        <Link
                            to="/app/explore"
                            className={`linkContainer explore ${activeItem === "explore" ? "active" : ""}`}
                            onClick={() => {
                                handlePageLinkClick("explore")
                            }}
                        >
                            <span className="icon"> {activeItem === "explore" ? <MdExplore /> : <MdOutlineExplore />} </span>

                            {!isSidebarCollapsed && (
                                <span className={`name ${activeItem === "explore" ? "active" : ""}`}> Explore </span>
                            )}

                        </Link>

                        {/* message */}
                        <Link
                            to="/app/message"
                            className={`linkContainer message ${activeItem === "message" ? "active" : ""}`}
                            onClick={() => {
                                handlePageLinkClick("message")
                                handleSBCollapse()
                            }}
                        >
                            <span className="icon"> {activeItem === "message" ? <PiPaperPlaneTiltFill /> : <PiPaperPlaneTiltBold />} </span>

                            {!isSidebarCollapsed && (
                                <span className={`name ${activeItem === "message" ? "active" : ""}`}> Messages </span>
                            )}

                        </Link>

                        {/* Notification */}
                        <div
                            className={`linkContainer notification ${activeItem === "notification" ? "active" : ""}`}
                            onClick={() => {
                                handleModalLinkClick("notification")
                            }}
                        >
                            <span className="icon"> {activeItem === "notification" ? <FaHeart /> : <FaRegHeart />} </span>

                            {!isSidebarCollapsed && (
                                <span className={`name ${activeItem === "notification" ? "active" : ""}`}> Notifications </span>
                            )}

                        </div>

                        {/* create post */}
                        <div
                            className={`linkContainer createPost ${activeItem === "create" ? "active" : ""}`}
                            onClick={() => {
                                handleModalLinkClick("create")
                                handleSBExpande();
                            }}
                        >
                            <span className="icon"> <FaPlus /> </span>

                            {!isSidebarCollapsed && (
                                <span className={`name ${activeItem === "create" ? "active" : ""}`}> Create </span>
                            )}

                        </div>

                        {/* profile */}
                        <Link
                            to="/app/profile"
                            onClick={() => {
                                handlePageLinkClick("profile")
                            }}
                            className={`linkContainer profile ${activeItem === "profile" ? "active" : ""}`}
                        >
                            <span className="icon imageIcon">
                                {user.profileImage ?
                                    <img src={user.profileImage} alt="profile" />
                                    :
                                    <img src="/images/userprofile.jpeg" alt="profile" />
                                }
                            </span>

                            {!isSidebarCollapsed && (
                                <span className={`name ${activeItem === "profile" ? "active" : ""}`}> Profile </span>
                            )}

                        </Link>

                    </div>

                </div>

                {/* more option container */}
                <div
                    className={`linkContainer optionContainer ${activeItem === "more" ? "active" : ""}`}
                    onClick={() => {
                        handleModalLinkClick("more")
                        handleSBExpande();
                    }}
                >
                    <span className="icon"> <FaBars /> </span>

                    {!isSidebarCollapsed && (
                        <span className={`name ${activeItem === "more" ? "active" : ""}`}> More </span>
                    )}

                    {/* more option modal container */}
                    {activeModal === "more" && (
                        <div
                            className="moreOptionModalContainer"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <MoreOption />
                        </div>
                    )}

                    {/* overlay to cloe modal */}
                    <div
                        className={`overlay ${activeModal === "more" ? "active" : ""}`}
                        onClick={() => {
                            handleModalLinkClick("more")
                        }}
                    ></div>

                </div>

            </div>
        </>
    )
};

export default SideNavBar;
