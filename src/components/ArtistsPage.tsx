import React, { useEffect, useState } from "react";

type ArtistImage = {
  "#text": string;
  size: string;
};

type Artist = {
  name: string;
  mbid?: string;
  url: string;
  streamable: string;
  image: ArtistImage[];
};

type EnrichedArtist = Artist & {
  spotifyImage?: string;
};

const SPOTIFY_TOKEN = "BQBoHniwCzoRDGK4P13hEAYNgu2XZeP3tqNrWnhLFu_H9ryztSQMV08DSDyaCkII3vZs3n0O942Mg4Ls7gZrhJX4jm1PmZm06dECnaxlXRW9ddP-s670WACX_tZOs2gJWr6_3jUI3qk"; // 🔒 Replace with actual token

const TopArtists: React.FC = () => {
  const [topArtists, setTopArtists] = useState<EnrichedArtist[]>([]);

  useEffect(() => {
    const fetchTopArtists = async () => {
      try {
        const res = await fetch(
          "https://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&tag=disco&api_key=e0d697f15e76a5444e2d4949feb6c000&format=json"
        );
        const data = await res.json();
        const artists: Artist[] = data.topartists.artist.slice(0, 10);

        // Fetch Spotify images in parallel
        const enriched = await Promise.all(
          artists.map(async (artist) => {
            try {
              const spotifyRes = await fetch(
                `https://api.spotify.com/v1/search?q=${encodeURIComponent(
                  artist.name
                )}&type=artist&limit=1`,
                {
                  headers: {
                    Authorization: `Bearer ${SPOTIFY_TOKEN}`,
                  },
                }
              );
              const spotifyData = await spotifyRes.json();
              const image =
                spotifyData.artists?.items?.[0]?.images?.[0]?.url || "";

              return {
                ...artist,
                spotifyImage: image,
              };
            } catch {
              return {
                ...artist,
                spotifyImage: "",
              };
            }
          })
        );

        setTopArtists(enriched);
      } catch (error) {
        console.error("Error fetching top artists:", error);
      }
    };

    fetchTopArtists();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-white text-xl font-semibold">Top Artists</h2>
      <div className="flex gap-6 overflow-x-auto pb-2">
        {topArtists.map((artist) => (
          <div
            key={artist.mbid || artist.name}
            className="flex flex-col items-center text-white min-w-[100px]"
          >
            <img
              src={
                artist.spotifyImage ||
                artist.image.find((img) => img.size === "large")?.["#text"] ||
                "https://via.placeholder.com/150"
              }
              alt={artist.name}
              className="w-20 h-20 rounded-full object-cover mb-2"
            />
            <a
              href={artist.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white hover:underline text-center"
            >
              {artist.name}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default TopArtists;
