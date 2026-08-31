import { onDestroy, query } from "../../internal/dom";
export function avatarDirective() {
    return {
        link(scope, element) {
            const size = element.getAttribute("size") ??
                element.getAttribute("data-size") ??
                "default";
            element.setAttribute("data-size", size);
            const image = query(element, '[data-slot="avatar-image"], [ng-avatar-image]', HTMLImageElement);
            const fallback = query(element, '[data-slot="avatar-fallback"], [ng-avatar-fallback]', HTMLElement);
            const setState = (state) => {
                element.setAttribute("data-state", state);
                if (image)
                    image.hidden = state === "fallback";
                if (fallback)
                    fallback.hidden = state === "loaded";
            };
            if (!image) {
                setState("fallback");
                return;
            }
            const handleLoad = () => {
                setState("loaded");
            };
            const handleError = () => {
                setState("fallback");
            };
            image.addEventListener("load", handleLoad);
            image.addEventListener("error", handleError);
            setState(image.complete && image.naturalWidth > 0 ? "loaded" : "fallback");
            onDestroy(scope, () => {
                image.removeEventListener("load", handleLoad);
                image.removeEventListener("error", handleError);
            });
        },
    };
}
