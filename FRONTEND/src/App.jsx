import { Route, Routes } from "react-router-dom";
import Welcome from "./pages/Welcome/Welcome";
import Home from "./pages/Home/Home";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadUser } from "./features/auth/authThunk";
import ProtectedRoute from "./Components/protectedRoutes/ProtectedRoute";
import PublicRoute from "./Components/protectedRoutes/PublicRoute";
import { PiSpinnerGapBold } from "react-icons/pi";
import MainLayout from "./layout/MainLayout";
import Explore from "./pages/Explore/Explore";
import Profile from "./pages/Profile/Profile";
import Message from "./pages/Message/Message";
import SavePosts from "./pages/SavePosts/SavePosts";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { socket } from "./socket/socket";
import { updatePostCommentsCount, updatePostLikes } from "./features/posts/postSlice";
import { addCommentFromSocket, addReplyFromSocket } from "./features/comment/commentSlice";
import { getUnreadNotificationCount } from "./features/notification/notificationThunk";
import { incrementUnreadCount } from "./features/notification/notificationSlice";

function App() {

  /* -------------------------------------- */

  // configure dispatch use to dispatch actions
  const dispatch = useDispatch();

  /* -------------------------------------- */

  // Get auth loading state from Redux store
  const { authLoading, user } = useSelector((state) => state.auth);

  // effect to load user data
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  /* -------------------------------------- */

  // effect to load unread notificaion count only if user id loggedin
  useEffect(() => {
    if (user) {
      dispatch(getUnreadNotificationCount());
    }
  }, [user]);

  /* -------------------------------------- */

  // effect to register user with socket server
  useEffect(() => {

    const handleConnect = () => {
      if (user?.id) {
        socket.emit("register", user.id);
      }
    };

    // run when socket connects/reconnects
    socket.on("connect", handleConnect);

    // ALSO run immediately if already connected
    if (socket.connected && user?.id) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
    };

  }, [user]);

  /* -------------------------------------- */

  // effect to show notifications received from socket server
  useEffect(() => {

    socket.on("notification", (notification) => {

      // notificaton toast
      toast(`New notification ${notification.type}`, { className: "custom-toast" });

      // reducer to increase unread notificaion count
      dispatch(incrementUnreadCount());

    });

    return () => {
      socket.off("notification");
    };

  }, []);

  /* -------------------------------------- */

  // effect to emit post_like_update on visible users feed
  useEffect(() => {

    socket.on("post_like_update", ({ postId, likesCount }) => {
      dispatch(updatePostLikes({ postId, likesCount }));
    });

    return () => socket.off("post_like_update");

  }, []);

  // effect to emit post_comment_update on visible users feed
  useEffect(() => {

    socket.on("post_comment_update", ({ postId, comment }) => {

      // update comment expect sender (sender updated by optimistic)
      dispatch(addCommentFromSocket({ postId, comment }));

      // update comment count expect sender (sender updated by optimistic)
      dispatch(updatePostCommentsCount({ postId, incrementBy: 1 }));

    });

    return () => socket.off("post_comment_update");

  }, []);

  // effect to emit comment_reply_update on visible users feed
  useEffect(() => {

    socket.on("comment_reply_update", ({ postId, commentId, reply }) => {

      // update comment expect sender (sender updated by optimistic)
      dispatch(addReplyFromSocket({ postId, commentId, reply }));

      // update comment count expect sender (sender updated by optimistic)
      dispatch(updatePostCommentsCount({ postId, incrementBy: 1 }));

    });

    return () => socket.off("comment_reply_update");

  }, []);

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

      {/* react toast container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        closeOnClick={true}
        closeButton={true}
        pauseOnHover={true}
        draggable={false}
        theme="dark"
      />

      {/* routes wrapper */}
      <Routes>

        {/* Route for welcome page [public] */}
        <Route path="/" element={<PublicRoute> <Welcome /> </PublicRoute>} />

        {/* Route for main layout page [protected] */}
        <Route path="/app" element={<ProtectedRoute>  <MainLayout /> </ProtectedRoute>}>

          {/* main home page default - (and wrap home into KeepAlive to stop un mounting on page chage) */}
          <Route index element={<Home />} />

          {/* explore page */}
          <Route path="explore" element={<Explore />} />

          {/* messages page */}
          <Route path="message" element={<Message />} />

          {/* profile page for self */}
          <Route path="profile" element={<Profile />} />

          {/* profile page for other user*/}
          <Route path="profile/:id" element={<Profile />} />

          {/* save post page */}
          <Route path="bookmark" element={<SavePosts />} />

        </Route>

      </Routes>

    </>
  )
}

export default App;