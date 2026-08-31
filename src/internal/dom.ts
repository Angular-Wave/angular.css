export function query<T extends Element>(
  root: ParentNode,
  selector: string,
): T | null {
  return root.querySelector<T>(selector);
}

export function queryAll<T extends Element>(
  root: ParentNode,
  selector: string,
): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

export function setOpenState(element: HTMLElement, open: boolean): void {
  const nextOpen = String(open);
  if (element.getAttribute("data-open") !== nextOpen) {
    element.setAttribute("data-open", nextOpen);
  }
  if (element.hidden === open) {
    element.hidden = !open;
  }
}

export function isDisabled(element: Element): boolean {
  return (
    element.hasAttribute("disabled") ||
    element.getAttribute("aria-disabled") === "true" ||
    element.getAttribute("data-disabled") === "true"
  );
}

export function nextIndex(
  currentIndex: number,
  length: number,
  direction: 1 | -1,
): number {
  if (length <= 0) return -1;
  if (currentIndex < 0) return direction === 1 ? 0 : length - 1;
  return (currentIndex + direction + length) % length;
}

export function onDestroy(
  scope: ng.Scope | null | undefined,
  cleanup: () => void,
): void {
  if (typeof scope?.$on === "function") {
    scope.$on("$destroy", cleanup);
  }
}
