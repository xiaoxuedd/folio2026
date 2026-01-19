import { useEffect, useState } from 'react';
import './ProjectNavigation.css';

const baseUrl = import.meta.env.BASE_URL;

interface Section {
  id: string;
  label: string;
}

const sections: Section[] = [
  { id: 'context', label: 'Context' },
  { id: 'challenge', label: 'Challenge' },
  { id: 'execution', label: 'Execution' },
  { id: 'impact', label: 'Impact' },
  { id: 'reflection', label: 'Reflection' },
];

export default function ProjectNavigation() {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    const updateProgress = () => {
      const scrollTop = window.pageYOffset;

      // Track if at top
      setIsAtTop(scrollTop <= 50);

      // If we're at the very top, show no progress
      if (scrollTop < 100) {
        setActiveSection(0);
        setScrollProgress(0);
        return;
      }

      const windowHeight = window.innerHeight;
      const sectionElements = sections.map(section =>
        document.getElementById(section.id)
      );

      // Find active section and calculate progress within that section
      let currentSection = 0;
      let sectionProgress = 0;
      const navOffset = 100; // Account for fixed nav height
      const viewportTrigger = navOffset + 50; // Add buffer for better detection

      // Iterate through sections to find which one we're in
      for (let index = sectionElements.length - 1; index >= 0; index--) {
        const element = sectionElements[index];
        if (element) {
          const rect = element.getBoundingClientRect();

          // If section top has passed the trigger point, this is our active section
          if (rect.top <= viewportTrigger) {
            currentSection = index;

            // Calculate progress within the current section
            const sectionTop = rect.top;
            const sectionHeight = rect.height;

            // Calculate normal progress
            const progressInSection = Math.max(0, Math.min(1,
              (viewportTrigger - sectionTop) / sectionHeight
            ));

            sectionProgress = progressInSection;
            break;
          }
        }
      }

      setActiveSection(currentSection);

      // Calculate line progress: base progress + partial progress in current section
      // Each section represents 1/(n-1) of the total progress
      const totalSections = sections.length;
      const baseProgress = currentSection / (totalSections - 1);
      const nextSectionIncrement = 1 / (totalSections - 1);
      const finalProgress = (baseProgress + (sectionProgress * nextSectionIncrement)) * 100;

      setScrollProgress(Math.min(finalProgress, 100));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateProgress();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Same as navOffset - Account for fixed nav height

      // Get the element's current transform translateY value to compensate for AOS animation
      const style = window.getComputedStyle(element);
      const matrix = new DOMMatrix(style.transform);
      const translateY = matrix.m42;

      const elementPosition = element.getBoundingClientRect().top;
      // Compensate for both nav offset AND transform offset
      const offsetPosition = elementPosition + window.pageYOffset - offset - translateY;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className={`project-header ${isAtTop ? 'at-top' : ''}`}>
      <nav className="project-nav-pill" aria-label="Project navigation">
        <div className="nav-left">
          <a href={baseUrl} className="back-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>Back</span>
          </a>
        </div>

        <div className="nav-center">
          <div className="progress-tracker">
            <div
              className="progress-line"
              style={{ width: `${scrollProgress}%` }}
            />
            <div className="progress-bubbles">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  className={`progress-bubble ${index === activeSection ? 'active' : ''} ${index < activeSection ? 'completed' : ''}`}
                  onClick={() => scrollToSection(section.id)}
                  aria-label={section.label}
                >
                  <span className="bubble-label">{section.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="nav-right">
          <button
            className="theme-toggle"
            aria-label="Toggle theme"
            onClick={() => (window as any).toggleTheme?.()}
          >
            <svg className="sun-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <svg className="moon-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}
