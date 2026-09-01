export declare function restoreFocus(element: HTMLElement | null): void;
export declare function bindEscapeClose(elements: HTMLElement[], isOpen: () => boolean, close: () => void): () => void;
export interface OverlayParts {
    closeSelector: string;
    contentSelector: string;
    descriptionSelector?: string;
    overlaySelector: string;
    titleSelector?: string;
    triggerSelector?: string;
    rootSelector?: string;
    contentRole?: "alertdialog" | "dialog";
    closeOnOverlayClick?: boolean;
    closeOnOutsideClick?: boolean;
}
export declare function bindOverlay(scope: ng.Scope | null | undefined, element: HTMLElement, parts: OverlayParts): void;
