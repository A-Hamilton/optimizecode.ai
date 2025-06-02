// Updated for TypeScript migration
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#646cff",
          dark: "#535bf2",
          light: "#747bff",
        },
        background: {
          DEFAULT: "#242424",
          light: "#2d2d2d",
          card: "rgba(255, 255, 255, 0.05)",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "Avenir",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: ["Monaco", "Menlo", "Ubuntu Mono", "monospace"],
      },
      animation: {
        "spin-slow": "spin 1s linear infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "fade-in-down": "fadeInDown 0.6s ease-out",
        "fade-in-left": "fadeInLeft 0.6s ease-out",
        "fade-in-right": "fadeInRight 0.6s ease-out",
        "slide-in-up": "slideInUp 0.5s ease-out",
        "slide-in-down": "slideInDown 0.5s ease-out",
        "slide-in-left": "slideInLeft 0.5s ease-out",
        "slide-in-right": "slideInRight 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "scale-in-center": "scaleInCenter 0.4s ease-out",
        "bounce-in": "bounceIn 0.6s ease-out",
        "pulse-gentle": "pulseGentle 2s ease-in-out infinite",
        "pulse-slow": "pulseSlow 3s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        typing:
          "typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite",
        "counter-up": "counterUp 1.5s ease-out",
        shimmer: "shimmer 2s linear infinite",
        "gradient-shift": "gradientShift 3s ease-in-out infinite",
        "draw-line": "drawLine 1s ease-out",
        ripple: "ripple 0.6s ease-out",
        wiggle: "wiggle 0.5s ease-in-out",
        "heart-beat": "heartBeat 1s ease-in-out infinite",
        "rotate-y": "rotateY 0.6s ease-out",
        flip: "flip 0.6s ease-in-out",
        "zoom-in": "zoomIn 0.3s ease-out",
        "zoom-out": "zoomOut 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "stagger-1": "fadeInUp 0.6s ease-out 0.1s both",
        "stagger-2": "fadeInUp 0.6s ease-out 0.2s both",
        "stagger-3": "fadeInUp 0.6s ease-out 0.3s both",
        "stagger-4": "fadeInUp 0.6s ease-out 0.4s both",
        "stagger-5": "fadeInUp 0.6s ease-out 0.5s both",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        slideInDown: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        scaleInCenter: {
          "0%": { opacity: "0", transform: "scale(0.5)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        bounceIn: {
          "0%": { opacity: "0", transform: "scale(0.3)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseGentle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.02)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        typing: {
          from: { width: "0" },
          to: { width: "100%" },
        },
        "blink-caret": {
          "from, to": { borderColor: "transparent" },
          "50%": { borderColor: "#646cff" },
        },
        counterUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        drawLine: {
          "0%": { strokeDasharray: "0 100" },
          "100%": { strokeDasharray: "100 0" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "1" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        heartBeat: {
          "0%": { transform: "scale(1)" },
          "14%": { transform: "scale(1.3)" },
          "28%": { transform: "scale(1)" },
          "42%": { transform: "scale(1.3)" },
          "70%": { transform: "scale(1)" },
        },
        rotateY: {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(360deg)" },
        },
        flip: {
          "0%": { transform: "perspective(400px) rotateY(0)" },
          "40%": {
            transform: "perspective(400px) translateZ(150px) rotateY(170deg)",
            animationTimingFunction: "ease-out",
          },
          "50%": {
            transform:
              "perspective(400px) translateZ(150px) rotateY(190deg) scale(1)",
            animationTimingFunction: "ease-in",
          },
          "80%": {
            transform: "perspective(400px) rotateY(360deg) scale(0.95)",
            animationTimingFunction: "ease-in",
          },
          "100%": {
            transform: "perspective(400px) scale(1)",
            animationTimingFunction: "ease-in",
          },
        },
        zoomIn: {
          "0%": { opacity: "0", transform: "scale3d(0.3, 0.3, 0.3)" },
          "50%": { opacity: "1" },
          "100%": { opacity: "1", transform: "scale3d(1, 1, 1)" },
        },
        zoomOut: {
          "0%": { opacity: "1", transform: "scale3d(1, 1, 1)" },
          "50%": { opacity: "0", transform: "scale3d(0.3, 0.3, 0.3)" },
          "100%": { opacity: "0" },
        },
        slideDown: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-100%)" },
        },
      },
      backgroundOpacity: {
        5: "0.05",
        8: "0.08",
        10: "0.1",
      },
      borderOpacity: {
        10: "0.1",
        30: "0.3",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
