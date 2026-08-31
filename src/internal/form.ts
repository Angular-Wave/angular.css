export type NativeControl =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

export function syncNativeControlState(element: NativeControl): void {
  element.setAttribute("data-disabled", String(element.disabled));
  element.setAttribute("data-required", String(element.required));

  if (element.disabled) element.setAttribute("aria-disabled", "true");
  else element.removeAttribute("aria-disabled");

  if (element.required) element.setAttribute("aria-required", "true");
  else element.removeAttribute("aria-required");
}
