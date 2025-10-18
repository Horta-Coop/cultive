import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import DashboardPage from "./pages/DashboardPage";

function App() {
  const {user, checkAuth, checkinAuth} = useUserStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if(checkinAuth) return <LoadingSpinner />
  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden" data-theme="lemonade">

      {user ? <></> : <Navbar />}
      
      <div className="">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={!user ? <Navigate to="/login"/> : <DashboardPage />} />
          <Route path="/signup" element={!user ? <SignupPage />: <Navigate to="/dashboard" />} />
          <Route path="/login" element={!user ? <LoginPage />: <Navigate to="/dashboard" />} />
        </Routes>
      </div>
      <Toaster/>
    </div>
  );
}

export default App;
