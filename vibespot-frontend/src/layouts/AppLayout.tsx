import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import MatchModal from "../components/MatchModal";
import { useSocket } from "../hooks/SocketContext";
interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {


  const navigate = useNavigate();

   const {
    activeMatch,
    clearMatch,
    } = useSocket();
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      <MatchModal
  open={!!activeMatch}
  username={activeMatch?.otherUser.username ?? ""}
  avatar={activeMatch?.otherUser.avatar_emoji ?? ""}
  onClose={clearMatch}
  onStartChat={() => {
    navigate(`/chat/${activeMatch?.matchId}`);

    clearMatch();
  }}
/>
    </div>
  );
};

export default AppLayout;