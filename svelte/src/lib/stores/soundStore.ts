import { derived } from "svelte/store";
import { settings } from "./settingsStore";

export const sound = derived(settings, ($settings) => {
    return {
        bgVolume: 0.25 * ($settings.volume / 100),
        sfxVolume: 0.2,
        btnVolume: 0.5
    };
});