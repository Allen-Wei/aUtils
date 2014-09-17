/**
 * Created by Alan on 9/13/2014.
 */
var app = angular.module('myApp', ['app.route']);
app.factory('UserSvc', function(){
    var service = {
        email:''
    };
    return service;
});
app.controller('HomeCtrl', function ($scope, UserSvc) {
    $scope.title = "cool";
    $scope.user = UserSvc;
});
app.controller('LoginCtrl', function($scope, UserSvc, $location){
    $scope.user = {email:'', password:''};
    $scope.login = function(){
        UserSvc.email = $scope.user.email;
        $location.path('/');
    };
});
app.controller('NavCtrl', function($scope){
    $scope.navs = [
        {url:'#/', name:'Home'},
        {url:'#/login', name:'Log In'},
        {url:'#/register', name:'Register'},
        {url:'#/profile', name:'Profile'}
    ];
});
app.controller('FooterCtrl', function($scope){
    $scope.company = {name:'Alan'};
});
