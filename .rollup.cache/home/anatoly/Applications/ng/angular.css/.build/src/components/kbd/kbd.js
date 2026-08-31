export function kbdDirective() {
    return {
        link(_scope, element) {
            const label = element.textContent.trim();
            if (label && !element.hasAttribute("aria-label")) {
                element.setAttribute("aria-label", `Keyboard shortcut ${label}`);
            }
        },
    };
}
