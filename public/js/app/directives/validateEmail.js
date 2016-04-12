(function () {
    "use strict";

    angular
        .module('api.other')
        .directive('validateEmail', validateEmail);

    validateEmail.$inject = ['ServerSideValidationService', '$timeout'];
    function validateEmail(ServerSideValidationService, $timeout) {

        var EMAIL_LIKE_RE = /.+@.+\..+/,
            DELAY = 500;

        return {
            restrict: 'A',
            require: '?ngModel',
            scope: {
                callback: '&validateEmail'
            },
            link: function (scope, iElement, iAttrs, ngModel) {
                if (!ngModel) {
                    return;
                }

                var promise,
                    prevViewValue;

                iElement.on('keyup', function () {
                    if (!promise) {
                        startTimeout();
                    }
                });

                function startTimeout(){
                    prevViewValue = ngModel.$viewValue;
                    promise = $timeout(function () {
                        // if model wasn't changed (it means stop typing)
                        if (prevViewValue == ngModel.$viewValue){
                            validate();
                            cleanPromise();
                        } else {
                            startTimeout();
                        }
                    }, DELAY);
                }

                function validate() {
                    var viewVal = ngModel.$viewValue,
                        doRequest = !!viewVal && EMAIL_LIKE_RE.test(viewVal);

                    if (doRequest) {
                        ServerSideValidationService.validateEmail(viewVal).then(function (response) {
                            var data = response.data;
                            if (data.address == viewVal) {
                                scope.callback({data: data});
                            }
                        });
                    }
                }

                function cleanPromise() {
                    promise = undefined;
                }

            }
        };
    }

})();
