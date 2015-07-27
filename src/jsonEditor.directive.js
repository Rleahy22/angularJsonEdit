(function() {
  'use strict';

  angular.module('angular-json-editor')
  .directive('jsonEditor', jsonEditor);

  jsonEditor.$inject = ['$http', '$compile'];

  function jsonEditor($http, $compile) {
    var template = '<div class="json-container">' +
      '<div class="json-form-div">' +
        '<form name="interactiveConfigForm" ng-submit="" role="form">' +
          '<label class="json-brackets">{</label>' +
          '<div ng-repeat="(key, value) in config track by key" ng-init="parent = config; child = value" class="json-form" ng-include="\'../src/jsonNestTemplate.view.html\'">' +
          '</div>' +
          '<div json-editor-add-property object="config" newProperty="{}">' +
          '</div>' +
          '<label class="json-brackets">}</label>' +
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

        element.html($compile(angular.element(template))(scope));
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
