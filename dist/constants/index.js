(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', './cadescom', './capicom', './logLevel', './XmlDsigGost'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, require('./cadescom'), require('./capicom'), require('./logLevel'), require('./XmlDsigGost'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, global.cadescom, global.capicom, global.logLevel, global.XmlDsigGost);
    global.index = mod.exports;
  }
})(this, function (module, CADESCOM, CAPICOM, LOG_LEVEL, XML_DSIG_GOST) {
  'use strict';

  module.exports = {
    CADESCOM: CADESCOM,
    CAPICOM: CAPICOM,
    LOG_LEVEL: LOG_LEVEL,
    XML_DSIG_GOST: XML_DSIG_GOST
  };
});