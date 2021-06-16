(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './сertificatesApi', './lib/cadesplugin_api'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./сertificatesApi'), require('./lib/cadesplugin_api'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.ertificatesApi, global.cadesplugin_api);
    global.index = mod.exports;
  }
})(this, function (exports, CertificatesApi) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  //////////////////////////
  // NOTE cadesplugin await function
  ////////////////////////////////

  var cadespluginOnload = function cadespluginOnload() {
    return function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var getCertsList, getCert, currentCadesCert, signBase64, signXml, about;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return window.cadesplugin;

              case 3:
                getCertsList = CertificatesApi.getCertsList, getCert = CertificatesApi.getCert, currentCadesCert = CertificatesApi.currentCadesCert, signBase64 = CertificatesApi.signBase64, signXml = CertificatesApi.signXml, about = CertificatesApi.about;
                return _context.abrupt('return', {
                  getCertsList: getCertsList,
                  getCert: getCert,
                  currentCadesCert: currentCadesCert,
                  signBase64: signBase64,
                  signXml: signXml,
                  about: about
                });

              case 7:
                _context.prev = 7;
                _context.t0 = _context['catch'](0);
                throw new Error(_context.t0);

              case 10:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 7]]);
      }));

      function cadespluginOnload() {
        return _ref.apply(this, arguments);
      }

      return cadespluginOnload;
    }()();
  };

  /////////////////////////////////////////////
  // NOTE Exports
  /////////////////////////////////////////////

  exports.default = cadespluginOnload;
});