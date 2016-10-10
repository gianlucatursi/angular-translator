/**
 * A translation module for AngularJS
 * @version v0.0.1 - 2016-10-10 * @link https://github.com/gianlucatursi/angular-translator
 * @author Gianluca Tursi <gian.tursi@gmail.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function() {
  'use strict';
  var ngTranslator = angular.module('ngTranslator', []);

  $translatorService.$inject = ['$http', '$q', '$compile', '$rootScope'];
  ngTranslator.service('$translator', $translatorService);

  $translatorDirective.$inject = ['$translator'];
  ngTranslator.directive("translated", $translatorDirective);

  /**
   * Translator
   * @param  {[type]} $http        [description]
   * @param  {[type]} $q           [description]
   * @return {[type]}              [description]
   */
  function $translatorService($http, $q, $compile, $rootScope) {

    var dictionary;
    var options = {};

    var translatorModule = {
      configure: _configure,
      ready    : _isReady,
      getLanguage : _getLanguage,
      changeLanguage : _changeLanguage,
      translate: _translate
    };

    /**
     * Configure Service.
     * Load the correct language otherwise choose default
     * @param {object} _options {{
         *                    language: string, - language selected
         *                    default: string,  - default languge (if the <language> does not exists) 
         *                    path: string      - default folder where are the .json languages
         *                 }}
     * @param {undefined|boolean} _forced if is True then i use previous options otherwise i use {@param _options}
     * @public
     */
    function _configure(_options, _forced) {
      options = !_forced ? _options : options;

      var defer = $q.defer();

      $http
        .get(options.path + options.language + '.json')
        .success(
          function (data) {
            dictionary = data;
            defer.resolve();
          })
        .error(function () {
          $http
            .get(options.path + options.default + '.json')
            .success(
              function (data) {
                dictionary = data;
                defer.resolve();
              })
            .error(
              function(){
                defer.reject();
              });
        });

      return defer.promise;
    }

    /**
     * isReady is True if dictionary isn't undefined
     * @returns {boolean} True|False if dictionary is undefined or not
     * @public
     */
    function _isReady(){
      return !!dictionary;
    }

    function _changeLanguage(new_options, scope){
      var defer = $q.defer();

      _configure(new_options)
        .then(
          function(){
            $compile(window.document)($rootScope);
            defer.resolve();
          },
          function(){
            defer.reject();
          }
        );

      return defer.promise;
    }

    /**
     * Get key value in language dictionary loaded
     * @param key
     * @returns {string|HTML}
     * @public
     */
    function _translate(key, params, prural) {
      var string = Object.byString(dictionary, key);
      params = params || {};

      if(prural){
        if(string.length == 2)
          string = parseInt(prural) > 1 ? string[1] : string[0];
        else
          string = '';
      }

      for(key in params){
        string = string.replace(new RegExp('@'+key, 'g'), params[key]);
      }

      return string;
    }

    /**
     * Return the current language
     * @returns {string|string|*}
     * @private
     */
    function _getLanguage(){
      return options.language;
    }

    /**
     * Navigate path in object from string path
     * Es: { first: { second: "hi" } the string path is "first.second"
         */
    Object.byString = function(o, s) {
      s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
      s = s.replace(/^\./, '');           // strip a leading dot
      var a = s.split('.');
      for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
          o = o[k];
        } else {
          return;
        }
      }
      return o;
    };

    return translatorModule;
  }

  /**
   * Translator directive.
   * @param  {[type]} $translator [description]
   * @return {[type]}             [description]
   */
  function $translatorDirective($translator){
    return {
      restrict: "A",
      scope: {
        translated: "@",
        placeholderTranslated: "@",
        prural: "@",
        translatedParams: "=translatedParams"
      },
      link: function (scope, element, attributes) {
        if($translator.ready()){
          _translate();
        }else{
          $translator
            .configure(null, true)
            .then(
              function success(){
                _translate();
              },
              function error(){
                throw Error("Ops. Somethings went wrong. Check your language files");
              }
            );
        }

        /**
         * Translate with the correct value
         * @return {[type]} [description]
         */
        function _translate(){

          if(scope.translated){
            element.html($translator.translate(scope.translated, scope.translatedParams, scope.prural));
          }
          if(scope.placeholderTranslated){
            element.attr('placeholder', $translator.translate(scope.placeholderTranslated, scope.translatedParams, scope.prural));
          }

          element.addClass('translator-' + $translator.getLanguage());
        }
      }
    };
  }

})(window);