'use strict';

(function (app) {

    app.controller('exercise', function ($scope, $state, $rootScope) {
        $scope.state = 'config';

        $scope.eta = '';
        $scope.frequences = [5, 6, 7];
        $scope.durations = [5, 10, 15, 30];
        $scope.activeFreq = 6;
        $scope.activeDuration = 10;

        $scope.etaUpdate = function (eta) {
            if ($scope.eta !== eta) {
                $scope.eta = eta;
            }
        };

        $scope.setActiveDuration = function (duration) {
            $scope.activeDuration = duration;
        };

        $scope.setActiveFrequency = function (freq) {
            $scope.activeFreq = freq;
        };

        $scope.pause = function () {
            $scope.state = 'pause';
            $rootScope.$broadcast('pauseExercise', {});
        };

        $scope.stop = function () {
            $scope.state = 'config';
            $rootScope.$broadcast('stopExercise', {});

        };

        $scope.play = function () {
            $scope.state = 'exercise';
            $rootScope.$broadcast('resumeExercise', {
                frequency: $scope.activeFreq,
                duration: $scope.activeDuration
            });
        };

        $scope.onClickCircle = function () {
            $rootScope.$broadcast('startExercise', {
                frequency: $scope.activeFreq,
                duration: $scope.activeDuration
            });
            $scope.state = 'exercise';
        };

    });

})(window.breathwork);