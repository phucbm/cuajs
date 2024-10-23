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
                            color: theme('colors.cua-white'),
                        },
                        'a': {
                            color: theme('colors.cua-white'),
                            transition: 'color 0.3s ease-in-out',
                            '&:hover': {
                                color: theme('colors.cua-black'),
                            },
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