import { Route, Routes } from "react-router-dom";
import Welcome from "./pages/Welcome/Welcome";
import Home from "./pages/Home/Home";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadUser } from "./features/auth/authThunk";
import ProtectedRoute from "./Components/protectedRoutes/ProtectedRoute";
import PublicRoute from "./Components/protectedRoutes/PublicRoute";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { PiSpinnerGapBold } from "react-icons/pi";
import MainLayout from "./layout/MainLayout";
import Explore from "./pages/Explore/Explore";
import Profile from "./pages/Profile/Profile";
import Message from "./pages/Message/Message";

function App() {

  /* -------------------------------------- */

  // configure dispatch use to dispatch actions
  const dispatch = useDispatch();

  // Get auth loading state from Redux store
  const { authLoading } = useSelector((state) => state.auth);

  // effect to load user data
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  /* -------------------------------------- */

  // if data is loading return a loader
  if (authLoading) {
    return (
      <div className="loader_2_container">
        <span className='loder_2'> <PiSpinnerGapBold size={45} /> </span>
      </div>
    );
  }

  return (
    <>

      {/* routes wrapper */}
      <Routes>

        {/* Route for welcome page [public] */}
        <Route path="/" element={<PublicRoute> <Welcome /> </PublicRoute>} />

        {/* Route for main layout page [protected] */}
        <Route path="/app" element={<ProtectedRoute>  <MainLayout /> </ProtectedRoute>}>

          {/* main home page default */}
          <Route index element={<Home />} />

          {/* explore page */}
          <Route path="explore" element={<Explore />} />

          {/* messages page */}
          <Route path="message" element={<Message />} />

          {/* profile page */}
          <Route path="profile" element={<Profile />} />

        </Route>

      </Routes>

    </>
  )
}

export default App;