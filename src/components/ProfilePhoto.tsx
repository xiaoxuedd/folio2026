import { useState, useRef, useEffect } from 'react';
import './ProfilePhoto.css';

interface ProfilePhotoProps {
  imageSrc?: string;
}

export function ProfilePhoto({ imageSrc }: ProfilePhotoProps) {
  const [isHovering, setIsHovering] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20; // -10 to 10 range
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;

    // Cancel any pending animation frame
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    // Use requestAnimationFrame for smoother updates
    rafRef.current = requestAnimationFrame(() => {
      if (wrapperRef.current) {
        wrapperRef.current.style.transform =
          `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.02)`;
        wrapperRef.current.style.transition = 'transform 0.1s ease-out';
      }
    });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);

    // Smooth return to default position
    if (wrapperRef.current) {
      wrapperRef.current.style.transition = 'transform 0.3s ease-out';
      wrapperRef.current.style.transform =
        'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)';
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      className="profile-photo-container"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Floating decorative elements */}
      <div className="float-element float-top" />
      <div className="float-element float-bottom" />

      {/* Photo container with 3D tilt effect */}
      <div className="photo-wrapper" ref={wrapperRef}>
        {/* Main photo frame */}
        <div className="photo-frame">
          {imageSrc ? (
            <>
              <img
                src={imageSrc}
                alt="Xiaoxue - Service Designer"
                className="photo-image"
              />
              {/* Color overlay - drawn after image to appear on top */}
              <div className="photo-color-overlay" />
            </>
          ) : (
            <div className="photo-placeholder">
              <div className="placeholder-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <p className="placeholder-text">Add photo</p>
            </div>
          )}
        </div>

        {/* Glow effect */}
        <div className={`photo-glow ${isHovering ? 'active' : ''}`} />

        {/* Corner accents */}
        <div className="corner-accent corner-top-left" />
        <div className="corner-accent corner-bottom-right" />
      </div>
    </div>
  );
}
