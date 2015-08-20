(function() {
  'use strict';

  angular.module('angular-json-edit')
  .directive('jsonEditorAddProperty', jsonEditorAddProperty);

  function jsonEditorAddProperty() {
    var template = '<div class="new-property-div padded-row" ng-show="showForm">' +
      '<input type="text" placeholder="key" name="newPropertyName" ng-model="newProperty.name" ng-show="!isParentArray()">' +
        '<select name="newPropertyType" ng-model="newProperty.type">' +
          '<option value="" ng-disabled="true">Type</option>' +
          '<option value="array">Array</option>' +
          '<option value="object">Object</option>' +
          '<option value="string">String</option>' +
          '<option value="number">Number</option>' +
          '<option value="boolean">Boolean</option>' +
        '</select>' +
        '<input type="{{getInputType()}}" class="value-field" placeholder="value" name="newPropertyValue" ng-model="newProperty.value" ng-show="showValueField()">' +
        '<select name="newPropertyType" ng-model="newProperty.value" ng-show="newProperty.type === \'boolean\'">' +
          '<option value="true">true</option>' +
          '<option value="">false</option>' +
        '</select>' +
        '<button class="json-button" ng-click="addProperty()" ng-show="newProperty.type">&#43;</button>' +
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
      scope.addProperty    = addProperty;
      scope.getInputType   = getInputType;
      scope.isParentArray  = isParentArray;
      scope.showValueField = showValueField;

      function addProperty() {
        if (scope.isParentArray() && scope.newProperty) {
          switch (scope.newProperty.type) {
            case 'array':
              scope.object.push([]);
              break;
            case 'object':
              scope.object.push({});
              break;
            case 'string':
              scope.object.push(scope.newProperty.value || '');
              break;
            case 'number':
              scope.object.push(parseInt(scope.newProperty.value) || 0);
              break;
            case 'boolean':
              scope.object.push(Boolean(scope.newProperty.value));
              break;
          }
        } else if (scope.newProperty) {
          switch (scope.newProperty.type) {
            case 'array':
              scope.object[scope.newProperty.name] = [];
              break;
            case 'object':
              scope.object[scope.newProperty.name] = {};
              break;
            case 'string':
              scope.object[scope.newProperty.name] = scope.newProperty.value || '';
              break;
            case 'number':
              scope.object[scope.newProperty.name] = parseInt(scope.newProperty.value) || 0;
              break;
            case 'boolean':
              scope.object[scope.newProperty.name] = Boolean(scope.newProperty.value);
              break;
          }
        }

        scope.newProperty = {};
        scope.showForm = false;
      }

      function getInputType() {
        if (scope.newProperty && scope.newProperty.type === 'number') {
          return 'number';
        } else {
          return 'text';
        }
      }

      function isParentArray() {
        return Array.isArray(scope.object);
      }

      function showValueField() {
        if (scope.newProperty) {
          return (scope.newProperty.type === 'string' ||
            scope.newProperty.type === 'number');
        }
      }
    }
  }
})();
