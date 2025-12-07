import { Route, Routes } from "react-router-dom";
import Welcome from "./pages/Welcome/Welcome";

function App() {

  return (
    <>

      {/* routes wrapper */}
      <Routes>

        {/* Route for welcome page */}
        <Route path="/" element={<Welcome />} />

      </Routes>

    </>
  )
}

export default App;