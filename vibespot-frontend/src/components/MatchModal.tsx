import CustomButton from "./CustomButton";

interface Props {
  open: boolean;

  username: string;

  avatar: string;

  onStartChat: () => void;

  onClose: () => void;
}

const MatchModal = ({
  open,
  username,
  avatar,
  onStartChat,
  onClose,
}: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-sm rounded-3xl bg-gradient-to-br from-white via-purple-50 to-white p-8 shadow-2xl border-2 border-purple-200 animate-in zoom-in-95 duration-300">
        <div className="text-center">

          <div className="text-7xl animate-bounce">
            🎉
          </div>

          <h2 className="mt-4 text-3xl font-bold bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
            It's a Match!
          </h2>

          <div className="mt-6 text-6xl relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-400 via-purple-400 to-indigo-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative">{avatar}</div>
          </div>

          <h3 className="mt-3 text-xl font-semibold text-gray-800">
            {username}
          </h3>

          <p className="mt-2 text-gray-600">
            You both sent vibes to each other. 💜
          </p>

          <div className="mt-8 space-y-3">

            <CustomButton
              onClick={onStartChat}
              className="bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 hover:from-rose-600 hover:via-purple-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Start Chat 💬
            </CustomButton>

            <CustomButton
              onClick={onClose}
              className="bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Later
            </CustomButton>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchModal;