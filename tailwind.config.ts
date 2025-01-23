import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        dark: "linear-gradient(180deg, #050D26 0%, #27355D 100%)",
        light: "linear-gradient(180deg, #EBEFFC 0%, #3654A6 100%)",
      },
      colors: {
        // Gradients
        gradientFrom: "#032372",
        gradientVia: "#1949D2",
        gradientTo: "#5373C4",
        gradientToSecondary: "#0C1C43",

        // Grays and Blacks
        grayDark: "#2A2C38",
        grayDarker: "#27355D",
        grayLight: "#EBEFFC",

        // Whites
        white: "#FFFFFF",
        whiteTransparent: "#ffffff1a",
        whiteOpaque: "#ffffffb3",

        // Pastels
        pastelPurple: "#C2B0EE",
        pastelBlue: "#ABCFEF",
        pastelPink: "#E6ADDC",
        pastelGreen: "#91D3A0",

        // Greens
        greenBright: "#37D058",

        // Primary
        primaryAccent: "#1949D2",

        // Blues
        blueAccent: "#1E254E",
        blueDarkAccent: "#2A345E",
        blueLight: "#EBEFFC",
        blueShade: "#3654A6",
        blueUndertone: "#27355D",

        // background
        backgroundLight: "#EBEFFC",
        backgroundDark: "#3654A6",
        backgroundDarker: "#27355D",
        backgroundDarkest: "#050D26",

        // box
        boxLight: "#FFFFFF",
        boxDark: "#2A2C38",

        // Button
        buttonLightFrom: "#032372",
        buttonLightTo: "#5373C4",
        buttonDarkFrom: "#1949D2",
        buttonDarkTo: "#0C1C43",

        // Header
        headerLight: "#FFFFFF",
        headerDark: "#2A2C38",

        // Footer
        footerLight: "#032372",
        footerDark: "#08183E",
      },

      fontFamily: {
        display: ["var(--font-roboto-serif)", "serif"],
        body: ["var(--font-libre-franklin)", "sans-serif"],
      },
      fontSize: {
        "display-lg": [
          "4.75rem",
          {
            lineHeight: "100%",
            letterSpacing: "-0.04em",
            fontWeight: "300",
          },
        ],
        "display-md": [
          "3.75rem",
          {
            lineHeight: "100%",
            letterSpacing: "-0.04em",
            fontWeight: "300",
          },
        ],
        "display-sm": [
          "3rem",
          {
            lineHeight: "100%",
            letterSpacing: "-0.04em",
            fontWeight: "300",
          },
        ],
        "title-1": [
          "3.313rem",
          {
            lineHeight: "100%",
            letterSpacing: "-0.02em",
            fontWeight: "300",
          },
        ],
        "title-2": [
          "2.938rem",
          {
            lineHeight: "120%",
            letterSpacing: "-0.02em",
            fontWeight: "300",
          },
        ],
        "title-3": [
          "2.5rem",
          {
            lineHeight: "120%",
            letterSpacing: "-0.02em",
            fontWeight: "300",
          },
        ],
        "body-lg": [
          "2rem",
          {
            lineHeight: "150%",
            letterSpacing: "0.02em",
            fontWeight: "400",
          },
        ],
        "body-md": [
          "1.688rem",
          {
            lineHeight: "150%",
            letterSpacing: "0.02em",
            fontWeight: "400",
          },
        ],
        "body-sm": [
          "1.313rem",
          {
            lineHeight: "150%",
            letterSpacing: "0.02em",
            fontWeight: "400",
          },
        ],
        "button-lg": [
          "1.188rem",
          {
            lineHeight: "20px",
            letterSpacing: "0",
            fontWeight: "500",
          },
        ],
        "button-md": [
          "1rem",
          {
            lineHeight: "20px",
            letterSpacing: "0",
            fontWeight: "500",
          },
        ],
        "pre-title": [
          "1.188rem",
          {
            lineHeight: "150%",
            letterSpacing: "0.02em",
            fontWeight: "400",
          },
        ],
        detail: [
          "1.188rem",
          {
            lineHeight: "120%",
            letterSpacing: "-0.02em",
            fontWeight: "600",
          },
        ],
      },
      spacing: {
        13: "3.125rem",
        128: "32rem",
        144: "36rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
