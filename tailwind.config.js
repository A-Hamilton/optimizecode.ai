// Enhanced Tailwind Config for OptimizeCode.ai
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Enhanced Color System
      colors: {
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          DEFAULT: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
        secondary: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          DEFAULT: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
          950: "#030712",
        },
        success: {
          50: "#ecfdf5",
          100: "#d1fae5",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          DEFAULT: "#10b981",
        },
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          DEFAULT: "#f59e0b",
        },
        danger: {
          50: "#fef2f2",
          100: "#fee2e2",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          DEFAULT: "#ef4444",
        },
        info: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          DEFAULT: "#3b82f6",
        },
        background: {
          DEFAULT: "#111827",
          secondary: "#1f2937",
          tertiary: "#374151",
          surface: "rgba(255, 255, 255, 0.05)",
          "surface-hover": "rgba(255, 255, 255, 0.08)",
          "surface-active": "rgba(255, 255, 255, 0.12)",
          overlay: "rgba(0, 0, 0, 0.8)",
          backdrop: "rgba(0, 0, 0, 0.5)",
        },
      },

      // Enhanced Font System
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
        mono: [
          '"SF Mono"',
          "Monaco",
          "Inconsolata",
          '"Roboto Mono"',
          '"Fira Code"',
          "Consolas",
          "monospace",
        ],
        display: ['"Inter Display"', "var(--font-sans)"],
      },

      // Enhanced Typography Scale
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },

      // Enhanced Spacing Scale
      spacing: {
        px: "1px",
        0: "0",
        0.5: "0.125rem",
        1: "0.25rem",
        1.5: "0.375rem",
        2: "0.5rem",
        2.5: "0.625rem",
        3: "0.75rem",
        3.5: "0.875rem",
        4: "1rem",
        5: "1.25rem",
        6: "1.5rem",
        7: "1.75rem",
        8: "2rem",
        9: "2.25rem",
        10: "2.5rem",
        11: "2.75rem",
        12: "3rem",
        14: "3.5rem",
        16: "4rem",
        20: "5rem",
        24: "6rem",
        28: "7rem",
        32: "8rem",
        36: "9rem",
        40: "10rem",
        44: "11rem",
        48: "12rem",
        52: "13rem",
        56: "14rem",
        60: "15rem",
        64: "16rem",
        72: "18rem",
        80: "20rem",
        96: "24rem",
      },

      // Enhanced Border Radius
      borderRadius: {
        none: "0",
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },

      // Enhanced Box Shadow System
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
        none: "0 0 #0000",
        // Color-specific shadows
        primary: "0 10px 25px rgba(99, 102, 241, 0.15)",
        "primary-lg": "0 20px 40px rgba(99, 102, 241, 0.2)",
        success: "0 10px 25px rgba(16, 185, 129, 0.15)",
        warning: "0 10px 25px rgba(245, 158, 11, 0.15)",
        danger: "0 10px 25px rgba(239, 68, 68, 0.15)",
      },

      // Enhanced Z-Index Scale
      zIndex: {
        hide: "-1",
        auto: "auto",
        0: "0",
        10: "10",
        20: "20",
        30: "30",
        40: "40",
        50: "50",
        dropdown: "1000",
        sticky: "1020",
        fixed: "1030",
        "modal-backdrop": "1040",
        modal: "1050",
        popover: "1060",
        tooltip: "1070",
        notification: "1080",
        max: "2147483647",
      },

      // Enhanced Animation System
      animation: {
        // Existing animations (kept for compatibility)
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

        // Enhanced stagger animations
        "stagger-1": "fadeInUp 0.6s ease-out 0.1s both",
        "stagger-2": "fadeInUp 0.6s ease-out 0.2s both",
        "stagger-3": "fadeInUp 0.6s ease-out 0.3s both",
        "stagger-4": "fadeInUp 0.6s ease-out 0.4s both",
        "stagger-5": "fadeInUp 0.6s ease-out 0.5s both",
        "stagger-6": "fadeInUp 0.6s ease-out 0.6s both",

        // New enhanced animations
        "fade-in-spring":
          "fadeInUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "slide-in-right": "slideInRight 0.4s ease-out",
        "slide-out-right": "slideOutRight 0.4s ease-out",
        "scale-in-bounce":
          "scaleInBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "rotate-in": "rotateIn 0.6s ease-out",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "loading-dots": "loadingDots 1.5s infinite",
        "progress-shimmer": "progressShimmer 2s infinite",
        "particles-float": "particlesFloat 20s linear infinite",
      },

      // Enhanced Keyframes
      keyframes: {
        // Existing keyframes (kept for compatibility)
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
          "50%": { borderColor: "#6366f1" },
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
          },
          "50%": {
            transform:
              "perspective(400px) translateZ(150px) rotateY(190deg) scale(1)",
          },
          "80%": {
            transform: "perspective(400px) rotateY(360deg) scale(0.95)",
          },
          "100%": {
            transform: "perspective(400px) scale(1)",
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

        // New enhanced keyframes
        slideOutRight: {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        scaleInBounce: {
          "0%": { opacity: "0", transform: "scale(0.3)" },
          "50%": { opacity: "1", transform: "scale(1.1)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        rotateIn: {
          "0%": { opacity: "0", transform: "rotate(-200deg)" },
          "100%": { opacity: "1", transform: "rotate(0)" },
        },
        glowPulse: {
          "0%, 100%": {
            boxShadow: "0 0 5px rgba(99, 102, 241, 0.5)",
            textShadow: "0 0 10px rgba(99, 102, 241, 0.5)",
          },
          "50%": {
            boxShadow:
              "0 0 20px rgba(99, 102, 241, 0.8), 0 0 30px rgba(99, 102, 241, 0.6)",
            textShadow: "0 0 20px rgba(99, 102, 241, 0.8)",
          },
        },
        loadingDots: {
          "0%, 20%": { content: '""' },
          "40%": { content: '"."' },
          "60%": { content: '".."' },
          "80%, 100%": { content: '"..."' },
        },
        progressShimmer: {
          "0%": { left: "-100%" },
          "100%": { left: "100%" },
        },
        particlesFloat: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-100vh)" },
        },
      },

      // Enhanced Transition System
      transitionDuration: {
        fastest: "75ms",
        fast: "150ms",
        DEFAULT: "250ms",
        slow: "350ms",
        slowest: "500ms",
      },

      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
        linear: "linear",
        in: "cubic-bezier(0.4, 0, 1, 1)",
        out: "cubic-bezier(0, 0, 0.2, 1)",
        "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
        spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },

      // Enhanced Backdrop Filter
      backdropBlur: {
        none: "none",
        sm: "blur(4px)",
        DEFAULT: "blur(8px)",
        md: "blur(12px)",
        lg: "blur(16px)",
        xl: "blur(24px)",
        "2xl": "blur(40px)",
        "3xl": "blur(64px)",
      },

      // Enhanced Grid System
      gridTemplateColumns: {
        13: "repeat(13, minmax(0, 1fr))",
        14: "repeat(14, minmax(0, 1fr))",
        15: "repeat(15, minmax(0, 1fr))",
        16: "repeat(16, minmax(0, 1fr))",
      },

      // Enhanced Aspect Ratios
      aspectRatio: {
        auto: "auto",
        square: "1 / 1",
        video: "16 / 9",
        "4/3": "4 / 3",
        "3/2": "3 / 2",
        "2/3": "2 / 3",
        "9/16": "9 / 16",
      },

      // Enhanced Container Queries
      containers: {
        xs: "20rem",
        sm: "24rem",
        md: "28rem",
        lg: "32rem",
        xl: "36rem",
        "2xl": "42rem",
        "3xl": "48rem",
        "4xl": "56rem",
        "5xl": "64rem",
        "6xl": "72rem",
        "7xl": "80rem",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
