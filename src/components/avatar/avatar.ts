import type {} from "@angular-wave/angular.ts";

import { onDestroy, query } from "../../internal/dom";

export function avatarDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      const size =
        element.getAttribute("size") ??
        element.getAttribute("data-size") ??
        "default";
      element.setAttribute("data-size", size);

      const image = query(element, ".avatar-image", HTMLImageElement);
      const fallback = query(element, ".avatar-fallback", HTMLElement);

      const setState = (state: "loaded" | "fallback") => {
        element.setAttribute("data-state", state);
        if (image) image.hidden = state === "fallback";
        if (fallback) fallback.hidden = state === "loaded";
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
      setState(
        image.complete && image.naturalWidth > 0 ? "loaded" : "fallback",
      );

      onDestroy(scope, () => {
        image.removeEventListener("load", handleLoad);
        image.removeEventListener("error", handleError);
      });
    },
  };
}
