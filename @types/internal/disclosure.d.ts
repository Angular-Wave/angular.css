export declare function restoreFocus(element: HTMLElement | null): void;
export declare function bindEscapeClose(targets: HTMLElement[], isOpen: () => boolean, close: () => void): () => void;
export type OverlayParts = {
    closeSelector: string;
    contentSelector: string;
    contentRole?: "alertdialog" | "dialog";
    closeOnOverlayClick?: boolean;
    overlaySelector: string;
    closeOnOutsideClick?: boolean;
    descriptionSelector?: string;
    titleSelector?: string;
    triggerSelector?: string;
};
export declare function bindOverlay(scope: ng.Scope, element: HTMLElement, { closeSelector, contentRole, contentSelector, closeOnOverlayClick, overlaySelector, closeOnOutsideClick, descriptionSelector, titleSelector, triggerSelector: internalTriggerSelector, }: OverlayParts): void;
