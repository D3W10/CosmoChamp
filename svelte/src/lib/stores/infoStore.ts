import { derived } from "svelte/store";
import { app } from "./appStore";

export const info = derived(app, ($app) => $app?.getAppInfo());