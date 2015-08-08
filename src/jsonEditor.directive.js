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
      scope.deleteProperty = deleteProperty;
      scope.getInputType   = getInputType;
      scope.isArray        = isArray;
      scope.isNested       = isNested;

      scope.nest = '<button class="json-delete json-button" ng-click="deleteProperty(key, parent)">&times;</button>' +
        '<label ng-hide="isArray(parent)" class="json-form-element">' +
          '<span>{{key}}:</span>' +
          '<span ng-show="isNested(value) && isArray(value)">[</span>' +
          '<span ng-show="isNested(value) && !isArray(value)">{</span>' +
        '</label>' +
        '<label ng-show="isNested(value) && !isArray(value)  && isArray(parent)" class="json-form-element">{</label>' +
        '<div ng-if="isNested(value)" class="nested-json">' +
          '<div ng-repeat="(key, value) in parent[key] track by key" ng-init="parent = child; child = value" class="json-form-row" compile="nest">' +
          '</div>' +
        '</div>' +
        '<div ng-if="!isNested(value)" class="json-form-element">' +
          '<input type="{{getInputType(value)}}" name="{{key}}" ng-model="parent[key]" class="json-input" required>' +
        '</div>' +
        '<div json-editor-add-property class="json-new-property" object="value" newProperty="{}" class="" ng-show="isNested(value)">' +
        '</div>' +
        '<label ng-show="isNested(value)" class="json-form-element">{{isArray(value) ? \']\' : \'}\'}}</label>';


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

      scope.$watch('showModal', function(newVal) {
        if (newVal === true) {
          scope.savedConfig = angular.merge({}, scope.config);
        }
      });
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
      )
    }
  }
})();
