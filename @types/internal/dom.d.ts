type ElementConstructor<T extends Element> = abstract new (...args: never[]) => T;
export declare function query(root: ParentNode, selector: string): Element | null;
export declare function query<T extends Element>(root: ParentNode, selector: string, constructor: ElementConstructor<T>): T | null;
export declare function queryAll<T extends Element>(root: ParentNode, selector: string): T[];
export declare function setOpenState(element: HTMLElement, open: boolean): void;
export declare function isDisabled(element: Element): boolean;
export declare function nextIndex(currentIndex: number, length: number, direction: 1 | -1): number;
export declare function onDestroy(scope: ng.Scope | null | undefined, cleanup: () => void): void;
export {};
