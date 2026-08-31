import { isDisabled, onDestroy, queryAll, setOpenState } from "./dom";

let overlayIdCounter = 0;
let scrollLockCount = 0;
let documentElementOverflow = "";
let bodyOverflow = "";

const openOverlayStack: HTMLElement[] = [];
const focusableSelector = [
  "a[href]",
  "button",
  "input",
  "select",
  "textarea",
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(", ");

const setAttributeIfChanged = (
  element: HTMLElement,
  name: string,
  value: string,
): void => {
  if (element.getAttribute(name) !== value) {
    element.setAttribute(name, value);
  }
};

export function restoreFocus(element: HTMLElement | null): void {
  if (element?.isConnected && !isDisabled(element)) {
    element.focus({ preventScroll: true });
  }
}

export function bindEscapeClose(
  elements: HTMLElement[],
  isOpen: () => boolean,
  close: () => void,
): () => void {
  const handleKeydown = (event: KeyboardEvent): void => {
    if (event.key !== "Escape" || !isOpen()) return;
    event.preventDefault();
    close();
  };

  elements.forEach((element) =>
    element.addEventListener("keydown", handleKeydown),
  );
  return () =>
    elements.forEach((element) =>
      element.removeEventListener("keydown", handleKeydown),
    );
}

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

interface InertSnapshot {
  ariaHidden: string | null;
  inert: boolean;
}

const lockDocumentScroll = (): void => {
  if (scrollLockCount === 0) {
    documentElementOverflow = document.documentElement.style.overflow;
    bodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }
  scrollLockCount += 1;
};

const unlockDocumentScroll = (): void => {
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) {
    document.documentElement.style.overflow = documentElementOverflow;
    document.body.style.overflow = bodyOverflow;
  }
};

export function bindOverlay(
  scope: ng.Scope | null | undefined,
  element: HTMLElement,
  parts: OverlayParts,
): void {
  const rootSelector = parts.rootSelector;
  const isOwned = (candidate: Element): boolean =>
    !rootSelector || candidate.closest(rootSelector) === element;
  const ownedAll = <T extends HTMLElement>(selector: string): T[] =>
    queryAll<T>(element, selector).filter(isOwned);
  const owned = <T extends HTMLElement>(selector?: string): T | null =>
    selector ? (ownedAll<T>(selector)[0] ?? null) : null;

  if (!element.id) {
    element.id = `overlay-${overlayIdCounter++}`;
  }

  const directionOwner = element.closest<HTMLElement>("[dir]") || element;
  const boundTriggers = new Set<HTMLElement>();
  const boundCloseButtons = new Set<HTMLElement>();
  const boundOverlays = new Set<HTMLElement>();
  const inertSnapshots = new Map<HTMLElement, InertSnapshot>();
  let internalOpen =
    element.getAttribute("data-open") === "true" ||
    owned(parts.contentSelector)?.getAttribute("data-open") === "true";
  let initialized = false;
  let isolated = false;
  let activeTrigger: HTMLElement | null = null;
  let redirectingFocus = false;

  const getContent = (): HTMLElement | null => owned(parts.contentSelector);
  const getOverlay = (): HTMLElement | null => owned(parts.overlaySelector);
  const getInternalTriggers = (): HTMLElement[] =>
    parts.triggerSelector ? ownedAll(parts.triggerSelector) : [];
  const getExternalTriggers = (): HTMLElement[] =>
    [
      ...new Set([
        ...queryAll<HTMLElement>(
          document,
          `[aria-controls="${CSS.escape(element.id)}"]`,
        ),
        ...queryAll<HTMLElement>(
          document,
          `[data-overlay-target="${CSS.escape(element.id)}"]`,
        ),
      ]),
    ].filter((trigger) => !element.contains(trigger));
  const getTriggers = (): HTMLElement[] => [
    ...getInternalTriggers(),
    ...getExternalTriggers(),
  ];

  const isTopmost = (): boolean =>
    openOverlayStack[openOverlayStack.length - 1] === element;
  const removeFromStack = (): void => {
    const index = openOverlayStack.lastIndexOf(element);
    if (index >= 0) openOverlayStack.splice(index, 1);
  };

  const isolateBackground = (): void => {
    if (isolated) return;
    let branch: HTMLElement = element;
    let parent = branch.parentElement;

    while (parent) {
      Array.from(parent.children).forEach((sibling) => {
        if (
          sibling === branch ||
          !(sibling instanceof HTMLElement) ||
          /^(LINK|SCRIPT|STYLE)$/.test(sibling.tagName) ||
          inertSnapshots.has(sibling)
        ) {
          return;
        }
        inertSnapshots.set(sibling, {
          ariaHidden: sibling.getAttribute("aria-hidden"),
          inert: sibling.inert,
        });
        sibling.inert = true;
        sibling.setAttribute("aria-hidden", "true");
      });
      if (parent === document.body) break;
      branch = parent;
      parent = parent.parentElement;
    }

    lockDocumentScroll();
    isolated = true;
  };

  const restoreBackground = (): void => {
    if (!isolated) return;
    inertSnapshots.forEach((snapshot, sibling) => {
      sibling.inert = snapshot.inert;
      if (snapshot.ariaHidden === null) {
        sibling.removeAttribute("aria-hidden");
      } else {
        sibling.setAttribute("aria-hidden", snapshot.ariaHidden);
      }
    });
    inertSnapshots.clear();
    unlockDocumentScroll();
    isolated = false;
  };

  const getFocusableItems = (): HTMLElement[] => {
    const content = getContent();
    if (!content) return [];
    return queryAll<HTMLElement>(content, focusableSelector).filter((item) => {
      if (
        !isOwned(item) ||
        isDisabled(item) ||
        item.closest("[hidden], [inert]")
      ) {
        return false;
      }
      const style = getComputedStyle(item);
      return style.display !== "none" && style.visibility !== "hidden";
    });
  };

  const focusClosest = (): void => {
    const content = getContent();
    if (!content) return;
    const autofocus = ownedAll<HTMLElement>("[autofocus]").find((candidate) =>
      content.contains(candidate),
    );
    (autofocus ?? getFocusableItems()[0] ?? content).focus({
      preventScroll: true,
    });
  };

  const reflectState = (): void => {
    const content = getContent();
    const overlay = getOverlay();
    const state = internalOpen ? "open" : "closed";
    setAttributeIfChanged(element, "data-open", String(internalOpen));
    setAttributeIfChanged(element, "data-state", state);

    if (content) {
      setAttributeIfChanged(content, "data-open", String(internalOpen));
      setAttributeIfChanged(content, "data-state", state);
      setAttributeIfChanged(content, "aria-hidden", String(!internalOpen));
      setOpenState(content, internalOpen);
    }
    if (overlay) {
      setAttributeIfChanged(overlay, "data-state", state);
      setAttributeIfChanged(overlay, "aria-hidden", String(!internalOpen));
      setOpenState(overlay, internalOpen);
    }
    getTriggers().forEach((trigger) => {
      setAttributeIfChanged(trigger, "data-state", state);
      setAttributeIfChanged(trigger, "aria-expanded", String(internalOpen));
    });
  };

  const setOpen = (nextOpen: boolean, restoreOnClose = true): void => {
    const wasOpen = initialized && internalOpen;
    const opening = nextOpen && !wasOpen;
    const closing = !nextOpen && wasOpen;
    internalOpen = nextOpen;
    reflectState();

    if (opening) {
      removeFromStack();
      openOverlayStack.push(element);
      isolateBackground();
      focusClosest();
    } else if (closing) {
      removeFromStack();
      restoreBackground();
      if (restoreOnClose) {
        restoreFocus(activeTrigger ?? getTriggers()[0] ?? null);
      }
    }
    initialized = true;
  };

  const handleTriggerClick = (event: MouseEvent): void => {
    const trigger = event.currentTarget;
    if (!(trigger instanceof HTMLElement) || isDisabled(trigger)) return;
    event.preventDefault();
    activeTrigger = trigger;
    setOpen(!internalOpen);
  };
  const handleCloseClick = (event: MouseEvent): void => {
    const closeButton = event.currentTarget;
    if (!(closeButton instanceof HTMLElement) || isDisabled(closeButton))
      return;
    event.preventDefault();
    setOpen(false);
  };
  const handleOverlayClick = (event: MouseEvent): void => {
    if (
      parts.closeOnOverlayClick === false ||
      event.target !== event.currentTarget
    ) {
      return;
    }
    setOpen(false);
  };

  const syncDirection = (): void => {
    const direction =
      element.closest<HTMLElement>("[dir]")?.getAttribute("dir") === "rtl"
        ? "rtl"
        : "ltr";
    setAttributeIfChanged(element, "data-direction", direction);
    const content = getContent();
    if (content) setAttributeIfChanged(content, "data-direction", direction);
    const overlay = getOverlay();
    if (overlay) setAttributeIfChanged(overlay, "data-direction", direction);
  };

  const syncInteractiveParts = (): void => {
    const content = getContent();
    if (content) {
      if (!content.id) content.id = `${element.id}-content`;
      setAttributeIfChanged(content, "role", parts.contentRole ?? "dialog");
      setAttributeIfChanged(content, "aria-modal", "true");
      if (!content.hasAttribute("tabindex")) content.tabIndex = -1;

      const title = owned(parts.titleSelector);
      if (title) {
        if (!title.id) title.id = `${element.id}-title`;
        setAttributeIfChanged(content, "aria-labelledby", title.id);
      }
      const description = owned(parts.descriptionSelector);
      if (description) {
        if (!description.id) description.id = `${element.id}-description`;
        setAttributeIfChanged(content, "aria-describedby", description.id);
      }
    }

    getInternalTriggers().forEach((trigger) => {
      if (content) setAttributeIfChanged(trigger, "aria-controls", content.id);
      setAttributeIfChanged(trigger, "aria-haspopup", "dialog");
      if (
        trigger instanceof HTMLButtonElement &&
        !trigger.hasAttribute("type")
      ) {
        trigger.type = "button";
      }
    });
    getTriggers().forEach((trigger) => {
      if (trigger.getAttribute("data-overlay-target") === element.id) {
        setAttributeIfChanged(trigger, "aria-controls", element.id);
      }
      setAttributeIfChanged(trigger, "aria-haspopup", "dialog");
      if (
        trigger instanceof HTMLButtonElement &&
        !trigger.hasAttribute("type")
      ) {
        trigger.type = "button";
      }
      if (!boundTriggers.has(trigger)) {
        trigger.addEventListener("click", handleTriggerClick);
        boundTriggers.add(trigger);
      }
    });
    ownedAll(parts.closeSelector).forEach((closeButton) => {
      if (
        closeButton instanceof HTMLButtonElement &&
        !closeButton.hasAttribute("type")
      ) {
        closeButton.type = "button";
      }
      if (!boundCloseButtons.has(closeButton)) {
        closeButton.addEventListener("click", handleCloseClick);
        boundCloseButtons.add(closeButton);
      }
    });
    ownedAll(parts.overlaySelector).forEach((overlay) => {
      if (!boundOverlays.has(overlay)) {
        overlay.addEventListener("click", handleOverlayClick);
        boundOverlays.add(overlay);
      }
    });
    reflectState();
  };

  const handleDocumentClick = (event: MouseEvent): void => {
    if (
      !internalOpen ||
      !isTopmost() ||
      parts.closeOnOutsideClick !== true ||
      !(event.target instanceof Node) ||
      element.contains(event.target) ||
      getTriggers().some((trigger) => trigger.contains(event.target as Node))
    ) {
      return;
    }
    setOpen(false, false);
  };

  const handleDocumentKeydown = (event: KeyboardEvent): void => {
    if (!internalOpen || !isTopmost()) return;
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (event.key !== "Tab") return;

    const content = getContent();
    const focusableItems = getFocusableItems();
    if (!content || focusableItems.length === 0) {
      event.preventDefault();
      content?.focus({ preventScroll: true });
      return;
    }
    const currentIndex = focusableItems.indexOf(
      document.activeElement as HTMLElement,
    );
    const nextIndex = event.shiftKey
      ? currentIndex <= 0
        ? focusableItems.length - 1
        : currentIndex - 1
      : currentIndex < 0 || currentIndex === focusableItems.length - 1
        ? 0
        : currentIndex + 1;
    event.preventDefault();
    focusableItems[nextIndex].focus({ preventScroll: true });
  };

  const handleDocumentFocus = (event: FocusEvent): void => {
    const content = getContent();
    if (
      redirectingFocus ||
      !internalOpen ||
      !isTopmost() ||
      !content ||
      !(event.target instanceof Node) ||
      content.contains(event.target)
    ) {
      return;
    }
    redirectingFocus = true;
    focusClosest();
    redirectingFocus = false;
  };

  const openObserver = new MutationObserver((records) => {
    if (
      records.some(
        (record) =>
          record.target === element && record.attributeName === "data-open",
      )
    ) {
      const nextOpen = element.getAttribute("data-open") === "true";
      if (nextOpen !== internalOpen) setOpen(nextOpen);
    }
    syncDirection();
  });
  openObserver.observe(element, {
    attributes: true,
    attributeFilter: ["data-open", "dir"],
  });
  const partsObserver = new MutationObserver(syncInteractiveParts);
  partsObserver.observe(document.body, { childList: true, subtree: true });
  const directionObserver =
    directionOwner === element ? null : new MutationObserver(syncDirection);
  directionObserver?.observe(directionOwner, {
    attributes: true,
    attributeFilter: ["dir"],
  });

  syncDirection();
  syncInteractiveParts();
  setOpen(internalOpen);
  document.addEventListener("click", handleDocumentClick);
  document.addEventListener("keydown", handleDocumentKeydown);
  document.addEventListener("focusin", handleDocumentFocus);

  onDestroy(scope, () => {
    openObserver.disconnect();
    partsObserver.disconnect();
    directionObserver?.disconnect();
    boundTriggers.forEach((trigger) =>
      trigger.removeEventListener("click", handleTriggerClick),
    );
    boundCloseButtons.forEach((closeButton) =>
      closeButton.removeEventListener("click", handleCloseClick),
    );
    boundOverlays.forEach((overlay) =>
      overlay.removeEventListener("click", handleOverlayClick),
    );
    document.removeEventListener("click", handleDocumentClick);
    document.removeEventListener("keydown", handleDocumentKeydown);
    document.removeEventListener("focusin", handleDocumentFocus);
    removeFromStack();
    restoreBackground();
  });
}
