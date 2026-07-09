import React, { useMemo } from "react";

export default function BackgroundMesh() {
  const particles = useMemo(() => {
    return Array.from({ length: 28 }).map((_, idx) => ({
      id: idx,
      size: Math.random() * 5 + 3,
      top: `${Math.random() * 95}%`,
      left: `${Math.random() * 95}%`,
      duration: Math.random() * 8 + 8,
      delay: Math.random() * -6,
      opacity: Math.random() * 0.45 + 0.15,
      color: idx % 3 === 0 ? "#4ADE80" : idx % 3 === 1 ? "#06B6D4" : "#22C55E",
    }));
  }, []);

  return (
    <div className="bg-mesh-container" aria-hidden="true">
      {/* Cinematic Ambient Gradient Blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* Floating Glowing Dots / Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            backgroundColor: p.color,
            top: p.top,
            left: p.left,
            filter: "blur(1px)",
            boxShadow: `0 0 12px ${p.color}`,
            animation: `floatBlob ${p.duration}s infinite ease-in-out alternate`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}
