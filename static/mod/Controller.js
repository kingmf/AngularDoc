/**
 * Created by ken.xu on 14-3-26.
 */
angular.module('Controller', [])

.controller('homeCtrl',['$scope','$rootScope',function($scope,$rootScope){

        $rootScope.menu =[];
    }])

.controller('feguidelineCtrl',['$scope','$rootScope','$routeParams',function($scope,$rootScope,$routeParams){

        $rootScope.act = 'feguideline';
        var dt = $routeParams.act||$rootScope.act;
        $rootScope.flat(dt,$rootScope.act);
        $rootScope.menu = [
            {id:'feguideline',name:'编程规范'}
        ];
    }])

    .controller('servicepartnerCtrl',['$scope','$rootScope','$routeParams',function($scope,$rootScope,$routeParams){

        $rootScope.act = 'servicepartner';
        var dt = $routeParams.act||$rootScope.act;
        $rootScope.flat(dt,$rootScope.act);
        $rootScope.menu = [];
    }])

    .controller('interactCtrl',['$scope','$rootScope','$routeParams',function($scope,$rootScope,$routeParams){

        $rootScope.act = 'interact';
        var dt = $routeParams.act||'RMSPORTAL';
        $rootScope.flat(dt,$rootScope.act);
        $rootScope.menu = [];
    }])



    .controller('mobileCtrl',['$scope','$rootScope','$routeParams',function($scope,$rootScope,$routeParams){

        $rootScope.act = 'mobile';
        var dt = $routeParams.act||'weather';
        $rootScope.flat(dt,$rootScope.act);

        $rootScope.menu = [
            {id:'weather',name:'Weather'},
            {id:'contant',name:'Contant'}
            ];
    }])

    .controller('webformCtrl',['$scope','$rootScope','$routeParams',function($scope,$rootScope,$routeParams){

        $rootScope.act = 'webform';
        var dt = $routeParams.act||'webformstep';
        $rootScope.flat(dt,$rootScope.act);

        $rootScope.menu = [
            {id:'webformstep',name:'Web Form Step'},
            {id:'webformcolumn',name:'Webform Resize Column'},
            {id:'webformprint',name:'Webform Print'},
            {id:'webformcrfq',name:'Webform Crfq'},
            {id:'webformexpence',name:'Webform Expence'}
        ];
    }])