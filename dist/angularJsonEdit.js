(function() {
  'use strict';

  angular.module('angular-json-edit', []);
})();

(function() {
  'use strict';

  angular.module('angular-json-edit')
  .directive('jsonEditor', jsonEditor)
  .directive('compile', compile);

  function jsonEditor() {
    var template = '<div class="json-container">' +
      '<div class="json-form-div">' +
        '<form name="jsonEditorForm" ng-submit="" role="form">' +
          '<div ng-repeat="(key, value) in config track by key" ng-init="parent = config; child = value" class="json-form" compile="nest" ng-class="{\'json-highlight\' : isHighlighted(key, parent)}">' +
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
      scope.highlight      = highlight;
      scope.highlighted    = [];
      scope.isArray        = isArray;
      scope.isCollapsed    = isCollapsed;
      scope.isHighlighted  = isHighlighted;
      scope.isNested       = isNested;
      scope.unHighlight    = unHighlight;

      scope.nest = '<button class="json-delete json-button" ng-click="deleteProperty(key, parent)" ng-mouseover="highlight(key, parent)"  ng-mouseleave="unHighlight(key, parent)">&times;</button>' +
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
          '<div ng-repeat="(key, value) in parent[key] track by key" ng-init="parent = child; child = value" class="json-form-row" compile="nest" ng-class="{\'json-highlight\' : isHighlighted(key, parent)}">' +
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

      function highlight(key, parent) {
        var newObj = {};
        newObj[key] = parent;
        scope.highlighted.push(newObj);
        console.log(angular.merge([], scope.highlighted));
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

      function isHighlighted(key, parent) {
        var check = {};
        var result = false;
        check[key] = parent;

        scope.highlighted.forEach(function(element) {
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

      function unHighlight(key, parent) {
        var check = {};
        check[key] = parent;

        scope.highlighted.forEach(function(element, index) {
          if (angular.equals(element[key], check[key])) {
            scope.highlighted.splice(index, 1);
          }
        });
        console.log(angular.merge([], scope.highlighted));
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
        if (scope.isParentArray()) {
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
        } else {
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
            scope.newProperty.type === 'number' ||
            scope.newProperty.type === 'boolean');
        }
      }
    }
  }
})();
