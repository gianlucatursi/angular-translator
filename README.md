# Angular Translator

A translation module for AngularJS. 

[![Bower version][bower-image]][bower-image]
[![License][license-image]][license-url]

##Table of contents:
- [Getting started](#get-started)
    - [Installation](#installation)
    - [Import in your project](#import-in-your-project)
    - [Configuration](#configuration)
    - [Define translations](#define-translations)
- [How to use](#how-to-use)
    - [Simple translation](#simple-translation)
    - [Translation with params](#translation-with-params)
    - [Inputs](#inputs)
    - [Translation for prural](#translation-for-prural)
    - [Other examples](#other-examples)
    - [Dynamic translation](#dynamic-translation)
    - [Switch language](#switch-language)
- [License](#license)

<a name="license"></a>
## Getting started

### Installation
You can install with bower or npm  
```bash
// bower
bower install angular-translator --save

// npm
npm install angular-translator --save
```

### Import in your project
  1) Include `dist/angular-translator.min.js` in our `index.html`, after including Angular itself.
  2) Inject `ngTranslator` to your main module's list of dependencies.
### Configuration
In `app.run` method configure the translation module (This is the best way but you can do this wherever you want):

```javascript
app.run(
    function($translator){
        $translator
            .configure({
                language : "en", //name of en.json
                path     : "languages/", //root directory for languages
                default  : "en" //default language
            });
    });
```
### Define translations
Angular-translator working with external file for translations.  
Create a folder in your project, for example `./languages`, and put inside your translations file in json format.  
For example you can create two languages (`en.json` and `it.json`) for English and Italian and should be something like:

```
// eng
{ "say_hi": "Hello World!" }

// it
{ "say_hi": "Ciao Mondo!" }

```
## How to use
                    
In the example below i use always `<span>` element but you can use whatever you want</p>

### Simple translation
Used for a simple text to translate  

```javascript
/** Result **/
Hello World!

/** HTML **/
<span translated="title"></span>

/** en.json **/
{ "title" : "Hello World!" }
```

### Translation with params
Used for translate a string that contain runtime data.  
You can define your dynamic content with `@param_name` then use `translated-params` in your HTML tag for passing **@param_name** value.  
Check the sample below:

```javascript
/** Result **/
A translation module for AngularJS. [v0.0.1]

/** HTML **/
<span translated="description" translated-params="version"></span>
<!-- alternative without angular var -->
<span translated="description" translated-params="{'version':'v0.0.1'}"></span>

/** AngularJS **/
$scope.version = {"version":"v0.0.1"};

/** en.json **/
{ "description": "A translation module for AngularJS. [@version]" }
```

### Inputs
Used for translate placeholder in input filed. Insert in you translated tag `placeholder-translated`  
```javascript
/** HTML **/
<form>
    <label translated="form.username.label"></label>
    <input placeholder-translated="form.username.placehoder" translated="">
</form>

/** en.json **/
{
    "form": {
        "username": {
            "label": "Username",
            "placehoder": "Insert your username"
        },
        "submit": "Submit",
        "cancel": "Cancel"
    }
}
```
                 
### Translation for prural
Used for translate a string that can be single or prural.  
In the example below there is a combination of parameters and prural.  
In your `<lang>.json` file you should define an array with two elements and in position `0` the sentece for the single case and in position `1` the sentence for the prural case.  

```javascript
/** Result **/
1 result

6 results

/** HTML **/
<!-- Single value -->
<p translated="results" prural="results_value.one.value" translated-params="results_value.one"></p>

<!-- Prural value -->
<p translated="results" prural="6" translated-params="{'value': 6}"></p>

/** AngularJS **/
$scope.results_value = {
    "one": {
        "value" : 1
    }
};

/** en.json **/
{ "results": ["@value result", "@value results"] }

```

### Other examples
This chapter is for understand better how to define you json file for a language.  
      
```javascript

/** HTML **/
<!-- Simple translation -->
<div translated="home_page.title"></div>

<!-- Array in <lang>.json -->
<p translated="home_page.form_inputs[0].label"></p>

<!-- Placeholder translation -->
<input translated="" placeholder-translated="home_page.form_inputs[0].placeholder">

<!-- Prural with parameters -->
<span translated="home_page.results" prural="1" translated-params="{'value': 1}"></span>

<!-- Prural with parameters -->
<h1 translated="home_page.results" prural="6" translated-params="{'value': 6}"></h1>

/** en.json **/

{
    "home_page": {
        "title" : "Home page",
        "results": [
            "@value home page result",
            "@value home page results"
        ],
        "form_inputs": [
            {
                "label": "first label input",
                "placeholder": "first input placeholder"
            }
        ]
    }
}

```
### Dynamic translation
Inject `$translator` service in your controller/service/etc.. for a run time translation with `$translator.translate(<key>, <params>, <prural_value>)`   
      
```javascript

/** HTML **/
<button ng-click="translation()">Click Me!</button>

/** AngularJS **/
app.controller('..', ['$scope', '$translator',
    function($scope, $translator){
        $scope.translation = function(){
            alert(
                $translator.translate('message_in_controller', {param_1: "parameter"}, 1)
            );
        }
    }
);

/** en.json **/
{ "message_in_controller": "Dynamic translation!" }

```
### Switch language
You can switch between language in real time. (try the example in this repo)

```javascript

/** HTML **/
<p translated="message"></p>
<button ng-click="switch('it')">Italiano</button>
<button ng-click="switch('en')">English</button>

/** AngularJS **/
$scope.switch = function _switch(lng){
    // async method. When finish call $compile.
    $translator
        .changeLanguage({
            language : lng,
            path     : "languages/",
            default  : "en"
    });
}

/** en.json **/
{ "message" : "English message!" }

```

<a name="license"></a>
##LICENSE
The MIT License

Copyright (c) 2016 Gianluca Tursi http://www.gianlucatursi.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



[bower-image]: https://img.shields.io/bower/v/angular-translator.svg?style=flat-square
[bower-url]: https://github.com/gianlucatursi/angular-translator

[license-image]: http://img.shields.io/npm/l/angular-translator.svg?style=flat-square
[license-url]: LICENSE
