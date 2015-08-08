# angularJsonEdit

An infinitely nesting, dependency free interactive JSON editor for Angular.  Can support an infinitely nested object without the need to install jQuery, bootstrap, or any ui dependencies.  All changes occur within the digest cycle with no manual calls of $scope.$digest or $scope.$apply. 100% test covered.

# Usage

```
bower install angular-json-edit
```

Add the javascript and css files to your index.html

```html
<script src="bower_components/angular-json-edit/dist/angularJsonEdit.js"></script>
<link rel="stylesheet" href="bower_components/angular-json-edit/dist/styles/jsonEditor.css">
```

Include the directive in your template

```html
<json-editor config="<your JSON object>"</json-editor>
```
