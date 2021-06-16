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
    global.ertificateAdjuster = mod.exports;
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
   * @description объект, в котором собираются данные о сертификате и методы по работе с этими данными
   */
  var CertificateAdjuster = Object.create(null);

  //////////////////////////////////////
  // NOTE Methods
  //////////////////////////////////////

  /**
   * @method init
   * @param {Object} currentCert
   * @description конструктор
   */
  CertificateAdjuster.init = function init(currentCert) {
    var certApi = currentCert.certApi,
        issuerInfo = currentCert.issuerInfo,
        privateKey = currentCert.privateKey,
        serialNumber = currentCert.serialNumber,
        thumbprint = currentCert.thumbprint,
        subjectInfo = currentCert.subjectInfo,
        validPeriod = currentCert.validPeriod;


    this.certApi = certApi;
    this.issuerInfo = issuerInfo;
    this.privateKey = privateKey;
    this.serialNumber = serialNumber;
    this.thumbprint = thumbprint;
    this.subjectInfo = subjectInfo;
    this.validPeriod = validPeriod;
  };

  /**
   * @method friendlyInfo
   * @param {String} subjectIssuer раздел информации 'issuerInfo' или 'subjectInfo'
   * @returns {Object}
   * @throws {Error}
   * @description возврящает объект из сформированных значений
   */
  CertificateAdjuster.friendlyInfo = function friendlyInfo(subjectIssuer) {
    if (!this[subjectIssuer]) {
      throw new Error('Не верно указан аттрибут');
    }

    var subjectIssuerArr = this[subjectIssuer].split(', ');
    var _possibleInfo = this.possibleInfo(subjectIssuer);
    var formedSubjectIssuerInfo = subjectIssuerArr.map(function (tag) {
      var tagArr = tag.split('=');
      tagArr[0] = tagArr[0] + '=';

      return {
        text: tagArr[1],
        value: _possibleInfo[tagArr[0]]
      };
    });

    return formedSubjectIssuerInfo;
  };

  /**
   * @method friendlySubjectInfo
   * @returns {Array}
   * @description возвращает распаршенную информацию о строке subjectInfo
   */
  CertificateAdjuster.friendlySubjectInfo = function friendlySubjectInfo() {
    return this.friendlyInfo('subjectInfo');
  };

  /**
   * @method friendlyIssuerInfo
   * @returns {Array}
   * @description возвращает распаршенную информацию о строке issuerInfo
   */
  CertificateAdjuster.friendlyIssuerInfo = function friendlyIssuerInfo() {
    return this.friendlyInfo('issuerInfo');
  };

  /**
   * @method friendlyValidPeriod
   * @returns {Object}
   * @description возвращает распаршенную информацию об объекте validPeriod
   */
  CertificateAdjuster.friendlyValidPeriod = function friendlyValidPeriod() {
    var _validPeriod = this.validPeriod,
        from = _validPeriod.from,
        to = _validPeriod.to;


    return {
      from: this.friendlyDate(from),
      to: this.friendlyDate(to)
    };
  };

  /**
   * @method possibleInfo
   * @param {String} subjectIssuer раздел информации 'issuerInfo' или 'subjectInfo'
   * @returns {Object}
   * @throws {Error}
   * @description функция формирует ключи и значения в зависимости от переданного параметра
   */
  CertificateAdjuster.possibleInfo = function possibleInfo(subjectIssuer) {
    var attrs = {
      'UnstructuredName=': 'Неструктурированное имя',
      'E=': 'Email',
      'C=': 'Страна',
      'S=': 'Регион',
      'L=': 'Город',
      'STREET=': 'Адрес',
      'O=': 'Компания',
      'T=': 'Должность',
      'ОГРНИП=': 'ОГРНИП',
      'OGRNIP=': 'ОГРНИП',
      'SNILS=': 'СНИЛС',
      'СНИЛС=': 'СНИЛС',
      'INN=': 'ИНН',
      'ИНН=': 'ИНН',
      'ОГРН=': 'ОГРН',
      'OGRN=': 'ОГРН'
    };

    switch (subjectIssuer) {
      case 'subjectInfo':
        attrs['SN='] = 'Фамилия';
        attrs['G='] = 'Имя/Отчество';
        attrs['CN='] = 'Владелец';
        attrs['OU='] = 'Отдел/подразделение';

        return attrs;
      case 'issuerInfo':
        attrs['CN='] = 'Удостоверяющий центр';
        attrs['OU='] = 'Тип';

        return attrs;

      default:
        throw new Error('Не верно указан кейс получаемых данных');
    }
  };

  /**
   * @function friendlyDate
   * @param {String} date строка с датой
   * @returns {Object}
   * @description формирует дату от переданного пареметра
   */
  CertificateAdjuster.friendlyDate = function friendlyDate(date) {
    var newDate = new Date(date);
    var _ref = [newDate.getDate(), newDate.getMonth() + 1, newDate.getFullYear()],
        day = _ref[0],
        month = _ref[1],
        year = _ref[2];
    var _ref2 = [newDate.getHours(), newDate.getMinutes(), newDate.getSeconds()],
        hours = _ref2[0],
        minutes = _ref2[1],
        seconds = _ref2[2];


    return {
      ddmmyy: day + '/' + month + '/' + year,
      hhmmss: hours + ':' + minutes + ':' + seconds
    };
  };

  /**
   * @async
   * @method isValid
   * @returns {Boolean} возвращает валидность сертификата
   * @throws {Error} возвращает сообщение об ошибке
   * @description прозиводит проверку на валидность сертификата
   */
  CertificateAdjuster.isValid = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var _isValid;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return this.certApi.IsValid();

            case 3:
              _isValid = _context.sent;
              _context.next = 6;
              return _isValid.Result;

            case 6:
              return _context.abrupt('return', _context.sent);

            case 9:
              _context.prev = 9;
              _context.t0 = _context['catch'](0);
              throw new Error('\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0435 \u0432\u0430\u043B\u0438\u0434\u043D\u043E\u0441\u0442\u0438 \u0441\u0435\u0440\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u0430: ' + _context.t0.message);

            case 12:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[0, 9]]);
    }));

    function isValid() {
      return _ref3.apply(this, arguments);
    }

    return isValid;
  }();

  //////////////////////////////////////
  // NOTE Exports
  //////////////////////////////////////

  module.exports = CertificateAdjuster;
});