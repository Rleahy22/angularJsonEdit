(function() {
  'use strict';

  angular.module('app')
  .directive('jsonEditor', jsonEditor);

  jsonEditor.$inject = ['$http', '$compile'];
  jsonEditor.$inject = ['$http', '$compile', '$log'];

  function jsonEditor($http, $compile) {
  function jsonEditor($http, $compile, $log) {
    var directive = {
      link: link,
      templateUrl: 'app/authoring/jsonEditor/jsonEditor.view.html',
      restrict: 'EA',
      scope: {
        config: '=',
        saveInteractive: '&',
        showModal: '='
      }
    };

    return directive;

    function link(scope, element) {
      scope.closeModal     = closeModal;
      scope.deleteProperty = deleteProperty;
      scope.getInputType   = getInputType;
      scope.isArray        = isArray;
      scope.isNested       = isNested;
      scope.saveConfig     = saveConfig;

      function closeModal() {
        scope.savedConfig = JSON.stringify(scope.savedConfig);
        scope.config = scope.savedConfig;
        scope.showModal = false;
      }

      function deleteProperty(key, object) {
        if (scope.isArray(object)) {
          object.splice(key, 1);
        } else {
          delete object[key];
        }
        $http.get('app/authoring/jsonEditor/jsonEditor.view.html')
        .then(function(response) {
          element.html($compile(response.data)(scope));
        });
      }

      function getInputType(value) {
        if (typeof value === 'number') {
          return 'number';
        } else {
          return 'text';
        }
      }

      function isArray(value) {
        return Array.isArray(value);
      }

      function isNested(value) {
        if (typeof value === 'object') {
          return true;
        } else {
          return false;
        }
      }

      function saveConfig() {
        scope.showModal = false;
      }
      scope.$watch('showModal', function(newVal) {
        if (newVal === true) {
          scope.savedConfig = angular.merge({}, scope.config);
        }
      });
    }
  }
})();
