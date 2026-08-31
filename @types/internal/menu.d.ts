type Direction = "ltr" | "rtl";
export declare function bindSemanticSubmenus(root: HTMLElement, prefix: "context-menu" | "dropdown-menu" | "menubar", getDirection: () => Direction): () => void;
export {};
