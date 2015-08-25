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

  describe('clickAction', function() {
    it('should call focusInput on non objects/arrays', function() {
      isolateScope.focusInput = sinon.spy();
      var testEvent = {
        type: 'test'
      };
      var testParent = {
        this: 'string'
      };

      isolateScope.clickAction(testEvent, 'this', testParent);
      expect(isolateScope.focusInput.calledWith(testEvent)).toEqual(true);
    });

    it('should call toggleExpandCollapse on objects or arrays', function() {
      isolateScope.toggleExpandCollapse = sinon.spy();
      var testParent = {
        this: [
          'string'
        ]
      };

      isolateScope.clickAction(null, 'this', testParent);
      expect(isolateScope.toggleExpandCollapse.calledWith('this')).toEqual(true);
    });
  });

  describe('focusInput', function() {
    it('should call focus on an input if provided', function() {
      var testEvent = {
        target: {
          children: [],
          dispatchEvent: sinon.spy(),
          focus: sinon.spy(),
          tagName: 'INPUT'
        }
      };
      var testParent = {
        this: 'string'
      };

      isolateScope.focusInput(testEvent, 'this', testParent);
      expect(testEvent.target.focus.calledOnce).toEqual(true);
    });

    it('should call focusInput on target\'s children if not an input', function() {
      var testEvent = {
        target: {
          dispatchEvent: sinon.spy(),
          children: [
            {
              children: [],
              dispatchEvent: sinon.spy(),
              focus: sinon.spy(),
              tagName: 'INPUT'
            }
          ],
          focus: sinon.spy(),
          tagName: 'DIV'
        }
      };
      var testParent = {
        this: 'string'
      };

      isolateScope.focusInput(testEvent, 'this', testParent);
      expect(testEvent.target.children[0].focus.calledOnce).toEqual(true);
    });
  });

  describe('highlight', function() {
    it('should add a key and it\'s parent to scope.highlighted', function() {
      expect(isolateScope.highlighted.length).toEqual(0);
      isolateScope.highlight('test', {id: 1});
      expect(isolateScope.highlighted.length).toEqual(1);
      expect(isolateScope.highlighted[0]).toEqual({test: {id: 1}});
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

  describe('isCollapsed', function() {
    it('should return true if a key and parent are collapsed', function() {
      var result = isolateScope.isCollapsed('testObject', {
        testObject: {
          id: 2,
          $$collapsed: true
        }
      });

      expect(result).toEqual(true);
    });

    it('should return false if a key and parent are not collapsed', function() {
      var result = isolateScope.isCollapsed('testObject', {
        testObject: {
          id: 3
        }
      });

      expect(result).toBeFalsy();
    });
  });

  describe('isHighlighted', function() {
    it('should return true if a key and parent are highlighted', function() {
      isolateScope.highlight('returnTrue',
        {
          testObject: {
            id: 2
          }
        }
      );

      var result = isolateScope.isHighlighted('returnTrue', {
        testObject: {
          id: 2
        }
      });

      expect(result).toEqual(true);
    });

    it('should return false if a key and parent are not highlighted', function() {
      isolateScope.highlight('returnTrue',
        {
          testObject: {
            id: 2
          }
        }
      );

      var result = isolateScope.isHighlighted('returnTrue', {
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

  describe('toggleExpandCollapse', function() {
    it('should add $$collapsed property to expanded parent', function() {
      var testParent = {
        test: [
          'this'
        ]
      };

      isolateScope.toggleExpandCollapse('test', testParent);
      expect(testParent.test.$$collapsed).toEqual(true);
    });

    it('should toggle $$collapsed property to collapsed parent', function() {
      var testParent = {
        test: [
          'this'
        ]
      };

      isolateScope.toggleExpandCollapse('test', testParent);
      expect(testParent.test.$$collapsed).toEqual(true);
      isolateScope.toggleExpandCollapse('test', testParent);
      expect(testParent.test.$$collapsed).toEqual(false);
    });
  });

  describe('unHighlight', function() {
    it('should remove a key and parent from scope.highlighted', function() {
      isolateScope.highlighted = [
        {
          testObject: {
            id: 2
          }
        }
      ];

      expect(isolateScope.highlighted.length).toEqual(1);
      isolateScope.unHighlight({testObject: {id: 2}});
      expect(isolateScope.highlighted.length).toEqual(0);
    });
  });
});
