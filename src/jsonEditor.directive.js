(function() {
  'use strict';

  angular.module('angular-json-edit')
  .directive('jsonEditor', jsonEditor)
  .directive('compile', compile);

  function jsonEditor() {
    var template = '<div class="json-container">' +
      '<div class="json-form-div">' +
        '<form name="jsonEditorForm" ng-submit="" role="form">' +
          '<div ng-repeat="(key, value) in config track by key" ng-init="parent = config; child = value" class="json-form" compile="nest"' +
          '</div>' +
          '<div json-editor-add-property class="json-new-property" object="config" newProperty="{}">' +
          '</div>' +
        '</form>' +
      '</div>' +
    '</div>';

    var directive = {
      link: link,
      template: template,
      restrict: 'EA',
      scope: {
        config: '=',
        showModal: '='
      }
    };

    return directive;

    function link(scope) {
      scope.collapse       = collapse;
      scope.collapsed      = [];
      scope.deleteProperty = deleteProperty;
      scope.expand         = expand;
      scope.getInputType   = getInputType;
      scope.isArray        = isArray;
      scope.isCollapsed    = isCollapsed;
      scope.isNested       = isNested;

      scope.nest = '<button class="json-delete json-button" ng-click="deleteProperty(key, parent)">&times;</button>' +
        '<div class="label-wrapper" ng-class="{\'padded-row\': !isNested(value)}">' +
          '<i ng-show="isNested(value) && isCollapsed(key, parent)" class="json-arrow" ng-click="expand(key, parent)">&#8658;</i>' +
          '<i ng-show="isNested(value) && !isCollapsed(key, parent)" class="json-arrow" ng-click="collapse(key, parent)">&#8659;</i>' +
          '<label class="json-form-element">' +
            '<span class="key-span" ng-hide="isArray(parent)">{{key}}:</span>' +
            '<span ng-show="isNested(value) && isArray(value)"> [</span>' +
            '<span ng-show="isNested(value) && !isArray(value)"> {</span>' +
          '</label>' +
          '<div ng-if="!isNested(value)" class="json-input-div">' +
            '<input type="{{getInputType(value)}}" name="{{key}}" ng-model="parent[key]" class="json-input" required>' +
          '</div>' +
        '</div>' +
        '<div ng-if="isNested(value)" ng-show="!isCollapsed(key, parent)" class="nested-json">' +
          '<div ng-repeat="(key, value) in parent[key] track by key" ng-init="parent = child; child = value" class="json-form-row" compile="nest">' +
          '</div>' +
          '<div json-editor-add-property class="json-new-property padded-row" object="value" newProperty="{}" class="" ng-show="isNested(value)">' +
          '</div>' +
        '</div>' +
        '<label ng-show="isNested(value)" class="json-form-element padded-row">{{isArray(value) ? \']\' : \'}\'}}</label>';

      function collapse(key, parent) {
        var newObj = {};
        newObj[key] = parent;
        scope.collapsed.push(newObj);
      }

      function deleteProperty(key, object) {
        if (scope.isArray(object)) {
          object.splice(key, 1);
        } else {
          delete object[key];
        }
      }

      function expand(key, parent) {
        var check = {};
        check[key] = parent;

        scope.collapsed.forEach(function(element, index) {
          if (angular.equals(element[key], check[key])) {
            scope.collapsed.splice(index, 1);
          }
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

      function isCollapsed(key, parent) {
        var check = {};
        var result = false;
        check[key] = parent;

        scope.collapsed.forEach(function(element) {
          if (angular.equals(element[key], check[key])) {
            result = true;
          }
        });

        return result;
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

  compile.$inject = ['$compile'];

  function compile($compile) {
    return function(scope, element, attrs) {
      scope.$watch(
        function(scope) {
          return scope.$eval(attrs.compile);
        },

        function(value) {
          element.html(value);
          $compile(element.contents())(scope);
        }

      );
    };
  }
})();
