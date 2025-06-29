// pages/TopArtists.tsx
import React, { Suspense, lazy } from "react";

const TopArtistsContent = lazy(() => import("../components/TopArtistsContent"));

const TopArtists: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-white text-xl font-semibold pb-2">
        Top Featured Artists
      </h2>
      <div className="mx-auto container">
        <Suspense fallback={<SpinnerFallback />}>
          <TopArtistsContent />
        </Suspense>
      </div>
    </div>
  );
};

export default TopArtists;

// Spinner fallback component
const SpinnerFallback = () => (
  <div className="flex justify-center items-center h-40 w-full">
    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-purple-500"></div>
  </div>
);
