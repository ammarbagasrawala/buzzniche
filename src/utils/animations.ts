
import { useEffect, useState } from 'react';

export const useFadeIn = (delay = 0) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
    transition: 'opacity 0.5s ease, transform 0.5s ease',
  };
};

export const useStaggeredFadeIn = (items: any[], baseDelay = 100) => {
  return items.map((item, index) => ({
    ...item,
    style: useFadeIn(baseDelay * (index + 1)),
  }));
};

export const useScaleIn = (delay = 0) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'scale(1)' : 'scale(0.95)',
    transition: 'opacity 0.4s ease, transform 0.4s ease',
  };
};

// Animations for message bubbles
export const messageAppearAnimation = (isOwn: boolean, delay = 0) => {
  return {
    initial: { 
      opacity: 0, 
      x: isOwn ? 20 : -20,
      y: 10
    },
    animate: { 
      opacity: 1, 
      x: 0,
      y: 0,
      transition: {
        duration: 0.4,
        delay: delay / 1000,
        ease: [0.25, 0.1, 0.25, 1.0],
      }
    },
    exit: { 
      opacity: 0, 
      transition: { 
        duration: 0.3 
      } 
    }
  };
};
