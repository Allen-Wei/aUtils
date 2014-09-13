/**
 * Created by Alan on 9/13/2014.
 */
var app = angular.module('myApp', ['app.route']);

app.controller('HomeCtrl', function ($scope) {
    $scope.title = "cool";
});
app.controller('UserCtrl', function ($scope, $rootScope) {
    $scope.user = {name: 'Alan'};
});