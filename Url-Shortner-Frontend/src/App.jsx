import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { getApps } from "./utils/helper";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const CurrentApp = getApps();

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <CurrentApp />
      </Router>
    </>
  );
}

export default App;
