import { derived } from "svelte/store";
import { page } from "./pageStore";
import { settings } from "./settingsStore";
import { cubicIn, cubicOut } from "svelte/easing";

export const transition = derived([page, settings], ($values) => {
    let duration = !$values[1]?.reduceMotion ? 500 : 200;
    let offset = (!$values[1]?.reduceMotion ? 200 : 100) * (!$values[0].back ? -1 : 1);
// TODO: Move transitions here
    return {
        in: { duration: duration, delay: duration, x: offset * -1, easing: cubicOut },
        out: { duration: duration, x: offset, easing: cubicIn }
    };
});