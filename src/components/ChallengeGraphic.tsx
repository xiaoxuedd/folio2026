import './ChallengeGraphic.css';
import challengeBackImg from '../images/challenge-back.svg';

// Label data extracted from the diagram
const labels = [
  // Ecosystem Circle (top)
  { text: 'Investors and Funding Bodies', x: 39, y: 15.5 },
  { text: 'Policy Makers', x: 69, y: 15.5 },
  { text: 'Public Health Authorities', x: 50, y: 20 },
  { text: 'Regulatory Agencies', x: 33, y: 24.5 },
  { text: 'Payers (public & private)', x: 64.5, y: 24.5 },

  // Caring Circle (middle purple)
  { text: 'Treating physicians', x: 10.5, y: 44.5 },
  { text: 'Referrers & Prescribers', x: 10, y: 49 },
  { text: 'Administrations', x: 16, y: 53.5 },
  { text: 'Pharmacists', x: 20, y: 58 },
  { text: 'Clinic Boards', x: 84, y: 44.5 },
  { text: 'CRO (trials)', x: 82, y: 49 },
  { text: 'Public & Private Clinics', x: 87, y: 53.5 },
  { text: 'Research Institutions', x: 83, y: 58 },

  // Primary Recipients (center)
  { text: 'Patients', x: 40.5, y: 52 },
  { text: 'Care givers', x: 57, y: 52 },
  { text: 'Patient Community', x: 50, y: 65 },

  // Enabling Circle (bottom)
  { text: 'Technology Solution Provider', x: 50, y: 84.5 },
  { text: 'Logistics & Supply Chain', x: 50, y: 89 },
  { text: 'Media & Communications', x: 38, y: 93.5 },
  { text: 'Advocacy groups', x: 68, y: 93.5 },
  { text: 'HCP Associations', x: 42, y: 98 },
  { text: 'HCP KOLS', x: 63, y: 98 },
];

export function ChallengeGraphic() {
  return (
    <div className="challenge-graphic-container">
      <div className="challenge-back">
        <img
          src={challengeBackImg.src}
          alt="Challenge circles diagram"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
      <div className="challenge-labels">
        {labels.map((label, index) => (
          <div
            key={index}
            className="challenge-label"
            style={{
              left: `${label.x}%`,
              top: `${label.y}%`,
            }}
          >
            {label.text}
          </div>
        ))}
      </div>
    </div>
  );
}
