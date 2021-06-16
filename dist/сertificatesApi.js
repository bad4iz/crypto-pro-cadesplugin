(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', './сertificateAdjuster', './cadescomMethods', './xmlSitnatureMethods', './constants'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, require('./сertificateAdjuster'), require('./cadescomMethods'), require('./xmlSitnatureMethods'), require('./constants'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, global.ertificateAdjuster, global.cadescomMethods, global.xmlSitnatureMethods, global.constants);
    global.ertificatesApi = mod.exports;
  }
})(this, function (module, CertificateAdjuster, cadescomMethods, _require, _require2) {
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

  var doXmlSitnatureAlgorithm = _require.doXmlSitnatureAlgorithm,
      doXmlSitnatureType = _require.doXmlSitnatureType;
  var _require2$CAPICOM = _require2.CAPICOM,
      CAPICOM_CURRENT_USER_STORE = _require2$CAPICOM.CAPICOM_CURRENT_USER_STORE,
      CAPICOM_MY_STORE = _require2$CAPICOM.CAPICOM_MY_STORE,
      CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED = _require2$CAPICOM.CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED,
      CAPICOM_CERTIFICATE_FIND_SHA1_HASH = _require2$CAPICOM.CAPICOM_CERTIFICATE_FIND_SHA1_HASH,
      CAPICOM_CERTIFICATE_FIND_TIME_VALID = _require2$CAPICOM.CAPICOM_CERTIFICATE_FIND_TIME_VALID,
      CAPICOM_CERTIFICATE_FIND_EXTENDED_PROPERTY = _require2$CAPICOM.CAPICOM_CERTIFICATE_FIND_EXTENDED_PROPERTY,
      CAPICOM_PROPID_KEY_PROV_INFO = _require2$CAPICOM.CAPICOM_PROPID_KEY_PROV_INFO,
      CAPICOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME = _require2$CAPICOM.CAPICOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME,
      CAPICOM_CERTIFICATE_INCLUDE_END_ENTITY_ONLY = _require2$CAPICOM.CAPICOM_CERTIFICATE_INCLUDE_END_ENTITY_ONLY,
      _require2$CADESCOM = _require2.CADESCOM,
      CADESCOM_BASE64_TO_BINARY = _require2$CADESCOM.CADESCOM_BASE64_TO_BINARY,
      CADESCOM_CADES_BES = _require2$CADESCOM.CADESCOM_CADES_BES,
      CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED = _require2$CADESCOM.CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED;


  //////////////////////////////////////
  // NOTE Object create
  //////////////////////////////////////

  /**
   * @description объект предоставляет методы для получения данных о сертификатах, а так же для их подписания
   */
  var CertificatesApi = Object.create(null);

  //////////////////////////////////////
  // NOTE Methods
  //////////////////////////////////////

  /**
   * @async
   * @method about
   * @description выводит информацию
   */
  CertificatesApi.about = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return cadescomMethods.oAbout();

            case 3:
              return _context.abrupt('return', _context.sent);

            case 6:
              _context.prev = 6;
              _context.t0 = _context['catch'](0);
              throw new Error(_context.t0.message);

            case 9:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[0, 6]]);
    }));

    function about() {
      return _ref.apply(this, arguments);
    }

    return about;
  }();

  /**
   * @async
   * @method getCertsList
   * @throws {Error}
   * @description получает массив валидных сертификатов
   */
  CertificatesApi.getCertsList = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var oStore, certificates, findCertificate, findCertsWithPrivateKey, count, createCertList, index, certApi, сertificateAdjuster;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return cadescomMethods.oStore();

            case 3:
              oStore = _context2.sent;
              _context2.next = 6;
              return oStore.Open(CAPICOM_CURRENT_USER_STORE, CAPICOM_MY_STORE, CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED);

            case 6:
              _context2.next = 8;
              return oStore.Certificates;

            case 8:
              certificates = _context2.sent;

              if (certificates) {
                _context2.next = 11;
                break;
              }

              throw new Error('Нет доступных сертификатов');

            case 11:
              _context2.next = 13;
              return certificates.Find(CAPICOM_CERTIFICATE_FIND_TIME_VALID);

            case 13:
              findCertificate = _context2.sent;
              _context2.next = 16;
              return findCertificate.Find(CAPICOM_CERTIFICATE_FIND_EXTENDED_PROPERTY, CAPICOM_PROPID_KEY_PROV_INFO);

            case 16:
              findCertsWithPrivateKey = _context2.sent;
              _context2.next = 19;
              return findCertsWithPrivateKey.Count;

            case 19:
              count = _context2.sent;

              if (count) {
                _context2.next = 22;
                break;
              }

              throw new Error('Нет сертификатов с приватным ключом');

            case 22:
              createCertList = [];
              index = 0;

            case 24:
              if (!(index < count)) {
                _context2.next = 59;
                break;
              }

              _context2.next = 27;
              return findCertsWithPrivateKey.Item(index + 1);

            case 27:
              certApi = _context2.sent;
              сertificateAdjuster = Object.create(CertificateAdjuster);
              _context2.t0 = сertificateAdjuster;
              _context2.t1 = certApi;
              _context2.next = 33;
              return certApi.IssuerName;

            case 33:
              _context2.t2 = _context2.sent;
              _context2.next = 36;
              return certApi.PrivateKey;

            case 36:
              _context2.t3 = _context2.sent;
              _context2.next = 39;
              return certApi.SerialNumber;

            case 39:
              _context2.t4 = _context2.sent;
              _context2.next = 42;
              return certApi.SubjectName;

            case 42:
              _context2.t5 = _context2.sent;
              _context2.next = 45;
              return certApi.Thumbprint;

            case 45:
              _context2.t6 = _context2.sent;
              _context2.next = 48;
              return certApi.ValidFromDate;

            case 48:
              _context2.t7 = _context2.sent;
              _context2.next = 51;
              return certApi.ValidToDate;

            case 51:
              _context2.t8 = _context2.sent;
              _context2.t9 = {
                from: _context2.t7,
                to: _context2.t8
              };
              _context2.t10 = {
                certApi: _context2.t1,
                issuerInfo: _context2.t2,
                privateKey: _context2.t3,
                serialNumber: _context2.t4,
                subjectInfo: _context2.t5,
                thumbprint: _context2.t6,
                validPeriod: _context2.t9
              };

              _context2.t0.init.call(_context2.t0, _context2.t10);

              createCertList.push(сertificateAdjuster);

            case 56:
              index++;
              _context2.next = 24;
              break;

            case 59:

              oStore.Close();

              return _context2.abrupt('return', createCertList);

            case 63:
              _context2.prev = 63;
              _context2.t11 = _context2['catch'](0);
              throw new Error(_context2.t11.message);

            case 66:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this, [[0, 63]]);
    }));

    function getCertsList() {
      return _ref2.apply(this, arguments);
    }

    return getCertsList;
  }();

  /**
   * @async
   * @method currentCadesCert
   * @param {String} thumbprint значение сертификата
   * @throws {Error}
   * @description получает сертификат по thumbprint значению сертификата
   */
  CertificatesApi.currentCadesCert = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(thumbprint) {
      var oStore, certificates, count, findCertificate, certificateItem;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;

              if (thumbprint) {
                _context3.next = 5;
                break;
              }

              throw new Error('Не указано thumbprint значение сертификата');

            case 5:
              if (!(typeof thumbprint !== 'string')) {
                _context3.next = 7;
                break;
              }

              throw new Error('Не валидное значение thumbprint сертификата');

            case 7:
              _context3.next = 9;
              return cadescomMethods.oStore();

            case 9:
              oStore = _context3.sent;
              _context3.next = 12;
              return oStore.Open(CAPICOM_CURRENT_USER_STORE, CAPICOM_MY_STORE, CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED);

            case 12:
              _context3.next = 14;
              return oStore.Certificates;

            case 14:
              certificates = _context3.sent;
              _context3.next = 17;
              return certificates.Count;

            case 17:
              count = _context3.sent;
              _context3.next = 20;
              return certificates.Find(CAPICOM_CERTIFICATE_FIND_SHA1_HASH, thumbprint);

            case 20:
              findCertificate = _context3.sent;

              if (!count) {
                _context3.next = 29;
                break;
              }

              _context3.next = 24;
              return findCertificate.Item(1);

            case 24:
              certificateItem = _context3.sent;

              oStore.Close();

              return _context3.abrupt('return', certificateItem);

            case 29:
              throw new Error('\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438 \u0432\u0435\u0440\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u0430 \u043F\u043E thumbprint \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044E: ' + thumbprint);

            case 30:
              _context3.next = 35;
              break;

            case 32:
              _context3.prev = 32;
              _context3.t0 = _context3['catch'](0);
              throw new Error(_context3.t0.message);

            case 35:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this, [[0, 32]]);
    }));

    function currentCadesCert(_x) {
      return _ref3.apply(this, arguments);
    }

    return currentCadesCert;
  }();

  /**
   * @async
   * @method getCert
   * @param {String} thumbprint значение сертификата
   * @throws {Error}
   * @description
   * Получает сертификат по thumbprint значению сертификата.
   * В отличие от currentCadesCert использует для поиска коллбек функцию getCertsList
   * С помощью этой функции в сертификате доступны методы из сertificateAdjuster
   */
  CertificatesApi.getCert = function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(thumbprint) {
      var certList, index;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;

              if (thumbprint) {
                _context4.next = 5;
                break;
              }

              throw new Error('Не указано thumbprint значение сертификата');

            case 5:
              if (!(typeof thumbprint !== 'string')) {
                _context4.next = 7;
                break;
              }

              throw new Error('Не валидное значение thumbprint сертификата');

            case 7:
              _context4.next = 9;
              return this.getCertsList();

            case 9:
              certList = _context4.sent;
              index = 0;

            case 11:
              if (!(index < certList.length)) {
                _context4.next = 19;
                break;
              }

              if (!(thumbprint === certList[index].thumbprint)) {
                _context4.next = 16;
                break;
              }

              _context4.next = 15;
              return certList[index];

            case 15:
              return _context4.abrupt('return', _context4.sent);

            case 16:
              index++;
              _context4.next = 11;
              break;

            case 19:
              throw new Error('\u041D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E \u0441\u0435\u0440\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u0430 \u043F\u043E thumbprint \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044E: ' + thumbprint);

            case 22:
              _context4.prev = 22;
              _context4.t0 = _context4['catch'](0);
              throw new Error(_context4.t0.message);

            case 25:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this, [[0, 22]]);
    }));

    function getCert(_x2) {
      return _ref4.apply(this, arguments);
    }

    return getCert;
  }();

  /**
   * @async
   * @method signBase64
   * @param {String} thumbprint значение сертификата
   * @param {String} base64 строка в формате base64
   * @param {Boolean} type тип подписи true=откреплённая false=прикреплённая
   * @throws {Error}
   * @description подпись строки в формате base64
   */
  CertificatesApi.signBase64 = function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(thumbprint, base64) {
      var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var oAttrs, oSignedData, oSigner, currentCert, authenticatedAttributes2;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;

              if (thumbprint) {
                _context5.next = 5;
                break;
              }

              throw new Error('Не указано thumbprint значение сертификата');

            case 5:
              if (!(typeof thumbprint !== 'string')) {
                _context5.next = 7;
                break;
              }

              throw new Error('Не валидное значение thumbprint сертификата');

            case 7:
              _context5.next = 9;
              return cadescomMethods.oAtts();

            case 9:
              oAttrs = _context5.sent;
              _context5.next = 12;
              return cadescomMethods.oSignedData();

            case 12:
              oSignedData = _context5.sent;
              _context5.next = 15;
              return cadescomMethods.oSigner();

            case 15:
              oSigner = _context5.sent;
              _context5.next = 18;
              return this.currentCadesCert(thumbprint);

            case 18:
              currentCert = _context5.sent;
              _context5.next = 21;
              return oSigner.AuthenticatedAttributes2;

            case 21:
              authenticatedAttributes2 = _context5.sent;
              _context5.next = 24;
              return oAttrs.propset_Name(CAPICOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME);

            case 24:
              _context5.next = 26;
              return oAttrs.propset_Value(new Date());

            case 26:
              _context5.next = 28;
              return authenticatedAttributes2.Add(oAttrs);

            case 28:
              _context5.next = 30;
              return oSignedData.propset_ContentEncoding(CADESCOM_BASE64_TO_BINARY);

            case 30:
              _context5.next = 32;
              return oSignedData.propset_Content(base64);

            case 32:
              _context5.next = 34;
              return oSigner.propset_Certificate(currentCert);

            case 34:
              _context5.next = 36;
              return oSigner.propset_Options(CAPICOM_CERTIFICATE_INCLUDE_END_ENTITY_ONLY);

            case 36:
              _context5.next = 38;
              return oSignedData.SignCades(oSigner, CADESCOM_CADES_BES, type);

            case 38:
              return _context5.abrupt('return', _context5.sent);

            case 41:
              _context5.prev = 41;
              _context5.t0 = _context5['catch'](0);
              throw new Error(_context5.t0.message);

            case 44:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this, [[0, 41]]);
    }));

    function signBase64(_x3, _x4) {
      return _ref5.apply(this, arguments);
    }

    return signBase64;
  }();

  /**
   * @async
   * @method signXml
   * @param {String} thumbprint значение сертификата
   * @param {String} xml строка в формате XML
   * @param {Number} CADESCOM_XML_SIGNATURE_TYPE тип подписи 0=Вложенная 1=Оборачивающая 2=по шаблону @default 0
   * @description подписание XML документа
   */
  CertificatesApi.signXml = function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(thumbprint, xml) {
      var cadescomXmlSignatureType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED;

      var currentCert, publicKey, algorithm, value, oSigner, oSignerXML, _doXmlSitnatureAlgori, signAlgorithm, hashAlgorithm, xmlSitnatureType;

      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              _context6.next = 3;
              return this.currentCadesCert(thumbprint);

            case 3:
              currentCert = _context6.sent;
              _context6.next = 6;
              return currentCert.PublicKey();

            case 6:
              publicKey = _context6.sent;
              _context6.next = 9;
              return publicKey.Algorithm;

            case 9:
              algorithm = _context6.sent;
              _context6.next = 12;
              return algorithm.Value;

            case 12:
              value = _context6.sent;
              _context6.next = 15;
              return cadescomMethods.oSigner();

            case 15:
              oSigner = _context6.sent;
              _context6.next = 18;
              return cadescomMethods.oSignedXml();

            case 18:
              oSignerXML = _context6.sent;
              _doXmlSitnatureAlgori = doXmlSitnatureAlgorithm(value), signAlgorithm = _doXmlSitnatureAlgori.signAlgorithm, hashAlgorithm = _doXmlSitnatureAlgori.hashAlgorithm;
              xmlSitnatureType = doXmlSitnatureType(cadescomXmlSignatureType);
              _context6.next = 23;
              return oSigner.propset_Certificate(currentCert);

            case 23:
              _context6.next = 25;
              return oSignerXML.propset_Content(xml);

            case 25:
              _context6.next = 27;
              return oSignerXML.propset_SignatureType(xmlSitnatureType);

            case 27:
              _context6.next = 29;
              return oSignerXML.propset_SignatureMethod(signAlgorithm);

            case 29:
              _context6.next = 31;
              return oSignerXML.propset_DigestMethod(hashAlgorithm);

            case 31:
              _context6.next = 33;
              return oSignerXML.Sign(oSigner);

            case 33:
              return _context6.abrupt('return', _context6.sent);

            case 36:
              _context6.prev = 36;
              _context6.t0 = _context6['catch'](0);
              throw new Error(_context6.t0);

            case 39:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this, [[0, 36]]);
    }));

    function signXml(_x6, _x7) {
      return _ref6.apply(this, arguments);
    }

    return signXml;
  }();

  //////////////////////////////////////
  // NOTE Exports
  //////////////////////////////////////

  module.exports = CertificatesApi;
});