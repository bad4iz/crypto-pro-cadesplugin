(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod);
    global.cadescomMethods = mod.exports;
  }
})(this, function (module) {
  'use strict';

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

  //////////////////////////////////////
  // NOTE Object create
  //////////////////////////////////////

  /**
   * @description объект для создания асинхроннного/синхранного объекта методом cadesplugin
   */
  var cadesMethods = Object.create(null);

  //////////////////////////////////////
  // NOTE Methods
  //////////////////////////////////////

  /**
   * @method init
   * @param {Object} args объект инициализирующих значений
   * @description метод-конструктор
   */
  cadesMethods.init = function init(args) {
    this.O_STORE = args.O_STORE;
    this.O_ATTS = args.O_ATTS;
    this.O_SIGNED_DATA = args.O_SIGNED_DATA;
    this.O_SIGNER = args.O_SIGNER;
    this.O_SIGNED_XML = args.O_SIGNED_XML;
    this.O_ABOUT = args.O_ABOUT;
  };

  /**
   * @async
   * @method createObject
   * @param {String} method
   * @returns {Method}
   * @description выбирает доступный метод для текущего браузера
   */
  cadesMethods.createObject = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(method) {
      var supportedMethod;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return window.cadesplugin.CreateObject;

            case 2:
              if (!_context.sent) {
                _context.next = 8;
                break;
              }

              _context.next = 5;
              return window.cadesplugin.CreateObject(method);

            case 5:
              _context.t0 = _context.sent;
              _context.next = 11;
              break;

            case 8:
              _context.next = 10;
              return window.cadesplugin.CreateObjectAsync(method);

            case 10:
              _context.t0 = _context.sent;

            case 11:
              supportedMethod = _context.t0;
              return _context.abrupt('return', supportedMethod);

            case 13:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function createObject(_x) {
      return _ref.apply(this, arguments);
    }

    return createObject;
  }();

  /**
   * @method oStore
   * @returns {Object}
   * @description возвращает созданный объект
   */
  cadesMethods.oStore = function oStore() {
    return this.createObject(this.O_STORE);
  };
  /**
   * @method oAtts
   * @returns {Object}
   * @description возвращает созданный объект
   */
  cadesMethods.oAtts = function oAtts() {
    return this.createObject(this.O_ATTS);
  };
  /**
   * @method oSignedData
   * @returns {Object}
   * @description возвращает созданный объект
   */
  cadesMethods.oSignedData = function oSignedData() {
    return this.createObject(this.O_SIGNED_DATA);
  };
  /**
   * @method oSigner
   * @returns {Object}
   * @description возвращает созданный объект
   */
  cadesMethods.oSigner = function oSigner() {
    return this.createObject(this.O_SIGNER);
  };
  /**
   * @method oSignedXml
   * @returns {Object}
   * @description возвращает созданный объект
   */
  cadesMethods.oSignedXml = function oSignedXml() {
    return this.createObject(this.O_SIGNED_XML);
  };
  /**
   * @method oAbout
   * @returns {Object}
   * @description возвращает созданный объект
   */
  cadesMethods.oAbout = function oAbout() {
    return this.createObject(this.O_ABOUT);
  };

  var cadescomMethods = Object.create(cadesMethods);

  cadescomMethods.init({
    O_STORE: 'CAdESCOM.Store',
    O_ATTS: 'CADESCOM.CPAttribute',
    O_SIGNED_DATA: 'CAdESCOM.CadesSignedData',
    O_SIGNER: 'CAdESCOM.CPSigner',
    O_SIGNED_XML: 'CAdESCOM.SignedXML',
    O_ABOUT: 'CAdESCOM.About'
  });

  //////////////////////////////////////
  // NOTE Exports
  //////////////////////////////////////

  module.exports = cadescomMethods;
});