(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["module"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod);
    global.logLevel = mod.exports;
  }
})(this, function (module) {
  "use strict";

  module.exports = {
    /**
     * @constant {Number} LOG_LEVEL_DEBUG Уровень ведения логов DEBUG.
     */
    LOG_LEVEL_DEBUG: 4,
    /**
     * @constant {Number} LOG_LEVEL_INFO Уровень ведения логов INFO.
     */
    LOG_LEVEL_INFO: 2,
    /**
     * @constant {Number} LOG_LEVEL_ERROR Уровень ведения логов ERROR.
     */
    LOG_LEVEL_ERROR: 1
  };
});