(function() {
  'use strict';

  angular.module('angular-json-editor')
  .directive('jsonEditor', jsonEditor);

  jsonEditor.$inject = ['$http', '$compile'];

  function jsonEditor($http, $compile) {
    var directive = {
      link: link,
      templateUrl: 'src/jsonEditor.view.html',
      restrict: 'EA',
      scope: {
        config: '=',
        saveInteractive: '&',
        showModal: '='
      }
    };

    return directive;

    function link(scope, element) {
      scope.deleteProperty = deleteProperty;
      scope.getInputType   = getInputType;
      scope.isArray        = isArray;
      scope.isNested       = isNested;

      function deleteProperty(key, object) {
        if (scope.isArray(object)) {
          object.splice(key, 1);
        } else {
          delete object[key];
        }

        $http.get('src/jsonEditor.view.html')
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

      scope.$watch('showModal', function(newVal) {
        if (newVal === true) {
          scope.savedConfig = angular.merge({}, scope.config);
        }
      });
    }
  }
})();
