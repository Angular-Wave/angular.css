import type {} from "@angular-wave/angular.ts";

class ProgressDemoController {
  static readonly $inject = ["$scope"];

  private readonly timer: number;

  constructor(scope: ng.Scope) {
    scope.demoValue = 13;

    this.timer = window.setTimeout(() => {
      scope.demoValue = 66;
    }, 500);

    scope.on("$destroy", () => window.clearTimeout(this.timer));
  }
}

window.angular
  .createModule("progressDemo", ["angular.css"])
  .controller("ProgressDemoController", ProgressDemoController);
