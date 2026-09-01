import { isDisabled, query, queryAll, setOpenState } from "./dom";

type Direction = "ltr" | "rtl";

const itemSelector =
  'a[href], button, [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]';

export function bindSemanticSubmenus(
  root: HTMLElement,
  prefix: "context-menu" | "dropdown-menu" | "menubar",
  getDirection: () => Direction,
): () => void {
  const subSelector = `.${prefix}-sub, [ng-${prefix}-sub]`;
  const triggerSelector = `.${prefix}-sub-trigger, [ng-${prefix}-sub-trigger]`;
  const contentSelector = `.${prefix}-sub-content, [ng-${prefix}-sub-content]`;
  const cleanups = new Map<HTMLElement, () => void>();
  let submenuId = 0;

  const bindSubmenu = (submenu: HTMLElement) => {
    if (cleanups.has(submenu)) return;

    const trigger = query(submenu, triggerSelector, HTMLElement);
    const content = query(submenu, contentSelector, HTMLElement);
    if (!trigger || !content) return;

    const contentId =
      content.id || `${prefix}-sub-content-${String(submenuId++)}`;
    content.id = contentId;
    trigger.setAttribute("aria-controls", contentId);
    trigger.setAttribute("aria-haspopup", "menu");
    content.setAttribute("role", "menu");
    const getItems = () =>
      queryAll<HTMLElement>(content, itemSelector).filter(
        (item) => !isDisabled(item),
      );
    const syncItems = () => {
      getItems().forEach((item) => {
        if (item.hasAttribute("role")) return;
        const role = item.matches(`.${prefix}-checkbox-item`)
          ? "menuitemcheckbox"
          : item.matches(`.${prefix}-radio-item`)
            ? "menuitemradio"
            : "menuitem";
        item.setAttribute("role", role);
        if (role !== "menuitem" && !item.hasAttribute("aria-checked")) {
          item.setAttribute("aria-checked", "false");
        }
      });
    };

    let open =
      submenu.getAttribute("data-open") === "true" ||
      submenu.getAttribute("data-state") === "open";

    const setOpen = (nextOpen: boolean, focus = false) => {
      open = nextOpen;
      const state = open ? "open" : "closed";
      submenu.setAttribute("data-open", String(open));
      submenu.setAttribute("data-state", state);
      trigger.setAttribute("aria-expanded", String(open));
      trigger.setAttribute("data-state", state);
      content.setAttribute("data-state", state);
      content.setAttribute("aria-hidden", String(!open));
      setOpenState(content, open);
      syncItems();

      if (!focus) return;
      if (!open) {
        trigger.focus({ preventScroll: true });
        return;
      }

      const firstItem = getItems().find((item) => !item.closest("[hidden]"));
      (firstItem ?? content).focus({ preventScroll: true });
    };

    const handleClick = (event: MouseEvent) => {
      if (isDisabled(trigger)) return;
      event.preventDefault();
      event.stopPropagation();
      setOpen(!open, open);
    };
    const handlePointerEnter = () => {
      if (!isDisabled(trigger)) setOpen(true);
    };
    const handlePointerLeave = () => {
      setOpen(false);
    };
    const handleKeydown = (event: KeyboardEvent) => {
      const openKey = getDirection() === "rtl" ? "ArrowLeft" : "ArrowRight";
      const closeKey = getDirection() === "rtl" ? "ArrowRight" : "ArrowLeft";
      const target = event.target instanceof HTMLElement ? event.target : null;

      if (target === trigger && event.key === openKey) {
        event.preventDefault();
        event.stopPropagation();
        setOpen(true, true);
        return;
      }

      if (open && content.contains(target) && event.key === closeKey) {
        event.preventDefault();
        event.stopPropagation();
        setOpen(false, true);
        return;
      }

      if (open && event.key === "Escape") {
        setOpen(false, true);
      }
    };
    const syncAuthoredState = () => {
      const authoredOpen = submenu.getAttribute("data-open");
      if (authoredOpen !== null && (authoredOpen === "true") !== open) {
        setOpen(authoredOpen === "true");
      }
    };

    trigger.addEventListener("click", handleClick);
    submenu.addEventListener("pointerenter", handlePointerEnter);
    submenu.addEventListener("pointerleave", handlePointerLeave);
    submenu.addEventListener("keydown", handleKeydown, true);
    const stateObserver = new MutationObserver(syncAuthoredState);
    stateObserver.observe(submenu, {
      attributes: true,
      attributeFilter: ["data-open"],
    });
    syncItems();
    setOpen(open);

    cleanups.set(submenu, () => {
      trigger.removeEventListener("click", handleClick);
      submenu.removeEventListener("pointerenter", handlePointerEnter);
      submenu.removeEventListener("pointerleave", handlePointerLeave);
      submenu.removeEventListener("keydown", handleKeydown, true);
      stateObserver.disconnect();
    });
  };

  const sync = () => {
    queryAll<HTMLElement>(root, subSelector).forEach(bindSubmenu);
    cleanups.forEach((cleanup, submenu) => {
      if (!submenu.isConnected || !root.contains(submenu)) {
        cleanup();
        cleanups.delete(submenu);
      }
    });
    if (root.getAttribute("data-state") === "closed") {
      queryAll<HTMLElement>(root, subSelector).forEach((submenu) => {
        if (submenu.getAttribute("data-open") !== "false") {
          submenu.setAttribute("data-open", "false");
        }
      });
    }
  };

  const observer = new MutationObserver(sync);
  observer.observe(root, {
    attributes: true,
    attributeFilter: ["data-state"],
    childList: true,
    subtree: true,
  });
  sync();

  return () => {
    observer.disconnect();
    cleanups.forEach((cleanup) => {
      cleanup();
    });
    cleanups.clear();
  };
}
