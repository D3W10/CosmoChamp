import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/**/*"
    ],
    theme: {
        extend: {
            aspectRatio: {
                "card": "1024 / 1593",
            },
            colors: {
                primary: "rgb(var(--color-primary) / <alpha-value>)",
                foreground: "rgb(var(--color-foreground) / <alpha-value>)",
                background: "rgb(var(--color-background) / <alpha-value>)",
                secondary: "rgb(var(--color-secondary) / <alpha-value>)",
                tertiary: "rgb(var(--color-tertiary) / <alpha-value>)",
                shade: "rgb(var(--color-shade) / <alpha-value>)"
            },
            spacing: {
                "112": "30rem",
                "125": "31.25rem"
            },
            transitionTimingFunction: {
                "leap-out": "cubic-bezier(0.3, 0.6, 0.45, 1)",
                "bang-out": "cubic-bezier(0.15, 0.4, 0.2, 1)",
                "bang-in": "cubic-bezier(0.8, 0, 0.85, 0.6)"
            }
        }
    },
    plugins: []
} satisfies Config