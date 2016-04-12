(function () {
    "use strict";

    angular
        .module('ui.controls')
        .directive('consoleHistory', consoleHistory);

    function consoleHistory() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {

                var history = [ngModel.$viewValue];
                var pos = 0;

                scope.$watch(function () {
                    return ngModel.$viewValue;
                }, function (newVal, prevVal) {
                    if (pos == 0)
                        history[0] = newVal;
                });


                element.on('keydown', function (event) {

                    if (event.which == 13) { // enter
                        var viewValue = ngModel.$viewValue;
                        history.splice(0,1);

                        var filtered = history.filter(function (irem, i) {
                            return irem != viewValue;
                        });

                        if (viewValue)
                            filtered.unshift(viewValue);

                        filtered.unshift('');
                        history = filtered;
                        pos = 0;
                    }
                    else if (event.which == 38) { // up
                        if (pos < history.length - 1) {
                            ++pos;
                            element.val(history[pos]);
                            ngModel.$setViewValue(history[pos]);
                        }
                    } else if (event.which == 40) { // down
                        if (pos > 0) {
                            --pos;
                            element.val(history[pos]);
                            ngModel.$setViewValue(history[pos]);
                        }
                    }

                })

            }
        };
    }

})();
