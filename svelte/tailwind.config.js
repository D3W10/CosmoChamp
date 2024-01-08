module.exports = {
    content: [
        "./src/**/*"
    ],
    theme: {
        extend: {
            spacing: {
                "112": "30rem",
                "125": "31.25rem"
            },
            colors: {
                foreground: "var(--color-foreground)",
                background: "var(--color-background)",
                secondary: "var(--color-secondary)",
                tertiary: "var(--color-tertiary)",
                shade: "rgb(var(--color-shade) / <alpha-value>)"
            },
            transitionTimingFunction: {
                "leap-out": "cubic-bezier(.3,.6,.45,1)"
            }
        }
    },
    plugins: []
}