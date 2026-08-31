(function () {
    'use strict';

    class ProgressDemoController {
        constructor(scope) {
            scope.demoValue = 13;
            this.timer = window.setTimeout(() => {
                scope.demoValue = 66;
            }, 500);
            scope.$on("$destroy", () => window.clearTimeout(this.timer));
        }
    }
    ProgressDemoController.$inject = ["$scope"];
    window.angular
        .module("progressDemo", ["ui"])
        .controller("ProgressDemoController", ProgressDemoController);

})();
