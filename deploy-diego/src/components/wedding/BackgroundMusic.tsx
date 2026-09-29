"use client";

import { useEffect, useRef, useState } from "react";
import { Music2, Pause } from "lucide-react";
import { wedding } from "@/content/wedding";

type Player = {
  playVideo: () => void;
  pauseVideo: () => void;
  setVolume: (volume: number) => void;
  destroy: () => void;
};
type YouTubeApi = {
  Player: new (element: HTMLElement, options: {
    videoId: string;
    host: string;
    playerVars: Record<string, string | number>;
    events: {
      onReady: () => void;
      onStateChange: (event: { data: number }) => void;
      onAutoplayBlocked: () => void;
      onError: () => void;
    };
  }) => Player;
};

let apiPromise: Promise<YouTubeApi> | undefined;
function loadYouTube() {
  const win = window as typeof window & {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  };
  if (win.YT?.Player) return Promise.resolve(win.YT);
  if (!apiPromise) {
    apiPromise = new Promise<YouTubeApi>((resolve, reject) => {
      const previous = win.onYouTubeIframeAPIReady;
      win.onYouTubeIframeAPIReady = () => {
        previous?.();
        if (win.YT) resolve(win.YT);
      };
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.onerror = () => { apiPromise = undefined; reject(new Error("YouTube unavailable")); };
      document.head.appendChild(script);
    });
  }
  return apiPromise;
}

export function BackgroundMusic() {
  const container = useRef<HTMLDivElement>(null);
  const player = useRef<Player | null>(null);
  const ready = useRef(false);
  const wantsMusic = useRef(false);
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let disposed = false;
    const start = () => {
      setOpened(true);
      wantsMusic.current = true;
      if (ready.current) player.current?.playVideo();
    };
    window.addEventListener("invitation:open", start);
    loadYouTube().then((api) => {
      if (disposed || !container.current) return;
      const mount = document.createElement("div");
      container.current.appendChild(mount);
      player.current = new api.Player(mount, {
        host: "https://www.youtube-nocookie.com",
        videoId: wedding.music.youtubeVideoId,
        playerVars: {
          playsinline: 1, loop: 1, playlist: wedding.music.youtubeVideoId,
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            if (disposed) return;
            ready.current = true;
            player.current?.setVolume(35);
            if (wantsMusic.current) player.current?.playVideo();
          },
          onStateChange: ({ data }) => {
            if (!disposed) setPlaying(data === 1);
          },
          onAutoplayBlocked: () => { if (!disposed) setPlaying(false); },
          onError: () => { if (!disposed) { setFailed(true); setPlaying(false); } },
        },
      });
    }).catch(() => { if (!disposed) setFailed(true); });
    return () => {
      disposed = true;
      window.removeEventListener("invitation:open", start);
      ready.current = false;
      player.current?.destroy();
      player.current = null;
    };
  }, []);

  function toggleMusic() {
    wantsMusic.current = !playing;
    if (!ready.current) return;
    if (playing) player.current?.pauseVideo();
    else player.current?.playVideo();
  }

  return (
    <>
      <div className="background-music-player" ref={container} aria-hidden="true" inert />
      {opened && (failed ? (
        <a className="music-toggle" href={`https://www.youtube.com/watch?v=${wedding.music.youtubeVideoId}`} target="_blank" rel="noreferrer">
          <Music2 size={18} aria-hidden="true" /> Escuchar en YouTube
        </a>
      ) : (
        <button className="music-toggle" type="button" onClick={toggleMusic} aria-label={playing ? "Pausar música" : "Reproducir música"} aria-pressed={playing}>
          {playing ? <Pause size={18} aria-hidden="true" /> : <Music2 size={18} aria-hidden="true" />}
          {playing ? "Pausar música" : "Reproducir música"}
        </button>
      ))}
    </>
  );
}
