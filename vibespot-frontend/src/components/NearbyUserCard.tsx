import {
  HeartIcon,
 
} from "@heroicons/react/24/outline";


interface NearbyUserCardProps {
  avatar: string;
  username: string;
  placeName: string;
  onHeart?: () => void;
  onFire?: () => void;
  onWave?: () => void;
  isLiked?: boolean;
}

const NearbyUserCard = ({
  avatar,
  username,
  placeName,
  onHeart,
  onFire,
  onWave,
  isLiked = false,
}: NearbyUserCardProps) => {
  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-4xl shadow-inner">
            {avatar}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {username}
            </h2>

            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                📍 {placeName}
              </span>

              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                Nearby
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          onClick={onHeart}
          className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 transition active:scale-95 ${
            isLiked
              ? "bg-rose-500 text-white hover:bg-rose-600"
              : "bg-rose-50 text-rose-600 hover:bg-rose-100"
          }`}
        >
          <HeartIcon className="h-5 w-5" />
          <span className="font-medium">{isLiked ? "Unlike" : "Like"}</span>
        </button>

        <button
          type="button"
          onClick={onFire}
          className="rounded-2xl bg-orange-50 px-4 py-3 text-orange-600 hover:bg-orange-100"
          aria-label={`Send fire vibe to ${username}`}
        >
          🔥
        </button>
        <button
          type="button"
          onClick={onWave}
          className="rounded-2xl bg-amber-50 px-4 py-3 text-amber-600 hover:bg-amber-100"
          aria-label={`Send wave vibe to ${username}`}
        >
          👋
        </button>
      </div>
    </div>
  );
};

export default NearbyUserCard;