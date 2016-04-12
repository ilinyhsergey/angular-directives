(function () {
    "use strict";

    angular
        .module('ui.controls')
        .directive('wordValidation', wordValidation);

    var NAME_REGEXP = '^[A-Za-z0-9_\\-]{0,}$';

    function wordValidation() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                var validationErrorKey = attrs.wordValidation;
                var regexp = attrs.wordValidationRegexp || NAME_REGEXP ;

                if (!validationErrorKey)
                    return;

                function validateFn(value) {
                    if (new RegExp(regexp).test(value)) {
                        ctrl.$setValidity(validationErrorKey, true);
                    } else {
                        ctrl.$setValidity(validationErrorKey, false);
                    }
                    return value;
                }

                ctrl.$formatters.push(validateFn);
                ctrl.$parsers.unshift(validateFn);
            }
        };
    }

})();


