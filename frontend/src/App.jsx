import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const {checkAuth, checkinAuth} = useUserStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if(checkinAuth) return <LoadingSpinner />
  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden" data-theme="lemonade">
      <div className="">
        <AppRoutes />
      </div>
      <Toaster/>
    </div>
  );
}

export default App;
