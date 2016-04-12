(function () {
    "use strict";

    angular
        .module('ui.controls')
        .directive('dropdownInput', dropdownInput);

    dropdownInput.$inject = '$parse, $compile, $timeout'.split(', ');
    function dropdownInput($parse, $compile, $timeout) {
        return {
            restrict: 'A',
            compile: function compileFn(tElement, tAttrs, transclude) {
                var fn = $parse(tAttrs.dropdownInput, /* interceptorFn */ null, /* expensiveChecks */ true) || {};

                return function linkFn(scope, iElement, iAttrs, controller) {
                    var config = fn(scope),
                        input;

                    if (!config) {
                        return;
                    }

                    scope.item = '';
                    scope.isHide = true;
                    scope.onBlur = function () {
                        scope.isHide = true;
                    };

                    scope.autocompleteCfg = {
                        select: function (event, ui) {
                            scope.$apply(function () {
                                scope.isHide = true;
                                config.actionFn(ui.item.value);
                                $timeout(function () {
                                    scope.item = '';
                                }, 0);
                            });
                        },
                        source: config.items,
                        delay: 0,
                        minLength: 0
                    };

                    input = $compile('<input type="text" ng-model="item" autocomplete="autocompleteCfg" ng-hide="isHide" ng-blur="onBlur()" class="form-control popup-input">')(scope);
                    iElement.after(input);

                    iElement.on('click', function (e) {
                        scope.$apply(function () {
                            if (scope.isHide) {
                                $timeout(function () {
                                    input.focus();
                                }, 100);
                            }
                            scope.isHide = !scope.isHide;
                        });
                    });


                }
            }
        };
    }

})();