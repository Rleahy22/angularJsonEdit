(function() {
  'use strict';

  angular.module('angular-json-editor')
  .directive('jsonNest', jsonNest);

  function jsonNest() {
    var template = '<button class="json-delete" ng-click="deleteProperty(key, parent)">&times;</button>' +
      '<label ng-hide="isArray(parent)" class="json-form-element">' +
        '{{key}}:' +
        '<span ng-show="isNested(value) && isArray(value)">[</span>' +
        '<span ng-show="isNested(value) && !isArray(value)">{</span>' +
      '</label>' +
      '<label ng-show="isNested(value) && !isArray(value)  && isArray(parent)" class="json-form-element">{</label>' +
      '<div ng-if="isNested(value)" class="nested-json">' +
        '{{key}}: {{value}}' +
        '<div ng-repeat="(key, value) in parent[key] track by key" ng-init="parent = child; child = value" class="json-form-row">' +
          // '<json-nest key="key" value="value" parent="parent" child="child"></json-nest>' +
        '</div>' +
      '</div>' +
      '<div ng-if="!isNested(value)" class="json-form-element">' +
        '<input type="{{getInputType(value)}}" name="{{key}}" ng-model="parent[key]" class="json-input" required>' +
      '</div>' +
      '<div json-editor-add-property object="value" newProperty="{}" class="" ng-show="isNested(value)">' +
      '</div>' +
      '<label ng-show="isNested(value)" class="json-form-element">{{isArray(value) ? \']\' : \'}\'}}</label>';

    var directive = {
      link: link,
      template: template,
      restrict: 'EA',
      scope: {
        child:  '=',
        key:    '=',
        parent: '=',
        value:  '='
      }
    };

    return directive;

    function link(scope) {
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
    }
  }
})();
