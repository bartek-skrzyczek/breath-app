'use strict';

(function (app) {

    app.controller('tutorial', function ($scope, $state) {
        $scope.go = function (name) {
            $state.go('tutorial.pageView', {tutorialId: name});
        };

        $scope.goToApp = function () {
            $state.go('exercise');
        };
    });

})(window.breathwork);