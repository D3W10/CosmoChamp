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
            backgroundImage: {
                "check": "url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e\")"
            },
            colors: {
                primary: "rgb(var(--color-primary) / <alpha-value>)",
                foreground: "rgb(var(--color-foreground) / <alpha-value>)",
                background: "rgb(var(--color-background) / <alpha-value>)",
                secondary: "rgb(var(--color-secondary) / <alpha-value>)",
                tertiary: "rgb(var(--color-tertiary) / <alpha-value>)",
                shade: "rgb(var(--color-shade) / <alpha-value>)"
            },
            dropShadow: {
                glow: ["0 0 8px rgba(79,70,229,1)", "-2px -2px 2px rgba(79,70,229,0.5)", "2px 2px 2px rgba(79,70,229,0.5)"],
                shine: ["0 0 8px rgba(255,255,255,1)", "-2px -2px 2px rgba(255,255,255,0.5)", "2px 2px 2px rgba(255,255,255,0.5)"]
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