'use strict';

(function (app, angular) {
    app.directive('iconFill', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.on('load', function (event) {
                    var object = angular.element(event.currentTarget.getSVGDocument().children[0]);
                    object.attr('fill', attr.iconFill);
                });
            }
        };
    });
})(window.breathwork, window.angular);
