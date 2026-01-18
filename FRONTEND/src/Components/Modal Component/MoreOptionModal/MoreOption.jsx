import React, { useState } from 'react'
import "./moreOption.css"

import { IoSettingsOutline } from "react-icons/io5";
import { LuSquareActivity } from "react-icons/lu";
import { MdBookmarkBorder } from "react-icons/md";
import { GoMoon } from "react-icons/go";
import { MdLogout } from "react-icons/md";
import { IoArrowBackOutline } from "react-icons/io5";


const MoreOption = () => {

    // state to store moreOption view status
    const [viewSubMenu, setViewSubMenu] = useState(false)

    return (
        <>

            {/* more option modal */}
            <div className="moreOptionModal">

                {/* more option main menu */}
                <div className={`menuView mainMenu ${viewSubMenu ? "active" : ""}`} >

                    {/* setting */}
                    <div className="moreOptionLink setting">
                        {/* icon */}
                        <span className="moreOptIcon"> <IoSettingsOutline /> </span>
                        {/* name */}
                        <p className="optionName"> setting </p>
                    </div>

                    {/* yout activity */}
                    <div className="moreOptionLink activity">
                        {/* icon */}
                        <span className="moreOptIcon"> <LuSquareActivity /> </span>
                        {/* name */}
                        <p className="optionName"> your activity </p>
                    </div>

                    {/* saved */}
                    <div className="moreOptionLink saved">
                        {/* icon */}
                        <span className="moreOptIcon"> <MdBookmarkBorder /> </span>
                        {/* name */}
                        <p className="optionName"> saved </p>
                    </div>

                    {/* switch appearance */}
                    <div
                        className="moreOptionLink appearance"
                        onClick={() => {
                            setViewSubMenu(true)
                        }}
                    >
                        {/* icon */}
                        <span className="moreOptIcon"> <GoMoon /> </span>
                        {/* name */}
                        <p className="optionName"> switch appearance </p>
                    </div>

                    {/* rule */}
                    <div className="rule"></div>

                    {/* switch appearance */}
                    <div className="moreOptionLink logout">
                        {/* icon */}
                        <span className="moreOptIcon"> <MdLogout /> </span>
                        {/* name */}
                        <p className="optionName"> logout </p>
                    </div>

                </div>

                {/* apperance setting sub menu */}
                <div className={`menuView appearanceMenu ${viewSubMenu ? "active" : ""}`} >

                    <div
                        className="appearanceHeader"
                        onClick={() => {
                            setViewSubMenu(false)
                        }}
                    >
                        <div className="headLeft">
                            <span className="moreOptIcon"> <IoArrowBackOutline /> </span>
                            <span className="optionName">Switch appearance</span>
                        </div>
                        <span className="moreOptIcon"> <GoMoon /> </span>

                    </div>

                    {/* rule */}
                    <div className="rule"></div>

                    <div className="moreOptionLink toggleRow">

                        <p className='optionName'>Dark mode</p>

                        <div className="toggle">
                            <label className="switch">
                                <input type="checkbox" id="toggle"/>
                                <span className="slider"></span>
                            </label>
                        </div>

                    </div>

                </div>

            </div>

        </>
    )
};

export default MoreOption