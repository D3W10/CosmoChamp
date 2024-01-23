import { derived } from "svelte/store";
import { page } from "./pageStore";
import { settings } from "./settingsStore";
import { cubicIn, cubicOut, quintOut } from "svelte/easing";

export const transition = derived([page, settings], ($values) => {
    let duration = !$values[1]?.reduceMotion ? 500 : 200;
    let offset = (!$values[1]?.reduceMotion ? 200 : 100) * (!$values[0].back ? -1 : 1);

    return {
        pageIn: { duration: duration, delay: duration, x: offset * -1, easing: cubicOut },
        pageOut: { duration: duration, x: offset, easing: cubicIn },
        comboFlow: { duration: 500, easing: quintOut }
    };
});