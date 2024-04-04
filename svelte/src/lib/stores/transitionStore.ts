import { derived } from "svelte/store";
import { page } from "./pageStore";
import { settings } from "./settingsStore";
import { cubicIn, cubicOut, quintIn, quintOut } from "svelte/easing";

export const transition = derived([page, settings], ($values) => {
    let duration = !$values[1]?.reduceMotion ? 500 : 300;
    let offset = (!$values[1]?.reduceMotion ? 200 : 50) * (!$values[0].back ? -1 : 1);

    return {
        pageIn: { duration: duration, delay: duration, x: offset * -1, easing: cubicOut },
        pageOut: { duration: duration, x: offset, easing: cubicIn },
        comboFlow: { duration: 400, easing: quintOut },
        nameFlyIn: (rev: boolean) => { return { duration: 2000, x: (!$values[1]?.reduceMotion ? 410 : 205) * (!rev ? 1 : -1), easing: quintOut, opacity: (!$values[1]?.reduceMotion ? 1 : 0) }},
        nameFlyOut: (rev: boolean) => { return { duration: 2000, x: (!$values[1]?.reduceMotion ? 500 : 250) * (!rev ? 1 : -1), easing: quintIn, opacity: (!$values[1]?.reduceMotion ? 1 : 0) }}
    };
});

export function flip(node: HTMLElement, { y = 90, duration = 200, delay = 0, easing = cubicOut }) {
    return {
        duration,
        easing,
        delay,
        css: (t: number, u: number) => `transform: rotateY(${u * y}deg)`
    }
}