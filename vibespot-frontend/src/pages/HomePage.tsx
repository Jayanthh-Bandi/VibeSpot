import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

import { getCurrentLocation } from "../services/locationService";
import CustomButton from "../components/CustomButton";
import { useAuth } from "../context/AuthContext";
import { checkIn } from "../services/checkInService";
import PageHeader from "../components/PageHeader";
import AppLayout from "../layouts/AppLayout";




const HomePage = () => {
  const navigate = useNavigate();
const [loading, setLoading] = useState(false);
  const { user } = useAuth();

const handleCheckIn = async () => {
  try {
    setLoading(true);

    // Step 1: Get location
    const location = await getCurrentLocation();

    // Step 2: Call API
    await checkIn({
      placeName: location.placeName,
      lat: location.latitude,
      lng: location.longitude,
    });

    // Step 3: Navigate
    navigate("/nearby");
  } catch (error: any) {
    console.error(error);

    toast.error(
      error.response?.data?.message ??
        "Unable to check in."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <AppLayout>
      {/* Header */}
     <PageHeader
  title="Welcome 👋"
  subtitle={user?.username}
  rightAction={
    <button
      onClick={() => navigate("/profile")}
      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 px-3 py-2 shadow-sm hover:shadow-md transition-all duration-200 border border-violet-100"
    >
      <span className="text-2xl">
        {user?.avatarEmoji}
      </span>
    </button>
  }
/>

      {/* Main */}
      <main className="flex flex-col items-center justify-center px-6 py-16 min-h-[calc(100vh-200px)]">
        <div className="mb-10 text-center">
          <div className="mb-8 relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-400 via-purple-400 to-indigo-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative text-8xl">📍</div>
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-3">
            Ready to Check In?
          </h1>

          <p className="mt-4 text-lg text-gray-600 max-w-md mx-auto">
            Discover amazing people around your current location and make meaningful connections.
          </p>
        </div>

        <div className="w-full max-w-sm">
          <CustomButton
          className="py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 hover:from-rose-600 hover:via-purple-600 hover:to-indigo-600"
  loading={loading}
  onClick={handleCheckIn}

>
  Check In Now
</CustomButton>
        </div>
      </main>
    </AppLayout>
  );
};

export default HomePage;