import React from 'react';
import './GlassIcon.css';

export interface GlassIconProps {
  icon: React.ReactElement;
  gradient: string;
  label?: string;
  size?: number;
  iconSize?: number;
}

const GlassIcon: React.FC<GlassIconProps> = ({
  icon,
  gradient,
  label,
  size = 80,
  iconSize
}) => {
  const calculatedIconSize = iconSize || size * 0.35;

  return (
    <div className="glass-icon-wrapper">
      <div
        className="glass-icon-container"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          fontSize: `${calculatedIconSize}px` // Icon size can be overridden
        }}
      >
        <span
          className="glass-icon-back"
          style={{ background: gradient }}
        />
        <span className="glass-icon-front">
          <span className="glass-icon-content">
            {icon}
          </span>
        </span>
      </div>
      {label && <span className="glass-icon-label">{label}</span>}
    </div>
  );
};

export default GlassIcon;
