import type {} from "@angular-wave/angular.ts";

import {
  angular,
  angularCssDirectives,
  angularCssModuleName,
  registerAngularCss,
} from "./index";

describe("index", () => {
  it("exports the module name", () => {
    expect(angularCssModuleName).toEqual("angular.css");
  });

  it("exports the detected angular global", () => {
    const angularGlobal = globalThis as typeof globalThis & {
      angular?: typeof angular;
    };
    expect(angular).toEqual(angularGlobal.angular);
  });

  it("registers directives when an angular-compatible object is provided", () => {
    const directives: string[] = [];
    interface TestModule {
      dependencies: string[];
      directive(name: string): TestModule;
      name: string;
    }
    let registeredModule: TestModule | undefined;
    const ng = {
      module(name: string, dependencies?: string[]) {
        if (!dependencies) {
          if (!registeredModule) throw new Error("Module is not registered");
          return registeredModule;
        }
        registeredModule = {
          dependencies,
          directive(directiveName: string) {
            directives.push(directiveName);
            return this;
          },
          name,
        };
        return registeredModule;
      },
    } as unknown as typeof angular;

    const module = registerAngularCss(ng) as
      | (ng.NgModule & { dependencies: string[] })
      | undefined;

    expect(module?.name).toEqual("angular.css");
    expect(module?.dependencies).toEqual([]);
    expect(directives).toEqual(angularCssDirectives.map(([name]) => name));
    expect(directives).not.toContain("ngInput");

    expect(registerAngularCss(ng)).toBe(module);
    expect(directives).toHaveSize(angularCssDirectives.length);
  });

  it("adds directives to an existing module without recreating it", () => {
    const directives: string[] = [];
    const existing = {
      directive(name: string) {
        directives.push(name);
        return this;
      },
      name: angularCssModuleName,
    } as unknown as ng.NgModule;
    const ng = {
      module(name: string, dependencies?: string[]) {
        expect(name).toBe(angularCssModuleName);
        expect(dependencies).toBeUndefined();
        return existing;
      },
    } as unknown as typeof angular;

    expect(registerAngularCss(ng)).toBe(existing);
    expect(directives).toEqual(angularCssDirectives.map(([name]) => name));
  });

  it("uses the explicit AngularTS module API when available", () => {
    const directives: string[] = [];
    const existing = {
      directive(name: string) {
        directives.push(name);
        return this;
      },
      name: angularCssModuleName,
    } as unknown as ng.NgModule;
    const ng = {
      createModule() {
        throw new Error("Existing modules must not be recreated");
      },
      getModule(name: string) {
        expect(name).toBe(angularCssModuleName);
        return existing;
      },
    } as unknown as typeof angular;

    expect(registerAngularCss(ng)).toBe(existing);
    expect(directives).toEqual(angularCssDirectives.map(([name]) => name));
  });

  it("creates a missing module through the explicit AngularTS API", () => {
    const directives: string[] = [];
    const created = {
      directive(name: string) {
        directives.push(name);
        return this;
      },
      name: angularCssModuleName,
    } as unknown as ng.NgModule;
    const ng = {
      createModule(name: string, dependencies: string[]) {
        expect(name).toBe(angularCssModuleName);
        expect(dependencies).toEqual([]);
        return created;
      },
      getModule() {
        throw new Error("Module is not registered");
      },
    } as unknown as typeof angular;

    expect(registerAngularCss(ng)).toBe(created);
    expect(directives).toEqual(angularCssDirectives.map(([name]) => name));
  });
});
