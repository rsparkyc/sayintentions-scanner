import React, { useEffect, useRef } from "react";

const Autoplayer = ({ latestAudioUrl, onAudioPlay, onAudioPause }) => {
  const audioRef = useRef(null);

  // This effect sets up and cleans up the event listeners
  useEffect(() => {
    const audio = audioRef.current;

    const handlePlay = () => onAudioPlay();
    const handlePause = () => onAudioPause();

    if (audio) {
      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);
      audio.addEventListener("ended", handlePause);
    }

    return () => {
      if (audio) {
        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("pause", handlePause);
        audio.removeEventListener("ended", handlePause);
      }
    };
  }, [onAudioPlay, onAudioPause]); // Only re-run this effect if these callbacks change

  // This effect handles playing new audio URLs
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && latestAudioUrl && audio.src !== latestAudioUrl) {
      audio.src = latestAudioUrl; // Directly set the source
      audio.load();
      audio.play().catch((e) => console.error("Error playing audio:", e));
    }
  }, [latestAudioUrl]); // Only re-run this effect if latestAudioUrl changes

  return (
    <audio ref={audioRef} controls preload="none">
      <source src={latestAudioUrl} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
};

export default Autoplayer;
