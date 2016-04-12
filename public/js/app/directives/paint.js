(function () {
    "use strict";

    angular
        .module('ui.controls')
        .directive('paint', paint);

    paint.$inject = ['$interpolate', 'ColorService'];
    function paint($interpolate, ColorService) {
        return {
            restrict: 'E',
            scope: {
                /* isolated scope to not contaminate of parent scope by 'bgColor' */
            },
            replace: true,
            transclude: 'element',
            template: '<span class="{{bgColor}}" ng-transclude></span>',
            compile: function (tElement, attrs, transcludeFn) {
                return function postLink(scope, iElement) {
                    var newScope = scope.$parent.$new();
                    transcludeFn(newScope, function (clone) {
                        var contentStr = $interpolate(clone.html())(newScope);
                        scope.bgColor = ColorService.getBackgroundColorClass(contentStr);
                        iElement.empty();
                        iElement.append(contentStr);
                    });
                };
            }
        };
    }

})();

