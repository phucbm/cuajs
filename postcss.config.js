module.exports = {
    plugins: {
        // Tailwind v4 adds vendor prefixes itself (Lightning CSS), so autoprefixer is no longer needed
        '@tailwindcss/postcss': {},
    }
}
