(function () {
    "use strict";

    angular
        .module('api.other')
        .directive('focusOn', focusOn);

    function focusOn() {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attr) {
                $scope.$watch($attr.focusOn, function (focusVal) {
                    if (focusVal === true) {
                        setTimeout(function () {
                            $element.focus();
                        }, 0);
                    }
                });
            }
        };
    }

})();
