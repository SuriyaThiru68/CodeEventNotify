export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5 }
};

export const slideUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export const slideUpStagger = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export const hoverGlow = {
  hover: {
    boxShadow: "0 0 20px rgba(135, 206, 235, 0.4)",
    y: -2,
    transition: { duration: 0.3 }
  }
};

export const cardHover = {
  hover: {
    y: -5,
    boxShadow: "0 20px 40px rgba(135, 206, 235, 0.3)",
    transition: { duration: 0.3 }
  }
};

export const ripple = {
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const pulseGlow = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(135, 206, 235, 0.3)",
      "0 0 30px rgba(135, 206, 235, 0.6)",
      "0 0 20px rgba(135, 206, 235, 0.3)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};
