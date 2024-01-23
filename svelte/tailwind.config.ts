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
                "cubic-out": "cubic-bezier(0.33, 1, 0.68, 1)",
                "quint-out": "cubic-bezier(0.22, 1, 0.36, 1)",
                "quint-in": "cubic-bezier(0.64, 0, 0.78, 0)"
            }
        }
    },
    plugins: []
} satisfies Config