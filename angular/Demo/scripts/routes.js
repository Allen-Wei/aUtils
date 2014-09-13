/**
 * Created by Alan on 9/13/2014.
 */



/*Route*/
var myRoute = angular.module('app.route', ['ngRoute']);
myRoute.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'HomeCtrl',
            templateUrl: 'views/home.html'
        })
        .when('/login', {
            controller:'LoginCtrl',
            templateUrl:'views/login.html'
        })
        .otherwise('/');
});
