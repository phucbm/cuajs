/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./dev/**/*.{html,js,scss}"],
    theme: {
        extend: {
            colors: {
                'cua-white': '#fadccd',
                'cua-black': '#272626',
            },
            typography: ({theme}) => ({
                DEFAULT: {
                    css: {
                        'h1, h2, h3, h4, h5, h6': {
                            color: theme('colors.cua-white'),
                        },
                        'p': {
                            color: theme('colors.cua-black'),
                        },
                    },
                },
            })
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}