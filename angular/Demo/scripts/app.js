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
app.controller('LoginCtrl', function($scope, UserSvc){
    $scope.user = {email:'', password:''};
    $scope.login = function(){
        UserSvc.email = $scope.user.email;
    };
});
app.controller('NavCtrl', function($scope){
    $scope.navs = [
        {url:'#/', name:'Home'},
        {url:'#/Login', name:'Log In'},
        {url:'#/Register', name:'Register'},
        {url:'#/Profile', name:'Profile'}
    ];
});
app.controller('FooterCtrl', function($scope){
    $scope.company = {name:'Alan'};
});
