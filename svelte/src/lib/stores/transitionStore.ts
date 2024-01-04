import { derived } from "svelte/store";
import { page } from "./pageStore";
import { cubicIn, cubicOut } from "svelte/easing";

export const transition = derived(page, ($page) => {
    return {
        in: { duration: 500, delay: 500, x: !$page.back ? 200 : -200, easing: cubicOut },
        out: { duration: 500, x: !$page.back ? -200 : 200, easing: cubicIn }
    };
});