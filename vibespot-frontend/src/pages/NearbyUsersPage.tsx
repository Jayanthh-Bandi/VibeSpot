import { useCallback, useEffect, useState } from "react";

import CustomButton from "../components/CustomButton";
import LoadingSpinner from "../components/LoadingSpinner";
import NearbyUserCard from "../components/NearbyUserCard";

import { nearbyService } from "../services/nearbyService";
import type { NearbyUser } from "../types/nearby";
import PageHeader from "../components/PageHeader";
import { checkInService } from "../services/checkInService";
import { useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import { sendVibe } from "../services/vibeService";
import NotificationBell from "../components/NotificationBell";
import { useSocket } from "../hooks/SocketContext";
import PendingVibesDrawer from "../components/PendingVibesDrawer";


import {
  getPendingVibes,
} from "../services/vibeService";


import PendingVibeCard from "../components/PendingVibeCard";
const NearbyUsersPage = () => {
  const [users, setUsers] = useState<NearbyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
const [isPendingVibesOpen, setIsPendingVibesOpen] =
  useState(false);
  

const [loadingVibes, setLoadingVibes] =
  useState(false);

  const loadPendingVibes = async () => {
  try {
    setLoadingVibes(true);

    const response =
      await getPendingVibes();

    addPendingVibes(
      response.pendingVibes
    );
  } catch (error) {
    console.error(error);
  } finally {
    setLoadingVibes(false);
  }
};



 const {
  unreadCount,
  clearUnread,
  incomingVibes,
  addPendingVibes,
  showMatch
} = useSocket();


const handleNotificationClick = async () => {
  clearUnread();

  await loadPendingVibes();

  setIsPendingVibesOpen(true);
};



    const handleCheckOut = async () => {
  const confirmed = window.confirm(
    "Are you sure you want to check out?"
  );

  if (!confirmed) {
    return;
  }

  try {
    setCheckingOut(true);

    await checkInService.checkOut();

    navigate("/");
  } catch (error: any) {
    alert(
      error.response?.data?.message ??
      "Unable to check out."
    );
  } finally {
    setCheckingOut(false);
  }
};


const handleSendVibe = async (
  receiverId: string,
  username: string,
  avatarEmoji: string,
  emoji: string
) => {
  try {
    const response = await sendVibe({
      receiverId,
      emoji,
    });

    if (response.matched) {
      showMatch({
        matchId: response.chatRoomId!,
        otherUser: {
          id: receiverId,
          username,
          avatar_emoji: avatarEmoji,
        },
      });
    } else {
      alert(response.message);
    }
  } catch (error: any) {
    alert(
      error.response?.data?.message ??
      "Unable to send vibe."
    );
  }
};


const navigate = useNavigate();

const [checkingOut, setCheckingOut] =
  useState(false);



  const loadNearbyUsers = useCallback(async () => {
    try {
      const response = await nearbyService.getNearbyUsers();
      setUsers(response.users);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      await loadNearbyUsers();

      setLoading(false);
    };

    fetchUsers();
  }, [loadNearbyUsers]);

  const handleRefresh = async () => {
    setRefreshing(true);

    await loadNearbyUsers();

    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
     <AppLayout>
        <PageHeader
  title="Nearby Users"
  subtitle="Meet people around you"
  rightAction={
    <div className="flex items-center gap-3">
      <NotificationBell
        count={unreadCount}
        onClick={handleNotificationClick}
      />

      <CustomButton
        fullWidth={false}
        loading={refreshing}
        onClick={handleRefresh}
      >
        Refresh
      </CustomButton>
    </div>
  }
/>
     

      {users.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <div className="text-6xl">📍</div>

          <h2 className="mt-4 text-xl font-semibold">
            Nobody is nearby
          </h2>

          <p className="mt-2 text-gray-500">
            Try refreshing after a few moments.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((item) => (
  <NearbyUserCard
    key={item.id}
    avatar={item.users.avatar_emoji}
    username={item.users.username}
    placeName={item.place_name}
    onHeart={() =>
  handleSendVibe(
    item.users.id,
    item.users.username,
    item.users.avatar_emoji,
    "❤️"
  )
}

onFire={() =>
  handleSendVibe(
    item.users.id,
    item.users.username,
    item.users.avatar_emoji,
    "🔥"
  )
}

onWave={() =>
  handleSendVibe(
    item.users.id,
    item.users.username,
    item.users.avatar_emoji,
    "👋"
  )
}
  />
))}
        </div>
      )}

        <div className="mx-auto max-w-2xl">
    <CustomButton
      variant="danger"
      loading={checkingOut}
      onClick={handleCheckOut}
    >
      Check Out
    </CustomButton>
  </div>


  <PendingVibesDrawer
  open={isPendingVibesOpen}
  onClose={() => setIsPendingVibesOpen(false)}
>
  {loadingVibes ? (
  <div className="flex justify-center p-8">
    <LoadingSpinner />
  </div>
) : incomingVibes.length === 0 ? (
  <div className="p-8 text-center text-gray-500">
    No pending vibes ❤️
  </div>
) : (
  incomingVibes.map((vibe) => (
  <PendingVibeCard
    key={vibe.sender.id}
    username={vibe.sender.username}
    avatarEmoji={vibe.sender.avatar_emoji}
    emoji={vibe.emoji}
    createdAt={vibe.created_at}
  />
))
)}
</PendingVibesDrawer>



    </AppLayout>
  );
};

export default NearbyUsersPage;