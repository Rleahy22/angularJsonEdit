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
      scope.clickAction    = clickAction;
      scope.getInputType   = getInputType;
      scope.highlight      = highlight;
      scope.highlighted    = [];
      scope.isArray        = isArray;
      scope.isCollapsed    = isCollapsed;
      scope.isHighlighted  = isHighlighted;
      scope.isNested       = isNested;
      scope.unHighlight    = unHighlight;

      scope.nest = '' +
        '<div class="label-wrapper" ng-class="{\'padded-row\': !isNested(value), \'json-delete-highlight\' : isHighlighted(key, parent), \'json-collapsed-row\' : !isArray(parent) && parent[key].$$collapsed}" ng-click="clickAction($event, key, parent)">' +
          // '<i ng-show="isNested(value) && isCollapsed(key, parent)" class="json-arrow" >&#8658;</i>' +
          // '<i ng-show="isNested(value) && !isCollapsed(key, parent)" class="json-arrow" ng-click="collapse(key, parent)">&#8659;</i>' +
          '<label class="json-form-element">' +
            '<span class="key-span" ng-click="to(key, parent)" ng-if="!isArray(parent)">{{key}}: ' +
            '{{isNested(value) && isArray(value) ? "[" : "" }}' +
            '{{isNested(value) && !isArray(value) ? "{" : "" }}' +
            '{{isNested(value) && isArray(value) && isCollapsed(key, parent) ? " ... ]" : "" }}' +
            '{{isNested(value) && !isArray(value) && isCollapsed(key, parent) ? " ... }" : "" }}' +
            '</span>' +
            '<div ng-if="!isNested(value)" class="json-input-div">' +
              '<input type="{{getInputType(value)}}" name="{{key}}" ng-model="parent[key]" class="json-input" required>' +
            '</div>' +
          '</label>' +
          '<button class="json-delete json-button" ng-click="deleteProperty(key, parent)" ng-mouseover="highlight(key, parent)"  ng-mouseleave="unHighlight(key, parent)">&times;</button>' +
        '</div>' +
        '<div ng-if="isNested(value)" ng-show="!isCollapsed(key, parent)" class="nested-json">' +
          '<div ng-repeat="(key, value) in parent[key] track by key" ng-init="parent = child; child = value" class="json-form-row" compile="nest">' +
          '</div>' +
          '<div json-editor-add-property class="json-new-property padded-row" object="value" newProperty="{}" class="" ng-show="isNested(value)">' +
          '</div>' +
        '</div>' +
        '<label ng-show="isNested(value) && !isCollapsed(key, parent)" class="json-closing-brace label-wrapper padded-row">{{isArray(value) ? \']\' : \'}\'}}</label>';

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

      function clickAction($event, key, parent) {
        if(isArray(parent) || typeof parent[key] != "object") {
          focusInput($event, key, parent);
        } else {
          console.log(key, parent);
          toggleExpandCollapse(key, parent);
        }
      }

      function focusInput($event, key, parent) {
        var target = $event.target || $event.srcElement;
        if (target.tagName != "INPUT" && target.children.length > 0) {
          for(var i = 0; i < target.children.length; i++) {
            focusInput({target: target.children[i]}, key, parent);
          }
        }

        if(target.tagName == "INPUT") {
          target.focus();
        }
      }

      function toggleExpandCollapse(key, parent) {
        console.log(key, parent, typeof parent[key]);
        if(typeof parent[key].$$collapsed == "undefined") {
          Object.defineProperty(parent[key], "$$collapsed", {
            value: true,
            writable: true,
            enumerable: false
          });
        } else {
          parent[key].$$collapsed = !parent[key].$$collapsed;
        }
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
      }

      function isArray(value) {
        return Array.isArray(value);
      }

      function isCollapsed(key, parent) {
        return parent[key].$$collapsed;
      }
      // function isCollapsed(key, parent) {
      //   var check = {};
      //   var result = false;
      //   check[key] = parent;

      //   scope.collapsed.forEach(function(element) {
      //     if (angular.equals(element[key], check[key])) {
      //       result = true;
      //     }
      //   });

      //   return result;
      // }

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
