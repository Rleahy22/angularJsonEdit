'use strict';

describe('jsonEditorAddProperty', function() {
  var isolateScope;
  var elm;
  var testArray = [
    1,
    'string'
  ];
  var testObject = {
    id: 1,
    name: 'Test'
  };
  var testScope;

  describe('addProperty', function() {
    describe('when scope.object is an object', function() {
      beforeEach(function() {
        bard.appModule('angular-json-edit');

        bard.inject(function($window, $rootScope, $compile) {
          testScope = $rootScope;
          elm = angular.element('<json-editor-add-property object="newConfig" newProperty="{}">');

          testScope.newConfig = angular.copy(testObject);

          $compile(elm)(testScope);
          testScope.$digest();
          isolateScope = elm.isolateScope();
        });
      });

      it('should add an empty array to the scope object when new type is array', function() {
        isolateScope.newProperty = {
          type: 'array',
          name: 'newArray'
        };
        isolateScope.addProperty();
        expect(isolateScope.object.newArray).toEqual([]);
      });

      it('should add an empty object to the scope object when new type is object', function() {
        isolateScope.newProperty = {
          type: 'object',
          name: 'newObject'
        };
        isolateScope.addProperty();
        expect(isolateScope.object.newObject).toEqual({});
      });

      it('should add an empty string to the scope object when new type is string', function() {
        isolateScope.newProperty = {
          type: 'string',
          name: 'newString'
        };
        isolateScope.addProperty();
        expect(isolateScope.object.newString).toEqual('');
      });

      it('should add an number to the scope object when new type is number', function() {
        isolateScope.newProperty = {
          type: 'number',
          name: 'newNumber'
        };
        isolateScope.addProperty();
        expect(isolateScope.object.newNumber).toEqual(0);
      });

      it('should add an boolean to the scope object when new type is boolean', function() {
        isolateScope.newProperty = {
          type: 'boolean',
          name: 'newBoolean'
        };
        isolateScope.addProperty();
        expect(typeof isolateScope.object.newBoolean).toEqual('boolean');
      });

      describe('getInputType', function() {
        it('should return "text" for a string', function() {
          isolateScope.newProperty = {
            type: 'string'
          };
          expect(isolateScope.getInputType()).toEqual('text');
        });

        it('should return "number" for a number', function() {
          isolateScope.newProperty = {
            type: 'number'
          };
          expect(isolateScope.getInputType()).toEqual('number');
        });
      });
    });

    describe('when scope.object is an array', function() {
      beforeEach(function() {
        bard.appModule('angular-json-edit');

        bard.inject(function($window, $rootScope, $compile) {
          testScope = $rootScope;
          elm = angular.element('<json-editor-add-property object="newConfig" newProperty="{}">');

          testScope.newConfig = angular.copy(testArray);

          $compile(elm)(testScope);
          testScope.$digest();
          isolateScope = elm.isolateScope();
        });
      });

      it('should push an empty array onto the scope object when new type is array', function() {
        isolateScope.newProperty = {
          type: 'array',
          name: 'newArray'
        };
        isolateScope.addProperty();
        expect(isolateScope.object[2]).toEqual([]);
      });

      it('should push an empty object onto the scope object when new type is object', function() {
        isolateScope.newProperty = {
          type: 'object',
          name: 'newObject'
        };
        isolateScope.addProperty();
        expect(isolateScope.object[2]).toEqual({});
      });

      it('should push an empty string onto the scope object when new type is string', function() {
        isolateScope.newProperty = {
          type: 'string',
          name: 'newString'
        };
        isolateScope.addProperty();
        expect(isolateScope.object[2]).toEqual('');
      });

      it('should push a number onto the scope object when new type is number', function() {
        isolateScope.newProperty = {
          type: 'number',
          name: 'newNumber'
        };
        isolateScope.addProperty();
        expect(isolateScope.object[2]).toEqual(0);
      });

      it('should push a boolean onto the scope object when new type is boolean', function() {
        isolateScope.newProperty = {
          type: 'boolean',
          name: 'newNumber'
        };
        isolateScope.addProperty();
        expect(typeof isolateScope.object[2]).toEqual('boolean');
      });
    });
  });

  describe('other functions', function() {
    beforeEach(function() {
      bard.appModule('angular-json-edit');

      bard.inject(function($window, $rootScope, $compile) {
        testScope = $rootScope;
        elm = angular.element('<json-editor-add-property object="newConfig" newProperty="{}">');

        testScope.newConfig = angular.copy(testArray);

        $compile(elm)(testScope);
        testScope.$digest();
        isolateScope = elm.isolateScope();
      });
    });

    describe('checkKeydown', function() {
      it('should call addProperty if enter pressed', function() {
        var testEvent = {
          keyCode: 13
        };
        isolateScope.addProperty = sinon.spy();

        isolateScope.checkKeydown(testEvent);

        expect(isolateScope.addProperty.calledOnce).toEqual(true);
      });
    });

    describe('showValueField', function() {
      it('should return true for strings', function() {
        isolateScope.newProperty = {
          type: 'string'
        };
        var testResult = isolateScope.showValueField();
        expect(testResult).toEqual(true);
      });

      it('should return true for numbers', function() {
        isolateScope.newProperty = {
          type: 'number'
        };
        var testResult = isolateScope.showValueField();
        expect(testResult).toEqual(true);
      });

      it('should return false for objects', function() {
        isolateScope.newProperty = {
          type: 'object'
        };
        var testResult = isolateScope.showValueField();
        expect(testResult).toEqual(false);
      });

      it('should return false for arrays', function() {
        isolateScope.newProperty = {
          type: 'array'
        };
        var testResult = isolateScope.showValueField();
        expect(testResult).toEqual(false);
      });
    });
  });
});
