import { useRef } from 'react';
import { ProximityTilt } from './ProximityTilt';
import './ProfilePhoto.css';

interface ProfilePhotoProps {
  imageSrc?: string;
}

export function ProfilePhoto({ imageSrc }: ProfilePhotoProps) {
  const glowRef = useRef<HTMLDivElement>(null);

  return (
    <div className="profile-photo-container">
      {/* Floating decorative elements — stay put while the photo tilts */}
      <div className="float-element float-top" />
      <div className="float-element float-bottom" />

      {/* Photo wrapper leans toward the cursor on a proximity ramp; the glow's
          opacity rides the same intensity. */}
      <ProximityTilt
        className="photo-wrapper"
        onIntensity={(i) => {
          if (glowRef.current) glowRef.current.style.opacity = `${0.5 + i * 0.5}`;
        }}
      >
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

        {/* Glow effect — opacity ramps with cursor proximity */}
        <div className="photo-glow" ref={glowRef} />

        {/* Corner accents */}
        <div className="corner-accent corner-top-left" />
        <div className="corner-accent corner-bottom-right" />
      </ProximityTilt>
    </div>
  );
}
