type Direction = "ltr" | "rtl";
export declare const getSemanticMenuItemRole: (item: HTMLElement) => "menuitem" | "menuitemcheckbox" | "menuitemradio";
export declare function bindSemanticSubmenus(root: HTMLElement, prefix: "context-menu" | "dropdown-menu" | "menubar", getDirection: () => Direction): () => void;
export {};
