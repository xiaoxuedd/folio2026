export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  company: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "Working with Xiaoxue transformed our approach to service delivery. Her strategic insights and design expertise helped us create a patient-centered experience that improved satisfaction scores by 40%.",
    author: "Dr. Sarah Chen",
    role: "Head of Patient Experience",
    company: "London Health Trust",
  },
  {
    id: 2,
    quote: "Xiaoxue's ability to translate complex challenges into elegant design solutions is remarkable. She brought clarity to our digital transformation and delivered measurable business outcomes.",
    author: "Michael Thompson",
    role: "Chief Digital Officer",
    company: "FinTech Solutions",
  },
  {
    id: 3,
    quote: "The depth of research and strategic thinking Xiaoxue brings to every project sets her apart. She doesn't just design services—she designs for sustainable impact and organizational change.",
    author: "Emma Williams",
    role: "Director of Innovation",
    company: "Retail Group UK",
  },
];

export const clientLogos: string[] = [
  "/images/clients/placeholder-logo-1.svg",
  "/images/clients/placeholder-logo-2.svg",
  "/images/clients/placeholder-logo-3.svg",
  "/images/clients/placeholder-logo-4.svg",
  "/images/clients/placeholder-logo-5.svg",
  "/images/clients/placeholder-logo-6.svg",
];
