import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const { checkAuth, checkinAuth } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkinAuth) return <LoadingSpinner />;
  return (
    <div
      className="flex flex-col min-h-screen w-full bg-base-100 text-base-content overflow-x-hidden"
      data-theme="light"
    >
      <main className="w-full flex justify-center items-start sm:items-center">
        <div className="w-full">
          <AppRoutes />
        </div>
      </main>
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <Toaster />
      </div>
    </div>
  );
}

export default App;
