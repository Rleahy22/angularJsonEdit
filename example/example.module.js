(function() {
  'use strict';

  var exampleApp = angular.module('exampleApp', [
    'angular-json-editor'
  ])

  exampleApp.controller('exampleCtrl', exampleCtrl);

  function exampleCtrl() {
    var vm = this;

    vm.config = {
      name: 'JSON-editor',
      keywords: [
        'angular',
        'json',
        'editor'
      ],
      usage: {
        angular: {
          directive: true
        }
      }
    };

    console.log(vm.config);
  }
})();