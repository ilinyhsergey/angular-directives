(function () {
    "use strict";

    /**
     * Store position of cursor in cookies
     *
     * Use as attribute:
     *      save-focus="{pageId:'tile'}"
     *      save-focus="{pageId:'field'+$index}"
     */
    angular
        .module('ui.controls')
        .directive('saveFocus', saveFocus);

    saveFocus.$inject = '$parse, $cookieStore, $timeout, $rootScope'.split(', ');
    function saveFocus(  $parse, $cookieStore, $timeout, $rootScope) {
        return {
            restrict: 'A',
            compile: function compileFn($element, attr) {
                var fn = $parse(attr['saveFocus'], /* interceptorFn */ null, /* expensiveChecks */ true) || {};

                return function linkFn(scope, element, attr) {
                    var saveFocus = fn(scope);
                    if (!saveFocus) {
                        return;
                    }
                    var pageId, elementId;
                    angular.forEach(saveFocus, function (val, key) {
                        pageId = key;
                        elementId = val;
                    });
                    if (!(pageId && elementId)) {
                        return;
                    }
                    var cookie = $cookieStore.get('saveFocus') || {};
                    var storedElementId = cookie[pageId];

                    if (storedElementId == elementId) {
                        // little bit hack
                        $timeout(function () {// invoke in postlinking
                            $timeout(function () { // invoke as defer processing
                                element.focus();
                            }, 0);
                        }, 0);
                    }

                    element.on('focus', function (event) {
                        if ($rootScope.$$phase) {
                            scope.$evalAsync(callback);
                        } else {
                            scope.$apply(callback);
                        }
                        function callback() {
                            // store to cookies
                            var cookie = $cookieStore.get('saveFocus') || {};
                            cookie[pageId] = elementId;
                            $cookieStore.put('saveFocus', cookie);
                        }
                    });

                };
            }
        };
    }

})();
