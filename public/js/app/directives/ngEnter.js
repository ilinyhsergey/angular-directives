(function () {
    "use strict";

    angular
        .module('ui.controls')
        .directive('ngEnter', ngEnter);

    ngEnter.$inject = ['$parse'];
    function ngEnter($parse) {
        return {
            restrict: 'A',
            priority: 1000,
            compile: function ($element, attr) {
                var fn = $parse(attr['ngEnter'], /* interceptorFn */ null, /* expensiveChecks */ true);
                return function link(scope, element) {
                    element.on('keypress', function (event) {
                        if (event.which === 13) {
                            scope.$apply(function () {
                                fn(scope, {$event: event});
                            });
                            event.preventDefault();
                        }
                    });
                };
            }
        };
    }

})();
