'use strict';

(function (app, angular) {

    app.controller('menu', function ($scope, $timeout) {

        var menuIsActive = false;

        $scope.state = '';

        $scope.$on('$stateChangeSuccess', function (event, next) {
            $scope.closeMenu();
            $scope.state = next.name;
        });

        $scope.$on('setTitle', function (event, title) {
            $scope.title = title;
        });

        $scope.showMenu = function () {
            angular.element('.menu').addClass('active');
            $timeout(function () {
                menuIsActive = true;
            });
        };

        $scope.closeMenu = function () {
            if (menuIsActive) {
                angular.element('.menu').removeClass('active');
                menuIsActive = false;
            }
        };
    });

})(window.breathwork, window.angular);
