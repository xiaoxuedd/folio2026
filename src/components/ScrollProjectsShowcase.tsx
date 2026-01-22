import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Project } from '../data/projects';
import './ScrollProjectsShowcase.css';

gsap.registerPlugin(ScrollTrigger);

interface ScrollProjectsShowcaseProps {
  projects: Project[];
}

export default function ScrollProjectsShowcase({ projects }: ScrollProjectsShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imagesTrackRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [contentHeights, setContentHeights] = useState<number[]>([]);

  // Measure natural heights of content
  useEffect(() => {
    const heights = contentRefs.current.map((ref) => {
      if (!ref) return 0;
      return ref.scrollHeight;
    });
    setContentHeights(heights);
  }, [projects]);

  useEffect(() => {
    if (!sectionRef.current || !imagesTrackRef.current || contentHeights.length === 0) return;

    const section = sectionRef.current;
    const track = imagesTrackRef.current;
    const imageHeight = 600;
    const totalScroll = (projects.length - 1) * imageHeight;

    // Create ScrollTrigger for the entire section
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: `+=${totalScroll * 2}`,
      pin: true,
      scrub: 1,
      snap: {
        snapTo: (progress) => {
          // Create snap points at each project position
          // Images translate from 0 to totalScroll, so snap points are at i/(length-1)
          const snapPoints = Array.from({ length: projects.length }, (_, i) =>
            projects.length === 1 ? 0 : i / (projects.length - 1)
          );

          // Find closest snap point
          let closest = snapPoints[0];
          let minDistance = Math.abs(progress - closest);

          for (const point of snapPoints) {
            const distance = Math.abs(progress - point);
            if (distance < minDistance) {
              minDistance = distance;
              closest = point;
            }
          }

          return closest;
        },
        duration: 0.5,
        delay: 0,
        ease: 'power2.inOut',
      },
      onUpdate: (self) => {
        const progress = self.progress;

        // Translate images
        const translateY = -(progress * totalScroll);
        gsap.set(track, { y: translateY });

        // Smoothly expand/collapse content based on scroll position
        projects.forEach((_, index) => {
          const contentEl = contentRefs.current[index];
          if (!contentEl) return;

          // Calculate how "active" this item is
          // Images are at top when progress = index/(length-1)
          const targetProgress = projects.length === 1 ? 0 : index / (projects.length - 1);
          const distance = Math.abs(progress - targetProgress);

          // Smoothly interpolate height (fully active at distance = 0)
          // Scale distance to be in 0-1 range (max distance between snaps is 1/(length-1))
          const maxDistance = projects.length === 1 ? 1 : 1 / (projects.length - 1);
          let heightProgress = Math.max(0, 1 - (distance / maxDistance));
          heightProgress = Math.pow(heightProgress, 0.5); // Ease curve

          const targetHeight = contentHeights[index] * heightProgress;
          gsap.set(contentEl, { height: targetHeight });

          // Update header active state
          const headerEl = contentEl.previousElementSibling;
          if (headerEl) {
            if (heightProgress > 0.5) {
              headerEl.classList.add('is-active');
            } else {
              headerEl.classList.remove('is-active');
            }
          }
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [projects, contentHeights]);

  return (
    <section ref={sectionRef} className="scroll-projects-section">
      <div className="container">
        <div>
          <h2>Work (Scroll Version)</h2>
        </div>

        <div className="scroll-projects-wrapper">
          {/* Left side - scrolling images */}
          <div className="scroll-projects-images">
            <div ref={imagesTrackRef} className="scroll-projects-images-track">
              {projects.map((project) => (
                <div key={project.id} className="scroll-project-image">
                  <img
                    src={typeof project.image === 'string' ? project.image : project.image.src}
                    alt={project.title}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right side - custom accordion */}
          <div className="scroll-projects-content">
            <div className="scroll-projects-accordion-wrapper">
              {projects.map((project, index) => (
                <div key={project.id} className="scroll-accordion-item">
                  <div className="scroll-accordion-header">
                    <div className="scroll-accordion-header-content">
                      <span className="scroll-project-number">{String(index + 1).padStart(2, '0')}</span>
                      <h4>{project.title}</h4>
                    </div>
                    <div className="scroll-accordion-chevron">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>

                  <div
                    ref={(el) => (contentRefs.current[index] = el)}
                    className="scroll-accordion-content"
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="scroll-accordion-panel">
                      <div className="scroll-project-meta">
                        <span className="scroll-project-category">{project.category}</span>
                        {project.scope && <span className="scroll-project-scope">{project.scope}</span>}
                      </div>

                      {project.responsibilities && project.responsibilities.length > 0 && (
                        <div className="scroll-project-section">
                          <h5>Key Responsibilities</h5>
                          <ul>
                            {project.responsibilities.map((resp, i) => (
                              <li key={i}>{resp}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {project.outcomes && project.outcomes.length > 0 && (
                        <div className="scroll-project-section">
                          <h5>Impact & Outcomes</h5>
                          <ul>
                            {project.outcomes.map((outcome, i) => (
                              <li key={i}>{outcome}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {project.link && (
                        <a href={project.link} className="scroll-project-link">
                          View Full Case Study →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
