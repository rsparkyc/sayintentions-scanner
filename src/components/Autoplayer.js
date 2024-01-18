import React, { useEffect, useRef } from "react";

const Autoplayer = ({ latestAudioUrl }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().catch((e) => {
        console.error("Error playing audio:", e);
      });
    }
  }, [latestAudioUrl]); // Dependency array ensures effect runs when latestAudioUrl changes

  return (
    <audio ref={audioRef} controls preload="none">
      <source src={latestAudioUrl} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
};

export default Autoplayer;
