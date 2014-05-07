angular.module('app', ['Controller'])
    .config(['$routeProvider','$locationProvider', function ($routeProvider,$locationProvider) {


        //$locationProvider.html5Mode(true);
        $routeProvider

            .when('/', {
                templateUrl: 'home.html',
                controller: 'homeCtrl'
            })
            .when('/feguideline', {
                templateUrl: 'flat.html',
                controller: 'feguidelineCtrl'
            })
            .when('/feguideline/:act', {
                templateUrl: 'flat.html',
                controller: 'feguidelineCtrl'
            })

            .when('/webform', {
                templateUrl: 'flat.html',
                controller: 'webformCtrl'
            })
            .when('/webform/:act', {
                templateUrl: 'flat.html',
                controller: 'webformCtrl'
            })

            .when('/servicepartner', {
                templateUrl: 'flat.html',
                controller: 'servicepartnerCtrl'
            })
            .when('/servicepartner/:act', {
                templateUrl: 'flat.html',
                controller: 'servicepartnerCtrl'
            })

            .when('/interact', {
                templateUrl: 'flat.html',
                controller: 'interactCtrl'
            })
            .when('/interact/:act', {
                templateUrl: 'flat.html',
                controller: 'interactCtrl'
            })

            .when('/mobile', {
                templateUrl: 'flat.html',
                controller: 'mobileCtrl'
            })

            .when('/mobile/:act', {
                templateUrl: 'flat.html',
                controller: 'mobileCtrl'
            })


            .otherwise({
                redirectTo: '/'
            });
    }])
    .run(['$rootScope', '$route', '$http','$window', function ($rootScope, $route, $http,$window) {

        $rootScope.menu =[];
        $rootScope.act = '';
        $rootScope.script = 0;

        $rootScope.flat = function(doc,fold){

            fold = fold||doc;
            $('#'+doc).addClass('act');
            Flatdoc.run({

                fetcher: Flatdoc.file(Conf.root+'/profile/'+fold+'/'+doc+'.md')
            });

            if(! $rootScope.script){
                flatInit();
                $rootScope.script = 1;
            }


            $(function () {
                var $sidebar = $('.menubar');
                var elTop;
                var $window = $(window);
                $window
                    .on('resize.sidestick', function () {
                        elTop = $sidebar.offset().top;
                        $window.trigger('scroll.sidestick');
                    })
                    .on('scroll.sidestick', function () {
                        var scrollY = $window.scrollTop();
                        $sidebar.toggleClass('fixed', (scrollY >= elTop));
                    })
                    .trigger('resize.sidestick');
            });





        }



    }]);

angular.bootstrap(document, ['app']);