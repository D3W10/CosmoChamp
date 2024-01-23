import { writable } from "svelte/store";
import type { IStoreSettings } from "$electron/lib/Store.interface";

export const settings = (() => {
    const { subscribe, set, update } = writable<IStoreSettings | null>(null);

    if (typeof window !== "undefined")
        set({ ...window.app.getSetting("settings") });

    function onUpdate(property: string, value: any) {
        update((n) => {
            if (n)
                n[property as keyof IStoreSettings] = value as never;

            return n;
        });

        window.app.setSetting(`settings.${property}`, value);
    }

    return {
        subscribe,
        update: onUpdate
    }
})();