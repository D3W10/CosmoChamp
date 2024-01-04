import type { Page } from "./Page.enum";

export interface IPages {
    switchPages: (page: Page) => void
}