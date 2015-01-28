'use strict';
angular.module('mainCtrl', [])
  .controller('MainController', function($rootScope, $location, Auth) {

    var vm = this;

    // get info if a person is logged in
    vm.loggedIn = Auth.isLoggedIn();

    // check to see if a user is logged in on every request
    $rootScope.$on('$routeChangeStart', function() {
      vm.loggedIn = Auth.isLoggedIn();
    });

    // get user information on page load
    Auth.getUser()
      .then(function(data) {
        vm.user = data;
      });

    // function to handle login form
    vm.doLogin = function() {

      // creates a 'processing' state for the spinner
      vm.processing = true;

      // clear error status
      vm.error = '';

      // call the Auth.login() function
      Auth.login(vm.loginData.username, vm.loginData.password)
        .success(function(data) {

          // indicates finished processing
          vm.processing = false;

          // get user information after logging in
          Auth.getUser()
            .then(function(data) {
              vm.user = data.data;
            });

          // if a user successfully logs in, redirect to users page
          if (data.success){
            $location.path('/users');
          } else {
            vm.error = data.message;
          }
        });
    };

    // function to handle logging out
    vm.doLogout = function() {
      Auth.logout();
      $location.path('/');
    };

  });