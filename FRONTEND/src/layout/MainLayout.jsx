import React, { useState } from 'react'
import "./mainLayout.css"
import { Outlet } from 'react-router-dom';
import SideNavBar from '../Components/SideNavBar/SideNavBar';
import SearchModal from '../Components/Modal Component/SearchModal/SearchModal';
import NotificationModal from '../Components/Modal Component/NotificationModal/NotificationModal';

const MainLayout = () => {

    // state to make sidebar link active
    const [activeItem, setActiveItem] = useState("home");

    // state to store last active page
    const [lastPageItem, setLastPageItem] = useState("home");

    console.log("Active Item:", activeItem);
    console.log("Last Page Item:", lastPageItem);


    // function to handle pagelink click
    const handlePageLinkClick = (item) => {

        // set active link status
        setActiveItem(item);

        // store last page visit status
        setLastPageItem(item);

        // close the modal on page click
        setActiveModal(null);

        // make sidebar normal expande
        handleSBExpande();
    };

    // function to handle modalLink click
    const handleModalLinkClick = (modalname) => {

        // modal active dikhe
        setActiveItem(modalname);

        // toggle modal function if same close if new open
        toggleModal(modalname);

    }

    /* -------------------------------------- */

    // state to make sidebar collapse
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // to collapse sidevar
    const handleSBCollapse = () => {
        setIsSidebarCollapsed(true);
    }
    // to expande sidevar
    const handleSBExpande = () => {
        setIsSidebarCollapsed(false);
    }

    /* -------------------------------------- */

    // state to handle modal open and clsoe
    const [activeModal, setActiveModal] = useState(null);

    // function to open modal and auto close other
    const toggleModal = (modalName) => {

        // if the click is for same modal, close it
        if (activeModal === modalName) {

            // set active mdoal null to close modal
            setActiveModal(null);

            // set active item to last page when modal close
            setActiveItem(lastPageItem)

            // expande the side bar (dont expande if the last page was message because we want to keep ke collapsed)
            if (lastPageItem === "message") {
                handleSBCollapse();
            } else {
                handleSBExpande();
            }

        } else {

            // active the modal 
            setActiveModal(modalName);

            // collapse the side bar
            handleSBCollapse();

        }

    };

    // function to close modal and expande sidebar
    const closeModal = () => {

        // set modal name to null to close modal
        setActiveModal(null);

        // expande the side bar (dont expande if the last page was message because we want to keep ke collapsed)
        if (lastPageItem === "message") {
            handleSBCollapse();
        } else {
            handleSBExpande();
        }

        // set active item to last page when modal close
        setActiveItem(lastPageItem)

    };

    return (
        <>

            <div className="mainLayout">

                {/* navigation menu */}
                <div className="SideNavigationBar">

                    {/* side navigation bar */}
                    <SideNavBar
                        activeItem={activeItem} // active link status
                        handlePageLinkClick={handlePageLinkClick} // to handle page link click activity
                        handleModalLinkClick={handleModalLinkClick} // to handle modal link click activity
                        isSidebarCollapsed={isSidebarCollapsed} // status of sidebar collapse expande
                        handleSBCollapse={handleSBCollapse} // to collapse sidebar
                        handleSBExpande={handleSBExpande} // to expande sidebar
                    />

                    {/* search modal container  */}
                    <div className={`modalContainer searchModalContainer ${activeModal === 'search' ? 'active' : ''}`}
                        onClick={() => {
                            closeModal();
                        }}
                    >
                        <SearchModal />
                    </div>

                    {/* notification modal container */}
                    <div className={`modalContainer notificationModalContainer ${activeModal === 'notification' ? 'active' : ''}`}
                        onClick={() => {
                            closeModal();
                        }}
                    >
                        <NotificationModal />
                    </div>

                </div>

                {/* content outlet for different pages */}
                <div className="contentOutlet" >
                    <Outlet />
                </div>

            </div>

        </>
    )
};

export default MainLayout;

