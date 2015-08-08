(function() {
  'use strict';

  angular.module('angular-json-edit')
  .directive('jsonEditorAddProperty', jsonEditorAddProperty);

  function jsonEditorAddProperty() {
    var template = '<div class="new-property-div" ng-show="showForm">' +
      '<input type="text" placeholder="name" name="newPropertyName" ng-model="newProperty.name">' +
        '<select name="newPropertyType" ng-model="newProperty.type">' +
          '<option value="" ng-disabled="true">Type</option>' +
          '<option value="array">Array</option>' +
          '<option value="object">Object</option>' +
          '<option value="string">String</option>' +
          '<option value="number">Number</option>' +
        '</select>' +
        '<button class="json-button" ng-click="addProperty()" ng-disabled="!newProperty.name || !newProperty.type">Add</button>' +
      '</div>' +
    '<div class="new-property-button-div" ng-show="!showForm">' +
      '<button class="json-button padded-row" ng-click="showForm = true">&#43;</button>' +
    '</div>';

    var directive = {
      link: link,
      template: template,
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
