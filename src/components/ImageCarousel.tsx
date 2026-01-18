import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ImageCarousel.css';

interface ImageCarouselProps {
  images: {
    src: string;
    srcset?: string;
    alt: string;
    width?: number;
    height?: number;
    darkSrc?: string;      // Optional dark mode version
    darkSrcset?: string;   // Optional dark mode srcset
    label?: string;        // Optional label for tab navigation
  }[];
  autoPlay?: boolean;
  interval?: number;
  useLabels?: boolean;     // Use label tabs instead of dots
}

const ImageCarousel = ({ images, autoPlay = true, interval = 5000, useLabels = false }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDark, setIsDark] = useState(false);

  // Detect theme changes
  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDark(theme === 'dark');
    };

    // Initial check
    checkTheme();

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && images.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, interval);

      return () => clearInterval(timer);
    }
  }, [autoPlay, images.length, interval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const fadeVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 }
  };

  // Get the appropriate image source based on theme
  const getCurrentImage = (image: typeof images[0]) => {
    if (isDark && image.darkSrc) {
      return {
        src: image.darkSrc,
        srcset: image.darkSrcset || image.darkSrc
      };
    }
    return {
      src: image.src,
      srcset: image.srcset || image.src
    };
  };

  const currentImage = getCurrentImage(images[currentIndex]);

  return (
    <div className="image-carousel">
      <div className="carousel-container">
        {/* Ghost image to set container height */}
        <img
          src={currentImage.src}
          alt=""
          className="carousel-image-ghost"
          aria-hidden="true"
        />
        {/* Animated images */}
        <AnimatePresence initial={false} mode="sync">
          <motion.img
            key={`${currentIndex}-${isDark ? 'dark' : 'light'}`}
            src={currentImage.src}
            srcSet={currentImage.srcset}
            alt={images[currentIndex].alt}
            width={images[currentIndex].width}
            height={images[currentIndex].height}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="carousel-image"
          />
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <div className={useLabels ? 'carousel-tabs' : 'carousel-dots'}>
          {images.map((image, index) => (
            <button
              key={index}
              className={useLabels
                ? `carousel-tab ${index === currentIndex ? 'active' : ''}`
                : `carousel-dot ${index === currentIndex ? 'active' : ''}`
              }
              onClick={() => goToSlide(index)}
              aria-label={useLabels && image.label ? image.label : `Go to slide ${index + 1}`}
            >
              {useLabels && image.label ? image.label : null}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
