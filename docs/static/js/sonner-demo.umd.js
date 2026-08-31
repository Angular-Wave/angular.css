(function () {
  'use strict';

  /**
   * @license lucide v1.33.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */

  const defaultAttributes = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": 2,
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  };

  /**
   * @license lucide v1.33.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */


  const createSVGElement = ([tag, attrs, children]) => {
    const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.keys(attrs).forEach((name) => {
      element.setAttribute(name, String(attrs[name]));
    });
    if (children?.length) {
      children.forEach((child) => {
        const childElement = createSVGElement(child);
        element.appendChild(childElement);
      });
    }
    return element;
  };
  const createElement = (iconNode, customAttrs = {}) => {
    const tag = "svg";
    const attrs = {
      ...defaultAttributes,
      ...customAttrs
    };
    return createSVGElement([tag, attrs, iconNode]);
  };

  /**
   * @license lucide v1.33.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */

  const CircleCheck = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "m9 12 2 2 4-4" }]
  ];

  /**
   * @license lucide v1.33.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */

  const CircleX = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "m15 9-6 6" }],
    ["path", { d: "m9 9 6 6" }]
  ];

  /**
   * @license lucide v1.33.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */

  const Info = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M12 16v-4" }],
    ["path", { d: "M12 8h.01" }]
  ];

  /**
   * @license lucide v1.33.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */

  const LoaderCircle = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56" }]];

  /**
   * @license lucide v1.33.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */

  const TriangleAlert = [
    ["path", { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" }],
    ["path", { d: "M12 9v4" }],
    ["path", { d: "M12 17h.01" }]
  ];

  /**
   * @license lucide v1.33.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */

  const X = [
    ["path", { d: "M18 6 6 18" }],
    ["path", { d: "m6 6 12 12" }]
  ];

  const toastIcons = {
      close: X,
      error: CircleX,
      info: Info,
      loading: LoaderCircle,
      success: CircleCheck,
      warning: TriangleAlert,
  };
  class SonnerDemoController {
      constructor() {
          this.descriptionVisible = false;
          this.descriptionStatus = "Ready";
          this.position = "bottom-right";
          this.positionVisible = false;
          this.type = "default";
          this.typeMessage = "Event has been created";
          this.typeVisible = false;
          this.promiseVersion = 0;
      }
      showDescription() {
          this.descriptionVisible = true;
          this.descriptionStatus = "Toast shown";
      }
      dismissDescription() {
          this.descriptionVisible = false;
          this.descriptionStatus = "Toast dismissed";
      }
      showPosition(position) {
          this.position = position;
          this.positionVisible = true;
      }
      dismissPosition() {
          this.positionVisible = false;
      }
      showType(type) {
          this.promiseVersion += 1;
          this.type = type;
          this.typeMessage =
              type === "info"
                  ? "Be at the area 10 minutes before the event time"
                  : type === "warning"
                      ? "Event start time cannot be earlier than 8am"
                      : type === "error"
                          ? "Event has not been created"
                          : "Event has been created";
          this.typeVisible = true;
      }
      showPromise() {
          const version = ++this.promiseVersion;
          this.type = "loading";
          this.typeMessage = "Loading...";
          this.typeVisible = true;
          window.setTimeout(() => {
              if (version !== this.promiseVersion)
                  return;
              this.type = "success";
              this.typeMessage = "Event has been created";
          }, 800);
      }
      dismissType() {
          this.promiseVersion += 1;
          this.typeVisible = false;
      }
  }
  window.angular
      .module("sonnerDemo", ["ui"])
      .directive("ngSonnerIcon", () => ({
      link(_scope, element) {
          const type = element.getAttribute("ng-sonner-icon");
          const icon = type ? toastIcons[type] : undefined;
          if (!icon)
              return;
          element.replaceChildren(createElement(icon, {
              "aria-hidden": "true",
              focusable: "false",
              height: 16,
              width: 16,
          }));
      },
  }))
      .controller("SonnerDemoController", SonnerDemoController);

})();
