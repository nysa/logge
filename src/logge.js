(function() {

  'use strict';

  angular.module('logge', []).
    provider('$logge', $LoggeProvider);

  function $LoggeProvider() {
    var level = 0;

    /**
     * Sets the log level.
     *
     * @param {string|number} logLevel
     */
    this.level = function(logLevel) {
      level = logLevel;
    };

    this.$get = ['$window', function($window) {
      return new Logge({
        console: $window.console,
        level: level
      });
    }];
  }

  /**
   * Logge logger.
   *
   * @param {object} config
   */
  function Logge(config) {
    var LEVELS = {
      debug: 0,
      log: 1,
      info: 2,
      warn: 3,
      error: 4
    };
    var _console = config.console;
    var _level = typeof config.level === 'string' ?
      LEVELS[config.level] :
      config.level;

    /**
     * Factory for generating log methods. Preserves originating source in
     * browser console if `bind` is available.
     *
     * Based on a
     * [Gist by Brian Grinstead]{@link https://gist.github.com/bgrins/5108712}.
     *
     * @param {string} method
     * @return {function}
     */
    var _createMethod = function(method) {
      var hasConsole = _console && _console[method];
      var hasBind = !!Function.prototype.bind;
      var fn = function() {};

      if (!hasConsole) return fn;
      if (LEVELS[method] < _level) return fn; // Log level set to ignore

      if (hasBind) {
        // Bind to preserve originating source in browser console
        fn = _console[method].bind(_console);
      } else {
        fn = function() {
          _console[method].apply.call(_console[method], _console, arguments);
        };
      }

      return fn;
    };

    this.debug = function() {};
    this.log = function() {};
    this.info = function() {};
    this.warn = function() {};
    this.error  = function() {};

    // Generate prototype methods
    for (var method in LEVELS) this[method] = _createMethod(method);
  }

})();

