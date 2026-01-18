import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './TestimonialCarousel.css';

interface Testimonial {
  quote: string;
  author: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  autoPlay?: boolean;
  interval?: number;
}

const TestimonialCarousel = ({ testimonials, autoPlay = true, interval = 7000 }: TestimonialCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && testimonials.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, interval);

      return () => clearInterval(timer);
    }
  }, [autoPlay, testimonials.length, interval, currentIndex]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <div className="testimonial-carousel">
      <div className="testimonial-slideshow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="testimonial-slide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <blockquote>
              <h3>"{testimonials[currentIndex].quote}"</h3>
              <footer>— {testimonials[currentIndex].author}</footer>
            </blockquote>
          </motion.div>
        </AnimatePresence>
      </div>

      {testimonials.length > 1 && (
        <div className="testimonial-controls">
          <button className="testimonial-prev" onClick={goToPrev} aria-label="Previous testimonial">
            <ChevronLeft size={20} strokeWidth={2} />
          </button>
          <div className="testimonial-indicators">
            {testimonials.map((_, index) => (
              <span
                key={index}
                className={`testimonial-indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                role="button"
                tabIndex={0}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          <button className="testimonial-next" onClick={goToNext} aria-label="Next testimonial">
            <ChevronRight size={20} strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TestimonialCarousel;
