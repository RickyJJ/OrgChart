/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                ink: {
                    DEFAULT: '#333333',
                    dark: '#1A2D42',
                },
                paper: '#e0dacf',
                board: '#ece8de',
                vermilion: '#D32F2F',
                'text-main': '#333333',
                'text-muted': '#64748b',
                'sidebar-text': '#E5E7EB',
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
                serif: ["Noto Serif SC", "STZhongsong", "SimSun", "serif"],
                ancient: ["'Alimama Dongfang Da Kai'", "'Ma Shan Zheng'", "STKaiti", "KaiTi", "serif"],
                calligraphy: ["'Zhi Mang Xing'", "cursive", "serif"],
                xingkai: ["'STXingkai'", "'华文行楷'", "serif"],
            },
            backgroundImage: {
                'ink-splash': "url('/assets/ui/ink_splash.png')",
                'dynasty-bg': "url('/assets/ui/switch-bg-1.png')",
                'main-bg': "url('/assets/ui/main-bg.png')",
                'rushi-bg': "url('/assets/ui/rushi_bg.png')",
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            },
            animation: {
                'spin-slow': 'spin 8s linear infinite',
            }
        },
    },
    plugins: [
        function ({ addUtilities }) {
            const newUtilities = {
                '.writing-vertical': {
                    'writing-mode': 'vertical-rl',
                },
                '.writing-horizontal': {
                    'writing-mode': 'horizontal-tb',
                },
            }
            addUtilities(newUtilities)
        }
    ],
}
