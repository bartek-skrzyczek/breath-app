'use strict';

(function (app, BezierEasing, moment) {
    app.directive('visualisation', function ($rootScope, $timeout, ngAudio) {
        return {
            transclude: true,
            restrict: 'E',
            template: '<canvas></canvas>',
            scope: {
                onClickCircle: '=',
                eta: '&'
            },
            link: function (scope, element) {
                var config = {
                    5: {
                        firstPhaseDuration: 6.0,
                        secondPhaseDuration: 4.0,
                        file: 'sounds/5perMinute.mp3'
                    },
                    6: {
                        firstPhaseDuration: 6.0,
                        secondPhaseDuration: 4.0,
                        file: 'sounds/6perMinute.mp3'
                    },
                    7: {
                        firstPhaseDuration: 6.0,
                        secondPhaseDuration: 4.0,
                        file: 'sounds/7perMinute.mp3'
                    }
                };
                var activeConfig;
                var easingIn = new BezierEasing(0.56, 0.18, 0.35, 0.97);
                var easingOut = new BezierEasing(0.39, 0.03, 0.75, 1.0);
                var startRadius = 70;
                var maxRadius = 120;
                var canvas = element.children()[0];
                var ctx = canvas.getContext('2d');
                var state = 'wait';
                var width;
                var height;
                var radius;
                var start;
                var exerciseDuration = 0;
                var exerciseDurationTarget = 0;
                var sound;
                var playImg = new Image();
                playImg.src = 'images/play_blue.svg';

                $rootScope.$on('$stateChangeStart', function () {
                    if (sound && sound.stop) {
                        sound.stop();
                    }
                });

                function fmod(a, b) {
                    return Number((a - (Math.floor(a / b) * b)).toPrecision(8));
                }

                function stop() {
                    state = 'wait';
                    if (sound && sound.stop) {
                        sound.stop();
                    }

                    exerciseDuration = 0;
                }

                scope.$on('startIntro', function () {
                    state = 'intro';
                });

                scope.$on('pauseExercise', function () {
                    state = 'pause';
                    if (sound && sound.stop) {
                        sound.stop();
                    }

                    var current = new Date().getTime() - start;

                    exerciseDuration += current;
                });

                scope.$on('stopExercise', function () {
                    stop();
                });

                scope.$on('resumeExercise', function (event, data) {
                    state = 'exercise';
                    start = new Date().getTime();

                    activeConfig = config[data.frequency];
                    sound = ngAudio.load(activeConfig.file);
                    sound.loop = true;
                    sound.play();
                });

                scope.$on('startExercise', function (event, data) {
                    state = 'exercise';
                    start = new Date().getTime();
                    exerciseDurationTarget = data.duration * 1000 * 60;
                    activeConfig = config[data.frequency];
                    sound = ngAudio.load(activeConfig.file);
                    sound.loop = true;
                    sound.play();
                });

                element[0].addEventListener('click', function (event) {
                    if (state !== 'wait') {
                        return;
                    }

                    var rect = canvas.getBoundingClientRect();
                    var x = event.clientX - rect.left;
                    var y = event.clientY - rect.top;

                    if ((x - width / 2) * (x - width / 2) + (y - height / 2) * (y - height / 2) <= radius * radius) {
                        scope.onClickCircle();
                    }
                }, false);

                function drawCircle() {
                    ctx.beginPath();
                    ctx.arc(width / 2.0, height / 2.0, radius, 0.0, 2.2 * Math.PI);
                    ctx.fillStyle = '#fff';
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
                    ctx.shadowBlur = 20;
                    ctx.shadowOffsetX = -1;
                    ctx.shadowOffsetY = 5;
                    ctx.fill();
                }

                function calculateETA() {
                    var current = new Date().getTime() - start;

                    return moment.duration(exerciseDurationTarget - exerciseDuration - current, 'ms');
                }

                var strategies = {
                    wait: function () {
                        radius = startRadius;

                        drawCircle();

                        if (playImg.complete) {
                            var imgSize = radius * 0.75;

                            ctx.shadowColor = 'transparent';
                            ctx.drawImage(playImg, (width - imgSize) / 2, (height - imgSize * 1.2) / 2,
                                imgSize, imgSize);

                            ctx.font = Math.floor(imgSize / 3.0) + 'px Roboto bold';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillStyle = '#17a6ef';
                            ctx.fillText('Start', width / 2, height / 2 + imgSize / 1.7);
                        }
                    },
                    exercise: function (t) {
                        var text;
                        var currentTime = fmod(t - start,
                            (activeConfig.firstPhaseDuration + activeConfig.secondPhaseDuration) * 1000);

                        if (currentTime <= activeConfig.firstPhaseDuration * 1000) {
                            radius = startRadius + easingIn(currentTime / (activeConfig.firstPhaseDuration * 1000)) *
                                (maxRadius - startRadius);
                            text = 'Wdech';
                        } else {
                            currentTime -= activeConfig.firstPhaseDuration * 1000;
                            radius = maxRadius - easingOut(currentTime / (activeConfig.secondPhaseDuration * 1000)) *
                                (maxRadius - startRadius);
                            text = 'Wydech';
                        }

                        var eta = calculateETA();

                        if (eta.asMilliseconds() < 0) {
                            stop();
                        }

                        drawCircle();

                        ctx.font = Math.floor(100 * 0.75 / 3.0) + 'px Roboto bold';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = '#17a6ef';

                        ctx.fillText(text, width / 2, height / 2);

                        scope.eta()(eta.format('mm:ss'));
                    },
                    intro: function () {
                        drawCircle();
                    },
                    pause: function () {
                        drawCircle();
                    }
                };

                function render() {
                    var t = new Date().getTime();

                    width = canvas.width = element.outerWidth();
                    height = canvas.height = element.outerHeight();

                    if (typeof(strategies[state]) !== 'undefined') {
                        strategies[state](t);
                    }

                    requestAnimationFrame(render);
                }

                render();
            }
        };
    });
})(window.breathwork, window.BezierEasing, window.moment);
