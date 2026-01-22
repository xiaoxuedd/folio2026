import type { ImageMetadata } from 'astro';

// Import project images
import healthcarePrecisionMedicine from '../images/projects/healthcare-precision-medicine.jpg';
import ecommerceReturns from '../images/projects/ecommerce-returns.jpg';
import automobileDealership from '../images/projects/automobile-dealership.jpg';
import financeLending from '../images/projects/finance-lending.jpg';
import strategyCapability from '../images/projects/strategy-capability.jpg';

export interface Project {
  id: number;
  title: string;
  description: string;
  shortDescription?: string;
  category: string;
  image: ImageMetadata | string;
  tags: string[];
  link?: string;
  isProtected?: boolean;
  // Extended fields for detailed view
  scope?: string;
  responsibilities?: string[];
  outcomes?: string[];
  industry?: string;
  duration?: string;
  // Overlay content
  overlaySubtitle?: string;
  overlayBody?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Designing for care delivery",
    description: "Pharmaceutical companies had breakthrough cancer treatments but lacked the operational infrastructure to deliver them. I led a business transformation from product-led to service-led, designing an end-to-end service ecosystem that enabled the commercial launch and scale of a life-saving advanced therapy across 10+ global markets.",
    category: "Healthcare",
    image: healthcarePrecisionMedicine,
    tags: ["Service Design", "Strategy", "Product / UX", "Research"],
    link: "/healthcare",
    isProtected: false,
    industry: "Healthcare",
    duration: "18 months",
    scope: "18-month engagement spanning 10+ global markets",
    responsibilities: [
      "Led end-to-end service design from discovery through implementation, working directly with C-suite stakeholders",
      "Designed operational infrastructure including logistics, cold-chain management, and clinical coordination systems",
      "Established service blueprints, customer journey maps, and operational playbooks for commercial teams",
      "Facilitated cross-functional workshops with clinical, regulatory, and commercial stakeholders"
    ],
    outcomes: [
      "Enabled successful commercial launch of advanced therapy in multiple markets",
      "Reduced time-to-treatment by 40% through streamlined service delivery",
      "Created scalable service model adopted as template for future therapies"
    ],
    overlaySubtitle: "Building the infrastructure to deliver precision medicine at scale",
    overlayBody: "Pharmaceutical companies developed breakthrough treatments but had no way to get them to patients. As the design lead, I drove the business transformation that created an end-to-end service system, from lab to hospital, enabling the commercial launch of a life-saving advanced therapy across 10+ global markets."
  },
  {
    id: 2,
    title: "Happier customers, healthier business",
    description: "Driven by 'buy-to-try' behaviour, high return rates cost a luxury fashion business £20M+ annually in logistics and waste. I led a 6-month multidisciplinary programme across product, operations, and finance, designing integrated solutions from purchase guidance to warehouse operations to reduce returns.",
    shortDescription: "Led a multidisciplinary programme to reduce £20M+ annual return costs for a luxury fashion brand through integrated design solutions.",
    category: "E-commerce",
    image: ecommerceReturns,
    tags: ["Service Design", "Research", "Data Strategy", "Product / UX"],
    industry: "E-commerce",
    duration: "6 months",
    scope: "6-month programme across product, operations, and finance",
    responsibilities: [
      "Led discovery across customer touchpoints to identify root causes of high return rates",
      "Designed product visualization and size guidance tools to improve purchase confidence",
      "Mapped warehouse operations to identify process improvements for returned inventory",
      "Facilitated workshops with cross-functional teams to align on integrated solutions"
    ],
    outcomes: [
      "Reduced return rates by 15% through improved purchase guidance",
      "Saved £3M+ annually in logistics and processing costs",
      "Improved customer satisfaction scores by providing better product information"
    ],
    overlaySubtitle: "Reducing e-commerce returns through cross-functional Design",
    overlayBody: "\"Buy-to-try\" behavior was costing a luxury fashion retailer £20M+ annually in returns. Leading a cross-functional squad team, we delivered a 6-month program designing integrated solutions, from purchase guidance and data strategy to warehouse operations, that reduced returns by 10%."
  },
  {
    id: 3,
    title: "Unlocking the data black box",
    description: "A world-leading automobile brand struggled to convert dealership leads due to fragmented processes and poor visibility across the sales journey. I led the design of an intelligent lead management system, combining scoring algorithms, automated workflows, and unified dashboards, to improve conversion while delivering a consistent customer experience.",
    shortDescription: "Designed an intelligent lead management system for a global automobile brand to improve conversion and customer experience.",
    category: "Automobile",
    image: automobileDealership,
    tags: ["Service Design", "Research", "Product / UX"],
    industry: "Automobile",
    duration: "12 months",
    scope: "Multi-market lead management transformation",
    responsibilities: [
      "Conducted ethnographic research across dealerships to understand sales workflows and pain points",
      "Designed lead scoring algorithms based on customer behavior and engagement patterns",
      "Created unified dashboard interfaces for sales teams to track and manage leads efficiently",
      "Developed automated workflow systems to ensure timely follow-up and reduce lead leakage"
    ],
    outcomes: [
      "Increased lead conversion rates by 25% across pilot dealerships",
      "Reduced average response time from 48 hours to 6 hours",
      "Improved sales team efficiency by consolidating multiple tools into one platform"
    ],
    overlaySubtitle: "Using AI to help dealerships convert more leads",
    overlayBody: "A leading automobile brand struggled with fragmented sales processes and poor visibility into customer journeys. Working with a team of designers, we developed an intelligent lead management system that uses AI to help dealers accelerate conversion while delivering consistent customer experiences."
  },
  {
    id: 4,
    title: "Compliant and creative",
    description: "A corporate bank's lending process was slow and complex due to manual compliance and dynamic workflows, frustrating corporate clients and creating competitive disadvantage. I led discovery across lending operations, mapping key decision points and evaluating AI applications against regulatory constraints to define clear opportunities to reduce manual burden, minimise human error, and accelerate decision-making.",
    shortDescription: "Led discovery across corporate lending operations to identify AI opportunities within regulatory constraints and accelerate decision-making.",
    category: "Finance",
    image: financeLending,
    tags: ["Service Design", "Product Strategy"],
    industry: "Finance",
    duration: "3 months",
    scope: "Discovery phase across corporate lending operations",
    responsibilities: [
      "Mapped end-to-end lending workflows across underwriting, compliance, and approval stages",
      "Conducted stakeholder interviews with loan officers, compliance teams, and corporate clients",
      "Evaluated AI and automation opportunities against strict regulatory requirements",
      "Defined strategic roadmap for process improvements and technology enablement"
    ],
    outcomes: [
      "Identified 12 automation opportunities reducing processing time by 40%",
      "Business case showing £5M+ potential savings through optimization",
      "Established framework for AI implementation within regulatory boundaries"
    ],
    overlaySubtitle: "Bringing innovation to regulated corporate lending",
    overlayBody: "A corporate bank's manual lending workflows frustrated clients and created competitive risk. I led discovery across lending operations and evaluated AI applications against regulatory requirements to create a prioritised product roadmap for transformation."
  },
  {
    id: 5,
    title: "Put design at the core",
    description: "Design was seen as execution, not strategy, limiting its impact on business outcomes. I designed and delivered capability programs for various organisations across industries that demonstrated design's business value through tailored methodologies and case-driven training.",
    shortDescription: "Designed capability programs that shifted design from delivery to strategic decision-making.",
    category: "Strategy",
    image: strategyCapability,
    tags: ["Design Strategy", "Capability Building", "Leadership"],
    industry: "Cross-Industry",
    duration: "Ongoing",
    scope: "Multi-organization capability development",
    responsibilities: [
      "Designed tailored capability programs for agencies and in-house teams",
      "Delivered training workshops demonstrating design's strategic business value",
      "Created case-driven methodologies connecting design work to business outcomes",
      "Coached leadership teams on integrating design into decision-making processes"
    ],
    outcomes: [
      "Shifted design perception from execution to strategic function",
      "Increased design team involvement in early-stage business planning",
      "Built internal capability reducing reliance on external consultants"
    ],
    overlaySubtitle: "Growing capability that shifts design from delivery to decision-making",
    overlayBody: "Design was seen as execution, not strategy, limiting its impact. I designed and delivered capability programs for various organisations (across industries, agencies, and in-house teams) that demonstrated design's business value through tailored methodologies and case-driven training."
  }
];
