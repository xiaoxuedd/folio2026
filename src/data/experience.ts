export interface ExperienceEntry {
  company: string;
  /** Primary role title shown under the company name. */
  role: string;
  /** Optional earlier title held at the same company (stacked tenure). */
  priorRole?: string;
  location: string;
  /** Compact range shown right-aligned on the ledger row, e.g. "2021 — 2023". */
  years: string;
  /** Impact bullets revealed when the row is expanded. */
  highlights: string[];
}

export const experience: ExperienceEntry[] = [
  {
    company: 'BYND',
    role: 'Principal Lead, Service Design & Strategy',
    location: 'London, UK',
    years: '2023 —',
    highlights: [
      'Scaled CX transformation across 8+ markets for a pharmaceutical client, securing executive alignment and driving strategic service implementation for the commercial launch of advanced therapies.',
      'Architected a service design strategy with AI-enabled workflow capabilities, creating new propositions that generated £3m+ revenue opportunities across three industry sectors.',
      'Coached and mentored cross-functional teams to build internal service design maturity and capability.',
    ],
  },
  {
    company: 'Publicis Sapient',
    role: 'Associate Design Director',
    priorRole: 'Service Design Lead',
    location: 'Copenhagen, Denmark',
    years: '2021 — 2023',
    highlights: [
      'Delivered a go-to-market framework and training for a pharmaceutical client, enabling global-to-local customer strategy execution through a three-phase transformation programme.',
      'Created an accelerator programme for a retail client, piloting 10+ initiatives and achieving a 25% faster turnaround through CX and operational innovation.',
      'Established the Nordic service design practice and a new market proposition.',
    ],
  },
  {
    company: 'YOOX Net-a-Porter Group',
    role: 'Senior Service Designer',
    location: 'London, UK',
    years: '2019 — 2021',
    highlights: [
      'Built a comprehensive Returns Programme that made customer experience measurable and reduced return-related costs by 10%.',
      'Established dynamic design guidelines tailored to category- and market-specific needs through a consistent brand experience.',
    ],
  },
  {
    company: 'Fjord, Accenture Interactive',
    role: 'Senior Service & Interaction Designer',
    location: 'London, UK',
    years: '2015 — 2019',
    highlights: [
      'Led research to inform the expansion strategy for a global healthcare provider entering new markets.',
      'Optimised the corporate employee experience by implementing a framework that drives behavioural change within a public sector organisation.',
      'Reimagined social-issue narratives to improve engagement with citizens, policymakers, and nonprofits.',
    ],
  },
];

export interface EducationEntry {
  institution: string;
  qualification: string;
  location: string;
}

export const education: EducationEntry[] = [
  {
    institution: 'Royal College of Art',
    qualification: 'Master of Arts',
    location: 'London, UK',
  },
  {
    institution: 'Zhejiang University',
    qualification: 'Bachelor of Engineering',
    location: 'China',
  },
];
