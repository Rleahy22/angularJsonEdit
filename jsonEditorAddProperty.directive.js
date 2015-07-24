(function() {
  'use strict';

  angular.module('app')
  .directive('jsonEditorAddProperty', jsonEditorAddProperty);

  function jsonEditorAddProperty() {
    var directive = {
      link: link,
      templateUrl: 'app/authoring/jsonEditor/jsonEditorAddProperty.view.html',
      restrict: 'EA',
      scope: {
        object: '=',
        newProperty: '='
      }
    };

    return directive;

    function link(scope) {
      scope.addProperty  = addProperty;

      function addProperty() {
        if (Array.isArray(scope.object)) {
          switch (scope.newProperty.type) {
            case 'array':
              scope.object.push([]);
              break;
            case 'object':
              scope.object.push({});
              break;
            case 'string':
              scope.object.push('');
              break;
            case 'number':
              scope.object.push(0);
              break;
          }
        } else {
          switch (scope.newProperty.type) {
            case 'array':
              scope.object[scope.newProperty.name] = [];
              break;
            case 'object':
              scope.object[scope.newProperty.name] = {};
              break;
            case 'string':
              scope.object[scope.newProperty.name] = '';
              break;
            case 'number':
              scope.object[scope.newProperty.name] = 0;
              break;
          }
        }

        scope.newProperty = {};
        scope.showForm = false;
      }
    }
  }
})();
