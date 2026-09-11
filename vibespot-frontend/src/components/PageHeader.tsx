import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  rightAction?: ReactNode;
}

const PageHeader = ({
  title,
  subtitle,
  showBackButton = false,
  rightAction,
}: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 border-b border-violet-100 bg-white/80 backdrop-blur-lg shadow-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <button
              onClick={() => navigate(-1)}
              className="rounded-lg p-2 transition hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-700" />
            </button>
          )}

          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">{title}</h1>

            {subtitle && (
              <p className="text-sm text-gray-600 font-medium">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {rightAction}
      </div>
    </header>
  );
};

export default PageHeader;