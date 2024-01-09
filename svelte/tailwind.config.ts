import type { Config } from "tailwindcss";

export default {
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
                primary: "theme(colors.indigo.600)",
                "primary-dark": "theme(colors.indigo.800)",
                "primary-light": "theme(colors.indigo.500)",
                foreground: "var(--color-foreground)",
                background: "var(--color-background)",
                secondary: "var(--color-secondary)",
                tertiary: "var(--color-tertiary)",
                shade: "rgb(var(--color-shade) / <alpha-value>)"
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