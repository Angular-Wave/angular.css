import type {} from "@angular-wave/angular.ts";

const separatorSelector =
  '[data-slot="button-group-separator"], [ng-button-group-separator]';

const normalizeOrientation = (
  value: string | null,
  fallback: "horizontal" | "vertical",
): "horizontal" | "vertical" => {
  if (value === "vertical" || value === "column") return "vertical";
  if (value === "horizontal" || value === "row") return "horizontal";
  return fallback;
};

export function buttonGroupDirective(): ng.Directive {
  return {
    link(_scope: ng.Scope, element: HTMLElement) {
      const orientation = normalizeOrientation(
        element.getAttribute("orientation") ??
          element.getAttribute("data-orientation"),
        "horizontal",
      );

      element.setAttribute("role", element.getAttribute("role") ?? "group");
      element.setAttribute("data-orientation", orientation);

      element
        .querySelectorAll<HTMLElement>(separatorSelector)
        .forEach((separator) => {
          const separatorOrientation = normalizeOrientation(
            separator.getAttribute("orientation") ??
              separator.getAttribute("data-orientation"),
            "vertical",
          );
          separator.setAttribute(
            "role",
            separator.getAttribute("role") ?? "separator",
          );
          separator.setAttribute("data-orientation", separatorOrientation);
          separator.setAttribute("aria-orientation", separatorOrientation);
        });
    },
  };
}
