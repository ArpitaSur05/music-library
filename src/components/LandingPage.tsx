import Navbar from "./Navbar";
import { BsSearchHeart } from "react-icons/bs";
import { useState } from "react";
import TopArtists from "./ArtistsPage";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("Artists");
  const tabs = ["Artists", "Albums", "Tracks"];

  return (
    <>
      
      <div className="bg-[#181111] h-screen flex flex-col items-center overflow-hidden">
      <Navbar />
        {/* Search bar */}
        <div className="relative w-full max-w-5xl mt-8">
          <input
            type="text"
            placeholder="Search for artists, albums or tracks"
            className="w-full pl-10 pr-4 py-2 rounded-md bg-[#382929] text-white focus:outline-none focus:ring-2 focus:ring-white"
          />
          <BsSearchHeart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white text-lg" />
        </div>

        {/* Tabs */}
        <div className="w-full max-w-5xl mt-4 flex gap-6 border-b border-[#3a2d2d] relative">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-2 text-sm font-semibold ${
                activeTab === tab ? "text-white" : "text-gray-400"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute left-0 -bottom-[1px] w-full h-[3px] bg-white rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Artists Section */}
        {activeTab === "Artists" && (
          <div className="mt-4 w-full max-w-5xl h-[60vh] overflow-y-auto pr-2">
            <TopArtists />
          </div>
        )}
      </div>
    </>
  );
}
