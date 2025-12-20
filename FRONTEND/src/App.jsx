import { Route, Routes } from "react-router-dom";
import Welcome from "./pages/Welcome/Welcome";
import Home from "./pages/Home/Home";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadUser } from "./features/auth/authThunk";
import ProtectedRoute from "./Components/protectedRoutes/ProtectedRoute";
import PublicRoute from "./Components/protectedRoutes/PublicRoute";
import { CgSpinner } from "react-icons/cg";

function App() {

  // configure dispatch use to dispatch actions
  const dispatch = useDispatch();

  // Get auth loading state from Redux store
  const { authLoading } = useSelector((state) => state.auth);

  // effect to load user data
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  // if data is loading return a loader
  if (authLoading) {
    return (
      <div className="loader_2_container">
        <CgSpinner size={75} />
      </div>
    );
  }

  return (
    <>

      {/* routes wrapper */}
      <Routes>

        Route for welcome page [public]
        <Route path="/" element={<PublicRoute> <Welcome /> </PublicRoute>} />

        {/* Route for welcome page [protected] */}
        <Route path="/home" element={<ProtectedRoute>  <Home /> </ProtectedRoute>} />


      </Routes>

    </>
  )
}

export default App;