import type {} from "@angular-wave/angular.ts";

import {
  angular,
  angularCssDirectives,
  angularCssModuleName,
  registerAngularCss,
} from "./index";

describe("index", () => {
  it("exports the module name", () => {
    expect(angularCssModuleName).toEqual("ui");
  });

  it("exports the detected angular global", () => {
    expect(angular).toEqual(globalThis.angular);
  });

  it("registers directives when an angular-compatible object is provided", () => {
    const directives: string[] = [];
    const ng = {
      module(name: string, dependencies: string[]) {
        return {
          dependencies,
          directive(directiveName: string) {
            directives.push(directiveName);
            return this;
          },
          name,
        };
      },
    } as unknown as typeof angular;

    const module = registerAngularCss(ng);

    expect(module?.name).toEqual("ui");
    expect(module?.dependencies).toEqual([]);
    expect(directives).toEqual(angularCssDirectives.map(([name]) => name));
    expect(directives).not.toContain("ngInput");
  });
});
