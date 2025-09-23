/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'sans-body': ['Inter', 'sans-serif'],
                'serif-display': ['Lora', 'serif'],
                'mono': ['Source Code Pro', 'monospace'],
                'romantic': ['"Dancing Script"', 'cursive'], // Added quotes for safety
            },
        },
    },
    plugins: [],
}
