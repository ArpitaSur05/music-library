// components/TopArtistsContent.tsx
import React, { useEffect, useState } from "react";
import { useSpotifyToken } from "../contexts/SpotifyContext";

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

const TopArtistsContent: React.FC = () => {
  const { token } = useSpotifyToken();
  const [topArtists, setTopArtists] = useState<EnrichedArtist[]>([]);

  useEffect(() => {
    if (!token) return;

    const fetchTopArtists = async () => {
      try {
        const res = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&tag=disco&api_key=${
            import.meta.env.VITE_AUDIODB_API_KEY
          }&limit=20&format=json`
        );
        const data = await res.json();
        const artists: Artist[] = data.topartists.artist;

        const enriched = await Promise.all(
          artists.map(async (artist) => {
            try {
              const spotifyRes = await fetch(
                `https://api.spotify.com/v1/search?q=${encodeURIComponent(
                  artist.name
                )}&type=artist&limit=1`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              const spotifyData = await spotifyRes.json();
              const image =
                spotifyData.artists?.items?.[0]?.images?.[0]?.url || "";

              return { ...artist, spotifyImage: image };
            } catch {
              return { ...artist, spotifyImage: "" };
            }
          })
        );

        setTopArtists(enriched);
      } catch (error) {
        console.error("Error fetching top artists:", error);
      }
    };

    fetchTopArtists();
  }, [token]);

  return (
    <div className="flex flex-wrap gap-6 justify-start">
      {topArtists.map((artist) => (
        <div
          key={artist.mbid || artist.name}
          className="flex flex-col items-center text-white w-[100px]"
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
  );
};

export default TopArtistsContent;
