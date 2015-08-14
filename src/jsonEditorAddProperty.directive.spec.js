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
    });
  });
});
