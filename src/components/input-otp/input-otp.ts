import type {} from "@angular-wave/angular.ts";

import { onDestroy, queryAll } from "../../internal/dom";

const setAttributeIfChanged = (
  element: HTMLElement,
  name: string,
  value: string,
) => {
  if (element.getAttribute(name) !== value) {
    element.setAttribute(name, value);
  }
};

export function inputOtpDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      let inputs = queryAll<HTMLInputElement>(element, "input");
      const cleanupInputs = new WeakMap<HTMLInputElement, () => void>();

      const focusInput = (index: number) => {
        const input = inputs.at(index);
        if (input) input.focus();
      };

      const syncValue = () => {
        const value = inputs.map((input) => input.value).join("");
        element.setAttribute("data-value", value);
        setAttributeIfChanged(
          element,
          "data-complete",
          String(inputs.length > 0 && inputs.every((input) => input.value)),
        );
        setAttributeIfChanged(
          element,
          "data-disabled",
          String(inputs.some((input) => input.disabled)),
        );
        setAttributeIfChanged(
          element,
          "data-invalid",
          String(
            inputs.some(
              (input) =>
                input.getAttribute("aria-invalid") === "true" ||
                !input.validity.valid,
            ),
          ),
        );
      };

      const bindInput = (input: HTMLInputElement) => {
        if (cleanupInputs.has(input)) return;

        input.setAttribute(
          "autocomplete",
          input.autocomplete || "one-time-code",
        );
        input.setAttribute(
          "inputmode",
          input.getAttribute("inputmode") ?? "numeric",
        );
        if (!input.hasAttribute("maxlength")) {
          input.setAttribute("maxlength", "1");
        }
        input.setAttribute(
          "aria-label",
          input.getAttribute("aria-label") ??
            `Digit ${String(inputs.indexOf(input) + 1)}`,
        );

        const handleInput = () => {
          input.value = input.value.slice(-1);
          syncValue();
          if (input.value) focusInput(inputs.indexOf(input) + 1);
        };

        const handleKeydown = (event: KeyboardEvent) => {
          if (event.key === "Backspace" && !input.value) {
            focusInput(inputs.indexOf(input) - 1);
          }
        };

        const handlePaste = (event: ClipboardEvent) => {
          const pasted = event.clipboardData?.getData("text").trim();
          if (!pasted) return;
          event.preventDefault();

          const startIndex = inputs.indexOf(input);
          pasted
            .slice(0, inputs.length - startIndex)
            .split("")
            .forEach((character, offset) => {
              const target = inputs[startIndex + offset];
              target.value = character;
              target.dispatchEvent(new Event("input", { bubbles: true }));
            });
          syncValue();
          focusInput(Math.min(startIndex + pasted.length, inputs.length - 1));
        };

        const handleFocus = () => {
          queryAll<HTMLElement>(element, ".input-otp-slot").forEach((slot) => {
            setAttributeIfChanged(
              slot,
              "data-active",
              String(slot.contains(input)),
            );
          });
        };

        const handleBlur = () => {
          const slot = input.closest<HTMLElement>(".input-otp-slot");
          if (slot) setAttributeIfChanged(slot, "data-active", "false");
        };

        input.addEventListener("input", handleInput);
        input.addEventListener("keydown", handleKeydown);
        input.addEventListener("paste", handlePaste);
        input.addEventListener("focus", handleFocus);
        input.addEventListener("blur", handleBlur);
        cleanupInputs.set(input, () => {
          input.removeEventListener("input", handleInput);
          input.removeEventListener("keydown", handleKeydown);
          input.removeEventListener("paste", handlePaste);
          input.removeEventListener("focus", handleFocus);
          input.removeEventListener("blur", handleBlur);
        });
      };

      const syncInputs = () => {
        inputs = queryAll<HTMLInputElement>(element, "input");
        inputs.forEach((input, index) => {
          bindInput(input);
          input.setAttribute(
            "aria-label",
            input.getAttribute("aria-label") ?? `Digit ${String(index + 1)}`,
          );
        });
        syncValue();
      };

      const observer = new MutationObserver(syncInputs);
      observer.observe(element, {
        attributes: true,
        attributeFilter: [
          "aria-invalid",
          "data-invalid",
          "disabled",
          "maxlength",
          "required",
          "value",
        ],
        childList: true,
        subtree: true,
      });

      syncInputs();

      onDestroy(scope, () => {
        observer.disconnect();
        queryAll<HTMLInputElement>(element, "input").forEach((input) => {
          cleanupInputs.get(input)?.();
        });
      });
    },
  };
}
