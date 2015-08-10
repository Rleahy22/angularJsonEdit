'use strict';

describe('jsonEditor', function() {
  var isolateScope;
  var elm;
  var testConfig = {
    id: 1,
    name: 'Test',
    array: [
      {
        name: 'first'
      },
      {
        name: 'second'
      },
      {
        name: 'third'
      }
    ],
    nestedObject: {
      prop1: 1,
      prop2: 'cat'
    }
  };
  var testScope;

  beforeEach(function() {
    bard.appModule('angular-json-edit');

    bard.inject(function($window, $rootScope, $compile) {
      testScope = $rootScope;
      elm = angular.element('<json-editor config="newConfig" show-modal="true">');

      testScope.newConfig = angular.merge({}, testConfig);

      $compile(elm)(testScope);
      testScope.$digest();
      isolateScope = elm.isolateScope();
    });
  });

  describe('collapse', function() {
    it('should add a key and it\'s parent to scope.collapsed', function() {
      expect(isolateScope.collapsed.length).toEqual(0);
      isolateScope.collapse('test', {id: 1});
      expect(isolateScope.collapsed.length).toEqual(1);
      expect(isolateScope.collapsed[0]).toEqual({test: {id: 1}});
    });
  });

  describe('deleteProperty', function() {
    it('should remove an object property from the config object at the top level', function() {
      expect(isolateScope.config.id).toEqual(1);
      isolateScope.deleteProperty('id', isolateScope.config);
      expect(isolateScope.config.id).toEqual(undefined);
    });

    it('should remove an object property from the config object at a nested level', function() {
      expect(isolateScope.config.nestedObject.prop2).toEqual('cat');
      isolateScope.deleteProperty('prop2', isolateScope.config.nestedObject);
      expect(isolateScope.config.nestedObject.prop2).toEqual(undefined);
    });

    it('should remove an element from an array in the config object', function() {
      expect(isolateScope.config.array[0].name).toEqual('first');
      isolateScope.deleteProperty(0, isolateScope.config.array);
      expect(isolateScope.config.array[0].name).toEqual('second');
    });

    it('should correctly remove an element from an array in the config object when an earlier element has been removed', function() {
      expect(isolateScope.config.array[0].name).toEqual('first');
      isolateScope.deleteProperty(0, isolateScope.config.array);
      expect(isolateScope.config.array[0].name).toEqual('second');
      isolateScope.deleteProperty(0, isolateScope.config.array);
      expect(isolateScope.config.array[0].name).toEqual('third');
    });
  });

  describe('expand', function() {
    it('should remove a key and parent from scope.collapsed', function() {
      isolateScope.collapsed = [
        {
          testObject: {
            id: 2
          }
        }
      ];

      expect(isolateScope.collapsed.length).toEqual(1);
      isolateScope.expand({testObject: {id: 2}});
      expect(isolateScope.collapsed.length).toEqual(0);
    });
  });

  describe('isCollapsed', function() {
    it('should return true if a key and parent are collapsed', function() {
      isolateScope.collapsed = [
        {
          testObject: {
            id: 2
          }
        }
      ];

      var result = isolateScope.isCollapsed({
        testObject: {
          id: 2
        }
      });

      expect(result).toEqual(true);
    });

    it('should return false if a key and parent are not collapsed', function() {
      isolateScope.collapsed = [
        {
          testObject: {
            id: 2
          }
        }
      ];

      console.log(JSON.stringify(isolateScope.collapsed[0]));
      var result = isolateScope.isCollapsed({
        testObject: {
          id: 3
        }
      });

      expect(result).toEqual(false);
    });
  });

  describe('isNested', function() {
    it('should return true for an object or array', function() {
      expect(isolateScope.isNested({})).toEqual(true);
      expect(isolateScope.isNested([])).toEqual(true);
    });

    it('should return false for a string or number', function() {
      expect(isolateScope.isNested('string')).toEqual(false);
      expect(isolateScope.isNested(42)).toEqual(false);
    });
  });

  describe('getInputType', function() {
    it('should return "text" for a string', function() {
      expect(isolateScope.getInputType('string')).toEqual('text');
    });

    it('should return "number" for a number', function() {
      expect(isolateScope.getInputType(42)).toEqual('number');
    });
  });
});
