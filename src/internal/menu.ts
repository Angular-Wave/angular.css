import {
  fitViewportRect,
  isDisabled,
  query,
  queryAll,
  setOpenState,
} from "./dom";

type Direction = "ltr" | "rtl";

const itemSelector =
  'a[href], button, [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]';

export const getSemanticMenuItemRole = (
  item: HTMLElement,
): "menuitem" | "menuitemcheckbox" | "menuitemradio" => {
  const menu = item.closest("menu");
  const fieldset = item.closest("fieldset");
  if (fieldset?.closest("menu") === menu) {
    return "menuitemradio";
  }
  if (item.hasAttribute("aria-checked")) return "menuitemcheckbox";
  return "menuitem";
};

export function bindSemanticSubmenus(
  root: HTMLElement,
  prefix: "context-menu" | "dropdown-menu" | "menubar",
  getDirection: () => Direction,
): () => void {
  const subSelector = "details";
  const triggerSelector = ":scope > summary";
  const contentSelector = ":scope > menu";
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
    trigger.setAttribute("role", "menuitem");
    trigger.setAttribute("aria-controls", contentId);
    trigger.setAttribute("aria-haspopup", "menu");
    content.setAttribute("role", "menu");
    const getItems = () =>
      queryAll<HTMLElement>(content, itemSelector).filter(
        (item) => item.closest("menu") === content && !isDisabled(item),
      );
    const syncItems = () => {
      getItems().forEach((item) => {
        if (item.hasAttribute("role")) return;
        const role = getSemanticMenuItemRole(item);
        item.setAttribute("role", role);
        if (role !== "menuitem" && !item.hasAttribute("aria-checked")) {
          item.setAttribute("aria-checked", "false");
        }
      });
    };

    let open = submenu instanceof HTMLDetailsElement && submenu.open;

    const positionContent = () => {
      if (!open) return;
      const triggerRect = trigger.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      const containingBlock =
        content.offsetParent instanceof HTMLElement
          ? content.offsetParent
          : document.documentElement;
      const containingRect = containingBlock.getBoundingClientRect();
      const margin = 4;
      const offset = 4;
      const opensLeft = getDirection() === "rtl";
      let left = opensLeft
        ? triggerRect.left - contentRect.width - offset
        : triggerRect.right + offset;
      const oppositeLeft = opensLeft
        ? triggerRect.right + offset
        : triggerRect.left - contentRect.width - offset;
      const preferredFits =
        left >= margin &&
        left + contentRect.width <= window.innerWidth - margin;
      const oppositeFits =
        oppositeLeft >= margin &&
        oppositeLeft + contentRect.width <= window.innerWidth - margin;
      if (!preferredFits && oppositeFits) left = oppositeLeft;

      const fitted = fitViewportRect(
        left,
        triggerRect.top - offset,
        contentRect.width,
        contentRect.height,
        margin,
      );
      content.style.inset = "auto";
      content.style.left = `${String(Math.round(fitted._left - containingRect.left + containingBlock.scrollLeft))}px`;
      content.style.top = `${String(Math.round(fitted._top - containingRect.top + containingBlock.scrollTop))}px`;
      content.style.maxHeight = `${String(Math.round(fitted._availableHeight))}px`;
      content.style.overflowY = "auto";
    };

    const setOpen = (nextOpen: boolean, focus = false) => {
      open = nextOpen;
      if (submenu instanceof HTMLDetailsElement) submenu.open = open;
      trigger.setAttribute("aria-expanded", String(open));
      content.setAttribute("aria-hidden", String(!open));
      setOpenState(content, open);
      syncItems();
      if (open) {
        positionContent();
        requestAnimationFrame(positionContent);
      }

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
      if (submenu instanceof HTMLDetailsElement && submenu.open !== open) {
        setOpen(submenu.open);
      }
    };

    trigger.addEventListener("click", handleClick);
    submenu.addEventListener("pointerenter", handlePointerEnter);
    submenu.addEventListener("pointerleave", handlePointerLeave);
    submenu.addEventListener("keydown", handleKeydown, true);
    window.addEventListener("resize", positionContent);
    window.addEventListener("scroll", positionContent, true);
    const stateObserver = new MutationObserver(syncAuthoredState);
    const sizeObserver = new ResizeObserver(positionContent);
    stateObserver.observe(submenu, {
      attributes: true,
      attributeFilter: ["open"],
    });
    sizeObserver.observe(content);
    syncItems();
    setOpen(open);

    cleanups.set(submenu, () => {
      trigger.removeEventListener("click", handleClick);
      submenu.removeEventListener("pointerenter", handlePointerEnter);
      submenu.removeEventListener("pointerleave", handlePointerLeave);
      submenu.removeEventListener("keydown", handleKeydown, true);
      window.removeEventListener("resize", positionContent);
      window.removeEventListener("scroll", positionContent, true);
      stateObserver.disconnect();
      sizeObserver.disconnect();
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
    if (root.hidden) {
      queryAll<HTMLElement>(root, subSelector).forEach((submenu) => {
        if (submenu instanceof HTMLDetailsElement && submenu.open) {
          submenu.open = false;
        }
      });
    }
  };

  const observer = new MutationObserver(sync);
  observer.observe(root, {
    attributes: true,
    attributeFilter: ["hidden"],
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
