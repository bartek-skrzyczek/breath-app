'use strict';

var app = window.breathwork = window.angular.module('breathwork', ['pascalprecht.translate', 'ui.router', 'ngAudio',
    'angular-click-outside', 'ngTouch']);

app.run(function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;


    $rootScope.$on('$stateChangeStart', function (event) {
        if (window.localStorage.getItem('breathwork') === null) {
            window.localStorage.setItem('breathwork', true);
            event.preventDefault();
            $state.go('tutorial.pageView', {tutorialId: 'Tutorial_1'});
        }
    });
});

app.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $translateProvider) {

    $translateProvider.useSanitizeValueStrategy(null);

    $translateProvider.useStaticFilesLoader({
        prefix: 'languages/',
        suffix: '.json'
    });

    $translateProvider.preferredLanguage('pl');

    $urlRouterProvider.otherwise('/exercise');

    $stateProvider
        .state('page', {
            url: '/page',
            templateUrl: 'views/page.html'
        })
        .state('page.pageView', {
            url: '/:pageId',
            templateUrl: function ($stateParams) {
                return 'languages/pl/' + $stateParams.pageId + '.html';
            },
            controller: 'page'
        })
        .state('tutorial', {
            url: '/tutorial',
            templateUrl: 'views/tutorial.html'
        })
        .state('tutorial.pageView', {
            url: '/:tutorialId',
            templateUrl: function ($stateParams) {
                return 'languages/pl/' + $stateParams.tutorialId + '.html';
            },
            controller: 'tutorial'
        })
        .state('exercise', {
            url: '/exercise',
            templateUrl: 'views/exercise.html',
            controller: 'exercise'
        });
});

