import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
    darkMode: "class",
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
        extend: {
                colors: {
                        background: 'hsl(var(--background))',
                        foreground: 'hsl(var(--foreground))',
                        card: {
                                DEFAULT: 'hsl(var(--card))',
                                foreground: 'hsl(var(--card-foreground))'
                        },
                        popover: {
                                DEFAULT: 'hsl(var(--popover))',
                                foreground: 'hsl(var(--popover-foreground))'
                        },
                        primary: {
                                DEFAULT: 'hsl(var(--primary))',
                                foreground: 'hsl(var(--primary-foreground))'
                        },
                        secondary: {
                                DEFAULT: 'hsl(var(--secondary))',
                                foreground: 'hsl(var(--secondary-foreground))'
                        },
                        muted: {
                                DEFAULT: 'hsl(var(--muted))',
                                foreground: 'hsl(var(--muted-foreground))'
                        },
                        accent: {
                                DEFAULT: 'hsl(var(--accent))',
                                foreground: 'hsl(var(--accent-foreground))'
                        },
                        destructive: {
                                DEFAULT: 'hsl(var(--destructive))',
                                foreground: 'hsl(var(--destructive-foreground))'
                        },
                        border: 'hsl(var(--border))',
                        input: 'hsl(var(--input))',
                        ring: 'hsl(var(--ring))',
                        chart: {
                                '1': 'hsl(var(--chart-1))',
                                '2': 'hsl(var(--chart-2))',
                                '3': 'hsl(var(--chart-3))',
                                '4': 'hsl(var(--chart-4))',
                                '5': 'hsl(var(--chart-5))'
                        },
                        // PlugToPlaylist Brand Colors
                        gold: {
                                DEFAULT: '#D4AF37',
                                50: '#FDF9E7',
                                100: '#FAF0C8',
                                200: '#F5E18A',
                                300: '#EED24C',
                                400: '#E7C320',
                                500: '#D4AF37',
                                600: '#B8962E',
                                700: '#8B7123',
                                800: '#5E4B18',
                                900: '#31260D',
                        },
                        luxury: {
                                black: '#0B0B0B',
                                dark: '#111111',
                                lighter: '#1A1A1A',
                                gray: '#B3B3B3',
                        },
                        brand: {
                                orange: '#FF7A00',
                                success: '#22C55E',
                                warning: '#FF7A00',
                                pending: '#FF7A00',
                                active: '#D4AF37',
                        }
                },
                borderRadius: {
                        lg: 'var(--radius)',
                        md: 'calc(var(--radius) - 2px)',
                        sm: 'calc(var(--radius) - 4px)'
                },
                boxShadow: {
                        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.3)',
                        'gold-glow-lg': '0 0 40px rgba(212, 175, 55, 0.4)',
                        'orange-glow': '0 0 20px rgba(255, 122, 0, 0.4)',
                        'card': '0 4px 20px rgba(0, 0, 0, 0.4)',
                },
                animation: {
                        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
                        'float': 'float 6s ease-in-out infinite',
                        'slide-up': 'slide-up 0.5s ease-out',
                        'slide-down': 'slide-down 0.5s ease-out',
                        'fade-in': 'fade-in 0.5s ease-out',
                },
                keyframes: {
                        'glow-pulse': {
                                '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)' },
                                '50%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.6)' },
                        },
                        'float': {
                                '0%, 100%': { transform: 'translateY(0)' },
                                '50%': { transform: 'translateY(-10px)' },
                        },
                        'slide-up': {
                                '0%': { transform: 'translateY(20px)', opacity: '0' },
                                '100%': { transform: 'translateY(0)', opacity: '1' },
                        },
                        'slide-down': {
                                '0%': { transform: 'translateY(-20px)', opacity: '0' },
                                '100%': { transform: 'translateY(0)', opacity: '1' },
                        },
                        'fade-in': {
                                '0%': { opacity: '0' },
                                '100%': { opacity: '1' },
                        },
                },
        }
  },
  plugins: [tailwindcssAnimate],
};
export default config;
