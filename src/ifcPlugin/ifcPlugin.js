/**
 * @class IFCCrypto
 * @description Содержит информацию о криптоустройстве (криптотокен, смарт-карта или криптопровайдер).
 */
function IFCCrypto(resultData) {
  /**@public
   * @description Метод возвращает псевдоним СКЗИ из конфигурационного файла Плагина
   * */
  this.getAlias = function () {
    return IFCConst.emptyString(resultData["alias"]);
  };

  /**@public
   * @description Метод возвращает название СКЗИ из конфигурационного файла Плагина
   * */
  this.getName = function () {
    return IFCConst.emptyString(resultData["name"]);
  };

  /**@public
   * @description Метод возвращает булево выражение: использует ли СКЗИ программный интерфейс PKCS#11
   * */
  this.isPKCS11 = function () {
    return (resultData["type"] === IFCConst.IFC_CRYPTO_PKCS11);
  };

  /**@public
   * @description Метод возвращает булево выражение: использует ли СКЗИ программный интерфейс CryptoAPI
   * */
  this.isCAPI = function () {
    return (resultData["type"] === IFCConst.IFC_CRYPTO_CAPI);
  };

  /**@public
   * @description Метод возвращает булево выражение: использует ли СКЗИ программный интерфейс CryptoAPI под linux
   * */
  this.isCAPI_LINUX = function () {
    return (resultData["type"] === IFCConst.IFC_CRYPTO_CAPI_LINUX);
  };

  /**@public
   * @description Метод возвращает
   * - для PKCS#11: путь доступа к библиотеке PKCS#11 из конфигурационного файла;
   * - для CAPI: имя криптопровайдера из конфигурационного файла
   * */
  this.getPath = function () {
    return IFCConst.emptyString(resultData["path"]);
  };

  /**@public
   * @description Метод возвращает номер криптопровайдера из конфигурационного файла или номер слота для PKCS#11-устройства
   * */
  this.getNumber = function () {
    return IFCConst.emptyString(resultData["num"]);
  };

  /**@public
   * @description Метод возвращает имя считывателя
   * */
  this.getDescription = function () {
    return IFCConst.emptyString(resultData["description"]);
  };

  /**@public
   * @description Метод возвращает серийный номер чипа токена/смарт-карты
   * */
  this.getSerialNumber = function () {
    return IFCConst.emptyString(resultData["serial_number"]);
  };

  /**@public
   * @description Метод возвращает модель токена/смарт-карты
   * */
  this.getModel = function () {
    return IFCConst.emptyString(resultData["model"]);
  };

  /**@public
   * @description Метод возвращает признак пропуска данных полученных с токенов через PKCS#11
   * */
  this.getSkipPKCS11List = function () {
    return IFCConst.emptyString(resultData["skip_pkcs11_list"]);
  };

  /**@public
   * @description Метод возвращает алгоритм используемы для генерации ключей через PKCS#11
   * */
  this.getAlg = function () {
    return IFCConst.emptyString(resultData["alg"]);
  };


  /**@public
   * @description Метод возвращает идентификатор СКЗИ (cryptoId)
   * */
  this.getCryptoId = function () {
    if (resultData["type"] === IFCConst.IFC_CRYPTO_PKCS11)
      resultData["crypto_id"] = resultData["alias"] + "/" + resultData["num"];
    else if ((resultData["type"] === IFCConst.IFC_CRYPTO_CAPI) || (resultData["type"] === IFCConst.IFC_CRYPTO_CAPI_LINUX))
      resultData["crypto_id"] = resultData["alias"];

    return IFCConst.emptyString(resultData['crypto_id']);
  };

  /**@private*/
  this.getExtendedKeyUsage = function () {
    var alias = this.getAlias();

    var eku = [
      {alias: "JaCarta", oid: "1.2.643.3.205.110.1"},
      {alias: "ruTokenECP", oid: "1.2.643.3.205.110.7"},
      {alias: "VIPNet", oid: "1.2.643.3.205.110.6"},
      {alias: "SignalCom", oid: "1.2.643.3.205.110.8"},
      {alias: "LISSI-CSP", oid: "1.2.643.3.205.110.9"},
      {alias: "CryptoPro", oid: "1.2.643.3.205.110.2"}];

    for (var i = 0; i < eku.length; i++) {
      if (alias.indexOf(eku[i].alias) >= 0) return eku[i].oid;
    }

    return "";
  };

  /**@private*/
  this.getCertificatePolicies = function () {
    var alias = this.getAlias();

    var cp = [
      {alias: "JaCarta", oid: IFCConst.OID_KC1 + "," + IFCConst.OID_KC2},
      {alias: "ruTokenECP", oid: IFCConst.OID_KC1 + "," + IFCConst.OID_KC2},
      {alias: "CryptoPro", oid: IFCConst.OID_KC1},
      {alias: "VIPNet", oid: IFCConst.OID_KC1},
      {alias: "SignalCom", oid: IFCConst.OID_KC1},
      {alias: "LISSI-CSP", oid: IFCConst.OID_KC1}];

    for (var i = 0; i < cp.length; i++) {
      if (alias.indexOf(cp[i].alias) >= 0) return cp[i].oid;
    }

    return IFCConst.OID_KC1;
  }
}

/**
 * @class IFCCertificate
 * @description Содержит информацию о сертификате ЭП
 */
function IFCCertificate(info, crypto) {

  /**@public
   * @description Метод возвращает серийный номер сертификата
   * */
  this.getSerialNumber = function () {
    return IFCConst.emptyString(info['cert_sn']);
  };

  /**@public
   * @description Метод возвращает сведения о субъекте сертификата
   * */
  this.getSubjectDN = function () {
    return new IFCDN(IFCConst.emptyString(info['cert_subject']), IFCConst.DN_SEPARATOR_PLUGIN);
  };

  /**@public
   * @description Метод возвращает сведения об издателе сертификата
   * */
  this.getIssuerDN = function () {
    return new IFCDN(IFCConst.emptyString(info['cert_issuer']), IFCConst.DN_SEPARATOR_PLUGIN);
  };

  /**@public
   * @description Метод возвращает срок начала действия сертификата
   * */
  this.getValidFrom = function () {
    return IFCConst.emptyString(this.checkDate(info['cert_valid_from']));
  };

  /**@public
   * @description Метод возвращает срок окончания действия сертификата
   * */
  this.getValidTo = function () {
    return IFCConst.emptyString(this.checkDate(info['cert_valid_to']));
  };

  /**@public
   * @description Метод возвращает алгоритмы подписи и хеширования в виде uri
   * */
  this.getSignAndDigestAlgUri = function () {

    var algOid = this.getSignAlgOid();

    if (algOid === IFCConst.OID_GOSTR3410_2012_256) {
      return {
        signMethod: "http://www.w3.org/2001/04/xmldsig-more#gostr34102001-gostr3411",
        digestMethod: "http://www.w3.org/2001/04/xmldsig-more#gostr3411"
      }
    } else if (algOid === IFCConst.OID_GOSTR3410_2012_512) {
      return {
        signMethod: "http://www.w3.org/2001/04/xmldsig-more#gostr34102001-gostr3411",
        digestMethod: "http://www.w3.org/2001/04/xmldsig-more#gostr3411"
      }
    } else if (algOid === IFCConst.OID_GOSTR3410_2001) {
      return {
        signMethod: "http://www.w3.org/2001/04/xmldsig-more#gostr34102001-gostr3411",
        digestMethod: "http://www.w3.org/2001/04/xmldsig-more#gostr3411"
      }
    } else {
      return {
        signMethod: "",
        digestMethod: ""
      }
    }
  };

  /**@public
   * @description Метод возвращает алгоритм подписи
   * */
  this.getSignAlg = function () {

    var algOid = this.getSignAlgOid();
    var algString;

    if (algOid === IFCConst.OID_GOSTR3410_2001) {
      algString = "gost_2001";
    } else if (algOid === IFCConst.OID_GOSTR3410_2012_256) {
      algString = "gost_2012_256";
    } else if (algOid === IFCConst.OID_GOSTR3410_2012_512) {
      algString = "gost_2012_512";
    } else {
      algString = "";
    }

    return algString;
  };

  /**@public
   * @description Метод возвращает oid алгоритма подписи
   * */
  this.getSignAlgOid = function () {
    return IFCConst.emptyString(info['cert_sign_alg']);
  };

  /**@public
   * @description Метод возвращает булево выражение: действителен ли сертификат на настоящий момент.
   * Проверка осуществляется сравнением текущего времени на ПК исполнения JavaScript-сценария
   * со значением IFCCertificate.getValidTo
   * */
  this.isValid = function () {
    var date = new Date();
    var validTo = new Date(this.getValidTo());

    return date < validTo;
  };

  /**@public
   * @description Метод возвращает идентификатор сертификата:
   * - для PKCS#11 - это атрибут CKA_ID;
   * - для CAPI - это параметр pszContainer.
   * */
  this.getId = function () {
    return IFCConst.emptyString(info['id']);
  };

  /**@public
   * @description Метод возвращает идентификатор контейнера (containerId), в котором содержится сертификат
   * */
  this.getContainerId = function () {
    return crypto.getCryptoId() + "/" + IFCConst.emptyString(info["id"]);
  };

  /**@public
   * @description Метод возвращает идентификатор СКЗИ (cryptoId), содержащего контейнер с сертификатом
   * */
  this.getCryptoId = function () {
    return crypto.getCryptoId();
  };

  /**@public
   * @description Метод возвращает булево выражение - получен ли сертификат через программный интерфейс PKCS#11
   * */
  this.isPKCS11 = function () {
    return crypto.isPKCS11();
  };

  /**@public
   * @description Метод возвращает булево выражение: получен ли сертификат через программный интерфейс CAPI
   * */
  this.isCAPI = function () {
    return crypto.isCAPI();
  };

  /**@public
   * @description Метод возвращает булево выражение: получен ли сертификат через программный интерфейс CAPI_LINUX
   * */
  this.isCAPI_LINUX = function () {
    return crypto.isCAPI_LINUX();
  };

  this.checkDate = function (date) {
    if (isNaN(new Date(date).getTime())) {
      return date.replace(/([a-z]*\s\d{1,2}\s)((?:\d{2}:?){3})\s(\d{4}\s)(.*)/i, '$1$3$2$4');
    }

    return date;
  }
}

/**
 * @class IFCCertificateInfo
 * @description Содержит подробную информацию о сертификате ЭП. Позволяет получить сертификат в форматах Base64 и PEM.
 */
function IFCCertificateInfo(info) {

  /**@public
   * @description Метод возвращает серийный номер сертификата
   * */
  this.getSerialNumber = function () {
    return IFCConst.emptyString(info['cert_sn']);
  };

  /**@public
   * @description Метод возвращает сведения о субъекте сертификата
   * */
  this.getSubjectDN = function () {
    return new IFCDN(IFCConst.emptyString(info['cert_subject']), IFCConst.DN_SEPARATOR_PLUGIN);
  };

  /**@public
   * @description Метод возвращает сведения об издателе сертификата
   * */
  this.getIssuerDN = function () {
    return new IFCDN(IFCConst.emptyString(info['cert_issuer']), IFCConst.DN_SEPARATOR_PLUGIN);
  };

  /**@public
   * @description Метод возвращает срок начала действия сертификата
   * */
  this.getValidFrom = function () {
    return IFCConst.emptyString(this.checkDate(info['cert_valid_from']));
  };

  /**@public
   * @description Метод возвращает срок окончания действия сертификата
   * */
  this.getValidTo = function () {
    return IFCConst.emptyString(this.checkDate(info['cert_valid_to']));
  };

  /**@public
   * @description Метод возвращает алгоритм подписи и хеширования в виде uri
   * */
  this.getSignAndDigestAlgUri = function () {

    var algOid = this.getSignAlgOid();

    if (algOid === IFCConst.OID_GOSTR3410_2012_256) {
      return {
        signMethod: "http://www.w3.org/2001/04/xmldsig-more#gostr34102001-gostr3411",
        digestMethod: "http://www.w3.org/2001/04/xmldsig-more#gostr3411"
      }
    } else if (algOid === IFCConst.OID_GOSTR3410_2012_512) {
      return {
        signMethod: "http://www.w3.org/2001/04/xmldsig-more#gostr34102001-gostr3411",
        digestMethod: "http://www.w3.org/2001/04/xmldsig-more#gostr3411"
      }
    } else if (algOid === IFCConst.OID_GOSTR3410_2001) {
      return {
        signMethod: "http://www.w3.org/2001/04/xmldsig-more#gostr34102001-gostr3411",
        digestMethod: "http://www.w3.org/2001/04/xmldsig-more#gostr3411"
      }
    } else {
      return {
        signMethod: "",
        digestMethod: ""
      }
    }
  };

  /**@public
   * @description Метод возвращает алгоритм подписи
   * */
  this.getSignAlg = function () {

    var algOid = this.getSignAlgOid();
    var algString;

    if (algOid === IFCConst.OID_GOSTR3410_2001) {
      algString = "gost_2001";
    } else if (algOid === IFCConst.OID_GOSTR3410_2012_256) {
      algString = "gost_2012_256";
    } else if (algOid === IFCConst.OID_GOSTR3410_2012_512) {
      algString = "gost_2012_512";
    } else {
      algString = "";
    }

    return algString;
  };

  /**@public
   * @description Метод возвращает oid алгоритма подписи
   * */
  this.getSignAlgOid = function () {
    return IFCConst.emptyString(info['cert_sign_alg']);
  };

  /**@public
   * @description Метод возвращает булево выражение: действителен ли сертификат на настоящий момент.
   * Проверка осуществляется сравнением текущего времени на ПК исполнения JavaScript-сценария
   * со значением IFCCertificate.getValidTo.
   * */
  this.isValid = function () {
    var date = new Date();
    var validTo = new Date(this.getValidTo());

    return date < validTo;
  };

  /**@public
   * @description Метод возвращает сертификат, кодированный в Base64
   * */
  this.getBase64 = function () {
    return IFCConst.emptyString(info['base64']);
  };

  /**@public
   * @description Метод возвращает сертификат, кодированный в формате PEM
   * */
  this.getPem = function () {
    return IFCConst.emptyString(info['pem']);
  };

  /**@public
   * @description Метод возвращает версию сертификата
   * */
  this.getVersion = function () {
    return IFCConst.emptyString(info['version']);
  };

  /**@public
   * @description Метод возвращает расширения сертификата в текстовом виде
   * */
  this.getExtensionsString = function () {
    return IFCConst.emptyString(info['extensions']);
  };

  /**@public
   * @description Возвращает сертификат ЭП в виде текста.
   * @returns {String} Строка, содержащая текстовое представление сертификата (переносы строк и символы табуляции).
   * */
  this.getPrintableText = function () {
    return this.getPrintable("\n", "\t", ", ");
  };

  /**@public
   * @description Возвращает сертификат ЭП в виде текста с html-разметкой.
   * @returns {String} Строка, содержащая текстовое представление сертификата (br и nbsp).
   * */
  this.getPrintableHTML = function () {
    return this.getPrintable("<br />", "&nbsp;&nbsp;", ", ");
  };

  /**@private*/
  this.getPrintable = function (cr, tab, sep) {
    if (!cr) {
      cr = "\n";
    }

    if (!tab) {
      tab = "\t";
    }

    if (!sep) {
      sep = ", ";
    }

    var certPrintable = "Номер квалифицированного сертификата: " + this.getSerialNumber() + cr +
      "Действие квалифицированного сертификата:" + cr +
      tab + tab + "с " + this.getValidFrom() + cr +
      tab + tab + "по " + this.getValidTo() + cr +
      cr +
      tab + "Сведения о владельце квалифицированного сертификата" + cr +
      cr +
      "Фамилия, имя, отчество: " + this.getSubjectDN().getCommonName() + cr +
      "Страховой номер индивидуального лицевого счета: " + this.getSubjectDN().getSNILS() + cr +
      cr +
      tab + "Сведения об издателе квалифицированного сертификата" + cr +
      cr +
      "Наименование  удостоверяющего  центра: " + this.getIssuerDN().getCommonName() + cr +
      "Место  нахождения  удостоверяющего центра: " + this.getIssuerDN().getCountryName() + sep +
      this.getIssuerDN().getStateOrProvinceName() + sep + this.getIssuerDN().getLocalityName() + sep +
      this.getIssuerDN().getStreetAddress() + cr;

    // Optional information in issuerDN
    if (this.getIssuerDN().getSurname()) {
      certPrintable += "Доверенное лицо удостоверяющего центра: " + this.getIssuerDN().getSurname();
    } else if (this.getIssuerDN().getGivenName()) {
      certPrintable += sep + this.getIssuerDN().getGivenName() + cr;
    } else {
      certPrintable += cr;
    }

    //TODO Extensions has to be parsed as other elements
    certPrintable += tab + "Расширения сертификата" + cr + cr +
      this.getExtensionsString().replace(/(\r\n|\n|\r)/gm, cr).replace(/^\s+/mg, tab);

    return certPrintable;
  };

  this.checkDate = function (date) {
    if (isNaN(new Date(date).getTime())) {
      return date.replace(/([a-z]*\s\d{1,2}\s)((?:\d{2}:?){3})\s(\d{4}\s)(.*)/i, '$1$3$2$4');
    }

    return date;
  }
}

/**
 * @class IFCDN
 * @description Содержит подробную информацию о субъекте и издателе сертификата ЭП: позволяет получить доступ
 * к данным уникального имени субъекта и издателя (DN — англ. Distinguished Name).
 *
 */
function IFCDN(dnString, dnSeparator) {
  /**@private*/
  var getNumericOid = function (oid) {
    switch (oid.toLowerCase()) {
      case "commonname":
      case "cn":
        return IFCConst.OID_COMMON_NAME;
      case "surname":
        return IFCConst.OID_SURNAME;
      case "givenname":
        return IFCConst.OID_GIVEN_NAME;
      case "countryname":
      case "c":
        return IFCConst.OID_COUNTRY_NAME;
      case "stateorprovincename":
        return IFCConst.OID_STATE_OR_PROVINCE_NAME;
      case "localityname":
      case "l":
        return IFCConst.OID_LOCALITY_NAME;
      case "streetaddress":
      case "street":
        return IFCConst.OID_STREET_ADDRESS;
      case "organizationname":
      case "o":
        return IFCConst.OID_ORGANIZATION_NAME;
      case "organizationunitname":
      case "ou":
        return IFCConst.OID_ORGANIZATION_UNIT_NAME;
      case "title":
        return IFCConst.OID_TITLE;
      case "emailaddress":
      case "email":
        return IFCConst.OID_EMAIL_ADDRESS;
      case "ogrn":
        return IFCConst.OID_OGRN;
      case "snils":
        return IFCConst.OID_SNILS;
      case "inn":
        return IFCConst.OID_INN;
      default:
        return oid;
    }
  };

  var dnArray = dnString.split("\\,").join("[escaped_comma]").split(dnSeparator);
  this.dnData = new Object();

  for (var i = 0; i < dnArray.length; i++) {
    var oidValue = dnArray[i].split("=");

    if (oidValue[1] == null) {
      oidValue[1] = "";
    }

    var oid = oidValue[0].trim();
    var value = oidValue[1].trim().split("[escaped_comma]").join(",");

    this.dnData[getNumericOid(oid)] = value;
  }

  /**@public
   * @description Метод возвращает значение OID "commonName": наименование субъекта (ФИО или наименование организации)
   * */
  this.getCommonName = function () {
    return IFCConst.emptyString(this.dnData[IFCConst.OID_COMMON_NAME]);
  };

  /**@public
   * @description Метод возвращает значение OID "surname": фамилия
   * */
  this.getSurname = function () {
    return IFCConst.emptyString(this.dnData[IFCConst.OID_SURNAME]);
  };

  /**@public
   * @description Метод возвращает значение OID "givenName": имя и отчество
   * */
  this.getGivenName = function () {
    return IFCConst.emptyString(this.dnData[IFCConst.OID_GIVEN_NAME]);
  };

  /**@public
   * @description Метод возвращает значение OID "countryName": страна
   * */
  this.getCountryName = function () {
    return IFCConst.emptyString(this.dnData[IFCConst.OID_COUNTRY_NAME]);
  };

  /**@public
   * @description Метод возвращает значение OID "stateOrProvinceName": регион
   * */
  this.getStateOrProvinceName = function () {
    return IFCConst.emptyString(this.dnData[IFCConst.OID_STATE_OR_PROVINCE_NAME]);
  };

  /**@public
   * @description Метод возвращает значение OID "localityName": наименование населенного пункта
   * */
  this.getLocalityName = function () {
    return IFCConst.emptyString(this.dnData[IFCConst.OID_LOCALITY_NAME]);
  };

  /**@public
   * @description Метод возвращает значение OID "streetAddress": адрес
   * */
  this.getStreetAddress = function () {
    return IFCConst.emptyString(this.dnData[IFCConst.OID_STREET_ADDRESS]);
  };

  /**@public
   * @description Метод возвращает значение OID "organizationName": наименование организации
   * */
  this.getOrganizationName = function () {
    return IFCConst.emptyString(this.dnData[IFCConst.OID_ORGANIZATION_NAME]);
  };

  /**@public
   * @description Метод возвращает значение OID "organizationUnitName": наименование подразделения организации
   * */
  this.getOrganizationUnitName = function () {
    return IFCConst.emptyString(this.dnData[IFCConst.OID_ORGANIZATION_UNIT_NAME]);
  };

  /**@public
   * @description Метод возвращает значение OID "Title": должность
   * */
  this.getTitle = function () {
    return IFCConst.emptyString(this.dnData[IFCConst.OID_TITLE]);
  };

  /**@public
   * @description Метод возвращает значение OID "emailAddress": адрес электронной почты
   * */
  this.getEmailAddress = function () {
    return IFCConst.emptyString(this.dnData[IFCConst.OID_EMAIL_ADDRESS]);
  };

  /**@public
   * @description Метод возвращает значение OID "OGRN": ОГРН
   * */
  this.getOGRN = function () {
    return IFCConst.emptyString(this.dnData[IFCConst.OID_OGRN]);
  };

  /**@public
   * @description Метод возвращает значение OID "SNILS": СНИЛС
   * */
  this.getSNILS = function () {
    return IFCConst.emptyString(this.dnData[IFCConst.OID_SNILS]);
  };

  /**@public
   * @description Метод возвращает значение OID "INN": ИНН
   * */
  this.getINN = function () {
    return IFCConst.emptyString(this.dnData[IFCConst.OID_INN]);
  };


  /**@public
   * @description Метод возвращает значение произвольного OID из объекта IFCDN
   * */
  this.getValueByOid = function (oid) {
    return IFCConst.emptyString(this.dnData[getNumericOid(oid)]);
  };

  /**@private*/
  this.getSubjectArray = function () {
    //var dnArray = new Array();
    var dnArray = new Object();

    var oidsCount = 0;

    for (var dnKey in this.dnData) {
      oidsCount++;

      //dnArray.push({"oid": dnKey, "oid_type": IFCConst.getDNDataType(dnKey), "value": this.dnData[dnKey]});

      dnArray["oid_" + oidsCount] = dnKey;
      dnArray["oid_type_" + oidsCount] = IFCConst.getDNDataType(dnKey);
      dnArray["value_" + oidsCount] = this.dnData[dnKey];
    }

    dnArray["oids_count"] = oidsCount;

    return dnArray;
  };

  /**@public
   * @description Метод возвращает данные объекта IFCDN (Distinguished Name - отличительное имя) одной строкой
   * */
  this.getOneLine = function () {
    var Line = "";

    if (this.getCountryName())
      Line += "c=" + this.getCountryName() + ", ";

    if (this.getStateOrProvinceName())
      Line += "stateorprovincename=" + this.getStateOrProvinceName() + ", ";

    if (this.getLocalityName())
      Line += "l=" + this.getLocalityName() + ", ";

    if (this.getCommonName())
      Line += "cn=" + this.getCommonName() + ", ";

    if (this.getSurname())
      Line += "surname=" + this.getSurname() + ", ";

    if (this.getGivenName())
      Line += "givenname=" + this.getGivenName() + ", ";

    if (this.getStreetAddress())
      Line += "street=" + this.getStreetAddress() + ", ";

    if (this.getOrganizationName())
      Line += "o=" + this.getOrganizationName() + ", ";

    if (this.getOrganizationUnitName())
      Line += "ou=" + this.getOrganizationUnitName() + ", ";

    if (this.getTitle())
      Line += "title=" + this.getTitle() + ", ";

    if (this.getEmailAddress())
      Line += "email=" + this.getEmailAddress() + ", ";

    if (this.getOGRN())
      Line += "ogrn=" + this.getOGRN() + ", ";

    if (this.getSNILS())
      Line += "snils=" + this.getSNILS() + ", ";

    if (this.getINN())
      Line += "inn=" + this.getINN() + ", ";

    Line = Line.substring(0, Line.length - 2);
    return Line;
  }

}

/**
 * @class IFCCertificateRequest
 * @description Содержит значение запроса на выпуск сертификата (CSR).
 */
function IFCCertificateRequest(containerId, csr) {

  /**@public
   * @description Метод возвращает идентификатор контейнера, в котором содержится ключевая пара,
   * для которой создан CSR.
   * */
  this.getContainerId = function () {
    return containerId;
  };

  /**@public
   * @description Метод возвращает запрос на выпуск сертификата, кодированный в Base64
   * */
  this.getCsr = function () {
    return csr;
  }
}

/**
 * @class IFCEncrypted
 * @description Объект содержит криптотекст, зашифрованный сессионный ключ, сертификат отправителя.
 */
function IFCEncrypted(encryptedData, encryptedKey, certificate) {

  /**@public
   * @description Метод возвращает зашифрованные данные, кодированные в Base64
   * */
  this.getData = function () {
    return encryptedData;
  };

  /**@public
   * @description Метод возвращает зашифрованный сессионный ключ, кодированный в Base64
   * */
  this.getKey = function () {
    return encryptedKey;
  };

  /**@public
   * @description Метод возвращает сертификат отправителя зашифрованного сообщения, кодированный в Base64
   * */
  this.getCertificate = function () {
    return certificate;
  }
}

/**
 * @class IFCHash
 * @description Содержит вычисленное значение хеш-функции
 */
function IFCHash(hashBase64) {

  /**@public
   * @description Метод возвращает значение хеш-функции, кодированное в Base64
   * */
  this.getBase64 = function () {
    return hashBase64;
  };

  /**@public
   * @description Метод возвращает значение хеш-функции, декодированное из Base64
   * В формате "0xFF0xFF0xFF". Прямой порядок байт
   * */
  this.getHexBinary = function () {
    return binStringToHex(decodeBase64(hashBase64));
  };

  /**@public
   * @description Метод возвращает значение хеш-функции, декодированное из Base64. Прямой порядок байт
   * */
  this.getPlainData = function () {
    return decodeBase64(hashBase64);
  };

  // private methods

  /**@private*/
  var decodeBase64 = function (s) {
    var e = {}, i, k, v = [], r = '', w = String.fromCharCode;
    var n = [
      [65, 91],
      [97, 123],
      [48, 58],
      [43, 44],
      [47, 48]
    ];

    for (let z in n) {
      for (i = n[z][0]; i < n[z][1]; i++) {
        v.push(w(i));
      }
    }
    for (i = 0; i < 64; i++) {
      e[v[i]] = i;
    }

    for (i = 0; i < s.length; i += 72) {
      var b = 0, c, x, l = 0, o = s.substring(i, i + 72);
      for (x = 0; x < o.length; x++) {
        c = e[o.charAt(x)];
        b = (b << 6) + c;
        l += 6;
        while (l >= 8) {
          r += w((b >>> (l -= 8)) % 256);
        }
      }
    }
    return r;
  };

  /**@private*/
  var binStringToHex = function (s) {
    var s2 = [], c;
    var result = "";
    for (var i = 0, l = s.length; i < l; ++i) {
      c = s.charCodeAt(i);
      s2.push(
        (c >> 4).toString(16),
        (c & 0xF).toString(16));
    }
    String.prototype.concat.apply('', s2);

    for (var i = 0; i < s2.length; i++) {
      result += s2[i];
    }

    return result;
  }
  // end of private methods
}

/**
 * @class IFCConst
 * @description Содержит константы конфигурации для вызова функций плагина.
 * @private
 */
var IFCConst = {
  // Input data types
  IFC_DATATYPE_DATA: 1,
  IFC_DATATYPE_DATA_BASE64: 2,
  IFC_DATATYPE_HASH: 3,
  IFC_DATATYPE_HASH_BASE64: 4,
  IFC_DATATYPE_FILENAME: 5,

  // CryptoAPI Definitions
  IFC_CRYPTO_PKCS11: "pkcs11",
  IFC_CRYPTO_CAPI: "capi",
  IFC_CRYPTO_CAPI_LINUX: "capi_linux",


  // SubjectDN OID definitions
  OID_COMMON_NAME: "2.5.4.3",
  OID_SURNAME: "2.5.4.4",
  OID_GIVEN_NAME: "2.5.4.42",
  OID_COUNTRY_NAME: "2.5.4.6",
  OID_STATE_OR_PROVINCE_NAME: "2.5.4.8",
  OID_LOCALITY_NAME: "2.5.4.7",
  OID_STREET_ADDRESS: "2.5.4.9",
  OID_ORGANIZATION_NAME: "2.5.4.10",
  OID_ORGANIZATION_UNIT_NAME: "2.5.4.11",
  OID_TITLE: "2.5.4.12",
  OID_EMAIL_ADDRESS: "1.2.840.113549.1.9.1",

  // Russian custom SubjectDN OID definitions
  OID_OGRN: "1.2.643.100.1",
  OID_SNILS: "1.2.643.100.3",
  OID_INN: "1.2.643.3.131.1.1",

  // Certificate Policies OID definitions
  OID_KC1: "1.2.643.100.113.1",
  OID_KC2: "1.2.643.100.113.2",
  OID_KC3: "1.2.643.100.113.3",

  // Signature Algorithm OID definitions
  OID_GOSTR3410_2001: "1.2.643.2.2.19",
  OID_GOSTR3410_2012_256: "1.2.643.7.1.1.1.1",
  OID_GOSTR3410_2012_512: "1.2.643.7.1.1.1.2",

  // DN definitions
  DN_SEPARATOR_PLUGIN: "\n",
  DN_SEPARATOR_INPUT: ",",

  // Certificate retrieval types
  IFC_CERT_LOAD_FROM_CONTAINER: 1,
  IFC_CERT_LOAD_FROM_FILE: 2,
  IFC_CERT_LOAD_FROM_STRING: 3,

  // Signature types
  IFC_SIGNTYPE_SIMPLE: 1,
  IFC_SIGNTYPE_SIMPLE_REVERSE: 2,
  IFC_SIGNTYPE_CMS_ATTACHED: 3,
  IFC_SIGNTYPE_CMS_DETACHED: 4,
  IFC_SIGNTYPE_CADES_BES_ATTACHED: 5,
  IFC_SIGNTYPE_CADES_BES_DETACHED: 6,

  // Hashing type for PKCS#11
  IFC_HARDWARE_HASH: 1,
  IFC_SOFTWARE_HASH: 2,

  // Output format
  IFC_BASE64: 1,
  IFC_RAW: 0,

  //Show or hide ui csp during signing
  IFC_SHOW_CSP_UI: 1,
  IFC_HIDE_CSP_UI: 0,

  // Certificate info types
  IFC_X509_INFO_CERT_BASE64ENCODED: 1,
  IFC_X509_INFO_CERT_DER: 2,
  IFC_X509_INFO_CERT_VERSION: 3,
  IFC_X509_INFO_CERT_SERIALNUMBER: 4,
  IFC_X509_INFO_CERT_SUBJECT: 5,
  IFC_X509_INFO_CERT_ISSUER: 6,
  IFC_X509_INFO_CERT_VALIDFROM: 7,
  IFC_X509_INFO_CERT_VALIDTO: 8,
  IFC_X509_INFO_CERT_X509EXTENSIONS: 9,
  IFC_X509_INFO_CERT_PEM: 10,
  IFC_X509_INFO_CERT_ALG: 11,

  // Certificate data types
  IFC_CERT_UNKNOWN: 0,
  IFC_CERT_DER: 1,
  IFC_CERT_BASE64: 2,
  IFC_CERT_PEM: 3,

  // Certificare Request types
  IFC_REQ_DER: 0,
  IFC_REQ_PEM: 1,
  IFC_REQ_BASE64ENCODED: 2,

  // P11 PIN Types
  P11_PIN_TYPE_USER: 0,
  P11_PIN_TYPE_ADMIN: 1,

  // ASN.1 Object types
  IFC_PRINTABLE_STRING: 19,
  IFC_IA5STRING: 22,
  IFC_NUMERICSTRING: 18,
  IFC_UTF8STRING: 12,
  IFC_OCTET_STRING: 4,
  IFC_BMPSTRING: 30,

  // APDU input formats
  APDU_FORMAT_RAW: 0,
  APDU_FORMAT_TEXT: 1,

  // Visualization methods
  SHOW_SAFETOUCH: 0,

  /**@private*/
  getDNDataType: function (oidName) {
    var dataTypeValue;

    switch (oidName) {
      case this.OID_COUNTRY_NAME:
        dataTypeValue = this.IFC_PRINTABLE_STRING;
        break;
      case this.OID_SNILS:
      case this.OID_OGRN:
      case this.OID_INN:
        dataTypeValue = this.IFC_NUMERICSTRING;
        break;
      case this.OID_EMAIL_ADDRESS:
        dataTypeValue = this.IFC_IA5STRING;
        break;
      default:
        dataTypeValue = IFCConst.IFC_UTF8STRING;
        break;
    }

    return dataTypeValue;
  },

  /**@private*/
  emptyString: function (str) {
    if (str === undefined || str === null) {
      return "";
    }

    return str;
  }
};

/**
 * @class IFCError
 * @description Содержит константы кодов ошибок, возвращаемых плагином и библиотекой.
 */
export const IFCError = {
  // Plugin Errors
  IFC_GENERAL_ERROR: -1,
  IFC_OK: 0x0000,
  IFC_ERROR_UNKNOWN: 0x0001,
  IFC_ERROR_CONFIG: 0x0002,
  IFC_ERROR_RECORD_MAX: 0x0003,
  IFC_ERROR_CONFIG_EMPTY: 0x0004,
  IFC_BAD_PARAMS: 0x0005,
  IFC_ERROR_MALLOC: 0x0006,
  IFC_ALIAS_NOT_FOUND: 0x0007,
  IFC_ERROR_STORE: 0x0008,
  IFC_CERT_NOT_FOUND: 0x0009,
  IFC_CONTAINER_NOT_FOUND: 0x000A,
  IFC_UNSUPPORTED_FORMAT: 0x000B,
  IFC_KEY_NOT_FOUND: 0x000C,
  IFC_BAD_IN_TYPE: 0x000D,
  IFC_BAD_SIGN_TYPE: 0x000E,
  IFC_BAD_HASH_CONTEXT: 0x000F,
  IFC_BAD_TYPE_PIN: 0x0010,
  IFC_NOT_SUPPORTED: 0x0011,
  IFC_SLOT_NOT_INIT: 0x0012,
  IFC_ERROR_VERIFY: 0x0013,
  IFC_ERROR_BASE64: 0x0014,
  IFC_SC_ERROR: 0x0015,
  IFC_ENGINE_ERROR: 0x0016,
  IFC_P11_ERROR: 0x0017,
  IFC_P11_NO_TOKENS_FOUND: 0x0019,
  IFC_PARSE_XML_ERROR: 0x001A,
  IFC_XPATH_ERROR: 0x001B,
  IFC_CANON_XML_ERROR: 0x001C,
  IFC_P11_LOGIN_ERROR: 0x00A0, // Equals to CKR_PIN_INCORRECT
  IFC_UNICODE_ERROR: 0x00A1,
  IFC_ENCODINGS_ERROR: 0x00A2,
  IFC_INIT_ERROR: 0x00A3,
  IFC_CRYPTO_NOT_FOUND: 0x00A4,

  // Library errors
  IFC_PLUGIN_UNDEFINED_ERROR: 0x0100,
  IFC_P11_INVALID_PIN_ERROR: 0x0101,

  getErrorDescription: function (error_code) {
    switch (error_code) {
      // Plugin errors
      case IFCError.IFC_GENERAL_ERROR:
        return "Общая ошибка";
      case IFCError.IFC_OK:
        return "Операция завершена успешно";
      case IFCError.IFC_ERROR_UNKNOWN:
        return "Ошибка не определена";
      case IFCError.IFC_ERROR_CONFIG:
        return "Ошибка конфигурации";
      case IFCError.IFC_ERROR_RECORD_MAX:
        return "Достигнуто максимальное количество записей конфигурации";
      case IFCError.IFC_ERROR_CONFIG_EMPTY:
        return "Конфигурация не опеределена";
      case IFCError.IFC_BAD_PARAMS:
        return "Параметры заданы неверно";
      case IFCError.IFC_ERROR_MALLOC:
        return "Ошибка выделения памяти";
      case IFCError.IFC_ALIAS_NOT_FOUND:
        return "Указанный поставщик криптографии не найден";
      case IFCError.IFC_ERROR_STORE:
        return "Ошибка работы с хранилищем";
      case IFCError.IFC_CERT_NOT_FOUND:
        return "Сертификат не найден";
      case IFCError.IFC_CONTAINER_NOT_FOUND:
        return "Ключевой контейнер не найден";
      case IFCError.IFC_UNSUPPORTED_FORMAT:
        return "Формат не поддерживается";
      case IFCError.IFC_KEY_NOT_FOUND:
        return "Ключ не найден";
      case IFCError.IFC_BAD_IN_TYPE:
        return "Тип входных данных задан неверно";
      case IFCError.IFC_BAD_SIGN_TYPE:
        return "Тип электронной подписи задан неверно";
      case IFCError.IFC_BAD_HASH_CONTEXT:
        return "Контекст хеширования не найден";
      case IFCError.IFC_BAD_TYPE_PIN:
        return "Тип пин-кода задан неверно";
      case IFCError.IFC_NOT_SUPPORTED:
        return "Операция не поддерживается";
      case IFCError.IFC_SLOT_NOT_INIT:
        return "Слот не инициализирован";
      case IFCError.IFC_ERROR_VERIFY:
        return "Ошибка проверки подписи";
      case IFCError.IFC_ERROR_BASE64:
        return "Ошибка кодировки BASE64";
      case IFCError.IFC_SC_ERROR:
        return "Ошибка подсистемы смарт-карт";
      case IFCError.IFC_ENGINE_ERROR:
        return "Ошибка работы с библиотеки интерфейса";
      case IFCError.IFC_P11_ERROR:
        return "Ошибка работы с библиотекой PKCS#11";
      case IFCError.IFC_P11_NO_TOKENS_FOUND:
        return "Смарт-карта не найдена";
      case IFCError.IFC_PARSE_XML_ERROR:
        return "Ошибка парсинга XML";
      case IFCError.IFC_XPATH_ERROR:
        return "Ошибка выполнения XPath";
      case IFCError.IFC_CANON_XML_ERROR:
        return "Ошибка канонизации XML";
      case IFCError.IFC_P11_LOGIN_ERROR:
        return "Неверный пин-код";
      case IFCError.IFC_UNICODE_ERROR:
        return "Ошибка работы с UNICODE";
      case IFCError.IFC_ENCODINGS_ERROR:
        return "Ошибка кодировки";
      case IFCError.IFC_INIT_ERROR:
        return "Ошибка инициализации плагина";
      case IFCError.IFC_CRYPTO_NOT_FOUND:
        return "СКЗИ не найдено";

      // Library errors
      case IFCError.IFC_PLUGIN_UNDEFINED_ERROR:
        return "Ошибка инициализации объекта плагина";
      case IFCError.IFC_P11_INVALID_PIN_ERROR:
        return "Пин-код не соответствует требованиям";



      // default
      default:
        return "Неизвестная ошибка";
    }
  }
};

// trim fix

/** trim fix
 * @private */
if (typeof String.prototype.trim !== 'function') {
  /**@private*/
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
  }
}

/**
 * @class IFCPlugin
 * @description Объект для работы с IFC плагином. Содержит методы для доступа к криптографическим и сервисным функциям Плагина.
 * @param pluginObject Объект плагина (Устаревший параметр)
 * @param inGoogleChrome {Boolean} Признак запуска в браузере Google Chrome (Устаревший параметр)
 * @param testFunctionsEnabled {Boolean} Признак активации тестовых функций
 */
export function IFCPlugin(pluginObject, inGoogleChrome, testFunctionsEnabled) {

  if (typeof pluginObject === typeof true) {
    testFunctionsEnabled = pluginObject;
  }

  // Версия библиотеки
  /**@private*/
  var libVersion = "2.2.1";

  // Префикс для GUID
  /**@private*/
  var guidPrefix = "";

  // Коннектор для общения с плагином
  /**@private*/
  var connector = null;

  // Статус библиотеки
  /**@public*/
  this.status = null;

  // Схема с помошью которой можно окрыть расширение для safari
  /**@public*/
  this.safariExtensionScheme = "safariExtension://";


  ///////////////////////////////////////////////
  // Метод для работы с событиями в библиотеке
  ///////////////////////////////////////////////

  /**@private
   * @description Метод для подписи на событие из библиотеки
   * */
  this.listenPluginEvent = function (eventName, callback) {
    if (document.addEventListener) {
      document.addEventListener(eventName, callback, false);
    } else {
      document.documentElement.attachEvent('onpropertychange', function (e) {
        if (e.propertyName === eventName) {
          callback();
        }
      });
    }
  };

  /**@private
   * @description Метод для генерации события
   * */
  function triggerPluginEvent(eventName) {
    if (document.createEvent) {
      var event = document.createEvent('Event');
      event.initEvent(eventName, true, true);
      document.dispatchEvent(event);
    } else {
      document.documentElement[eventName]++;
    }
  }


  ///////////////////////////////////////////////
  // Коннектор для NPAPI
  ///////////////////////////////////////////////

  /**
   * @class IFCNPAPIConnector
   * @description Объект для отправки и получения сообщений плагину NPAPI Плагину IFC.
   */
  function IFCNPAPIConnector() {

    /**@private*/
    document.body.innerHTML += '<object id="NPIFCPlugin" type="application/x-ifcplugin" width="1" height="1"></object>';
    var NPAPIPluginObject = document.getElementById("NPIFCPlugin");

    /**
     * @description Отправляет запрос плагину.
     * */
    this.send = function (msg, callback) {
      try {
        NPAPIPluginObject.post_message(JSON.stringify(msg), function (plugin, rep_msg) {
          callback(JSON.parse(rep_msg));
        });
      } catch (e) {
        callback({"error_code": IFCError.IFC_PLUGIN_UNDEFINED_ERROR});
      }
    }
  }


  ///////////////////////////////////////////////
  // Коннектор для Native Messaging
  ///////////////////////////////////////////////

  /**
   * @class IFCNativeMessagingConnector
   * @description Объект для отправки и получения сообщений Goolgle Chrome расширению IFC.
   */
  function IFCNativeMessagingConnector() {
    // Сохраняем окно, через которое будем общаться с расширением
    /**@private*/
    var WND = window;

    // Текущий пользовательский callback
    /**@private*/
    var currentUserCallback = false;

    /**@private*/
    var connected = false;

    /**@private
     * @description Отправляет запрос плагину.
     * */
    function sendToExtension(msg, callback) {
      currentUserCallback = callback;
      try {
        WND.postMessage(JSON.stringify({type: "TO_IFC_EXT", msg_data: msg}), "*");
      } catch (e) {
        currentUserCallback = false;
        callback({"error_code": IFCError.IFC_PLUGIN_UNDEFINED_ERROR});
      }
    }

    /**@private
     * @description Получает ответ от плагина и передает его пользовательскому callback'у.
     * */
    function recvFromExtension(msg) {
      if (msg.intermediate) {
        currentUserCallback(msg);
      } else {
        if (currentUserCallback) {
          var currentCallback = currentUserCallback;
          currentUserCallback = false;

          currentCallback(msg);
        }
      }
    }

    /**@private
     * @description Обработчик разрыва соединения с расширением.
     * */
    function disconnectFromExtension() {
      if (currentUserCallback) {
        var currentCallback = currentUserCallback;
        currentUserCallback = false;

        currentCallback({"error_code": IFCError.IFC_PLUGIN_UNDEFINED_ERROR});
      }
      connected = false;
    }

    /**@private
     * @description Обрабатывает сообщения от плагина.
     * */
    function IFCMessageHandler(event) {
      // Принимаем сообщения только от себя
      if (event.source !== WND)
        return;

      try {
        var event_data = JSON.parse(event.data);
        if (event_data.type && (event_data.type === "FROM_IFC_EXT")) {
          recvFromExtension(event_data.msg_data);
        } else if (event_data.type && (event_data.type === "IFC_EXT_DISCONNECT")) {
          disconnectFromExtension();
        }
      } catch (e) {
        //Пропускаем невалидные сообщения
      }
    }

    /**@private
     * @description Устанавливает соединение с плагином.
     * */
    function connectToIFC() {
      if (connected)
        return IFCError.IFC_OK;

      try {
        WND.addEventListener("message", IFCMessageHandler, false);
      } catch (e) {
        return IFCError.IFC_PLUGIN_UNDEFINED_ERROR;
      }

      connected = true;
      return IFCError.IFC_OK;
    }

    /**@private
     * @description Отправляет запрос плагину.
     * */
    this.send = function (msg, callback) {
      // Что-то пошло не так!
      // Библиотека асинхронная, но однопоточная - параллельные запросы ЗАПРЕЩЕНЫ!
      if (currentUserCallback) {
        callback({"error_code": IFCError.IFC_GENERAL_ERROR});
        return;
      }
      // Подключаемся к расширению, если этого еще не сделали
      var rc = connectToIFC();
      if (rc !== IFCError.IFC_OK) {
        callback({"error_code": rc});
        return;
      }

      // Отправляем запрос
      sendToExtension(msg, callback);
    }
  }

  // Метод для определения версии safari
  /**@private*/
  function isNewSafari() {
    var ua = navigator.userAgent;

    if ((ua.search('Safari') !== -1) && (ua.search('Version') !== -1)) {
      var pos = ua.indexOf("Version") + 8;
      var startStr = ua.substr(pos);
      if (startStr) {
        var endPos = pos + startStr.indexOf(".");
        var version = startStr ? parseInt(ua.substring(pos, endPos), 10) : 0;
        if (version >= 12) {
          return true;
        }
      }
    }
    return false;
  }

  // Метод для выбора коннектора
  /**@private*/
  function isNativeMessaging() {
    var ua = navigator.userAgent;

    var includeArr = ['Firefox', 'Chrome', 'Opera', 'Edge', 'YaBrowser', 'Safari'];

    for (var i = 0; i < includeArr.length; i++) {
      if ((ua.search(includeArr[i]) !== -1) && (includeArr[i] === 'Firefox')) {
        var fPos = ua.indexOf(includeArr[i]) + 8;
        var fStartStr = ua.substr(fPos);
        if (fStartStr) {
          var fEndPos = fPos + fStartStr.indexOf(".");
          var fVersion = fStartStr ? parseInt(ua.substring(fPos, fEndPos), 10) : 0;
          if (fVersion >= 50) {
            return true;
          }
        }
        break;
      } else if ((ua.search(includeArr[i]) !== -1) && (includeArr[i] === 'Safari') && (ua.search('Version') !== -1)) {
        var sPos = ua.indexOf("Version") + 8;
        var sStartStr = ua.substr(sPos);
        if (sStartStr) {
          var sEndPos = sPos + sStartStr.indexOf(".");
          var sVersion = sStartStr ? parseInt(ua.substring(sPos, sEndPos), 10) : 0;
          if (sVersion >= 12) {
            return true;
          }
        }
        break;
      }
      if (ua.search(includeArr[i]) !== -1) {
        return true;
      }
    }
    return false;
  }

  // Создает соединение с плагином
  if (isNativeMessaging())
    connector = new IFCNativeMessagingConnector();
  else
    connector = new IFCNPAPIConnector();


  ///////////////////////////////////////////////
  // Приватные методы и параметры библиотеки
  ///////////////////////////////////////////////

  /**@private
   * @description Возвращает перечень СКЗИ заданного типа, доступных для плагина, в виде массива объектов IFCCrypto.
   * */
  function getCryptoListByType(cryptoType, callback) {
    connector.send({func_name: "get_list_info", params: {"cryptoType": cryptoType}}, function (msg) {
      if (IFCError.IFC_OK !== msg.error_code) {
        callback(msg);
        return;
      }

      var ifc_list = [];
      for (var i = 0; i < msg.ifc_list.length; i++) {
        if (msg.ifc_list[i]['type'] === cryptoType || cryptoType == null) {
          ifc_list.push(new IFCCrypto(msg.ifc_list[i]));
        }
      }
      callback({"error_code": IFCError.IFC_OK, "ifc_list": ifc_list});
    });
  }

  /**@private
   * @description Возвращает перечень СКЗИ, доступных для плагина, в виде массива объектов IFCCrypto.
   * */
  function getCryptoList(callback) {
    return getCryptoListByType(null, callback);
  }

  /**@private
   * @description Возвращает информацию о СКЗИ (объект IFCCrypto), по переданному на вход cryptoId.
   * */
  function getCryptoById(cryptoId, callback) {
    getCryptoList(function (msg) {
      if (IFCError.IFC_OK !== msg.error_code) {
        callback(msg);
        return;
      }

      for (var i = 0; i < msg.ifc_list.length; i++) {
        if (cryptoId === msg.ifc_list[i].getCryptoId()) {
          callback({"error_code": IFCError.IFC_OK, "crypto": msg.ifc_list[i]});
          return;
        }
      }
      callback({"error_code": IFCError.IFC_CRYPTO_NOT_FOUND, "crypto": crypto});
    });
  }

  /**@private
   * @description Получение идентификатора криптоустройства по ContainerId.
   * */
  function getCryptoIdByContainerId(containerId) {
    if (!containerId)
      return "";
    var cryptoProvlist = ["CryptoPro", "VIPNet", "SignalCom", "LISSI-CSP"];

    for (var i = 0; i < cryptoProvlist.length; i++) {
      if (containerId.indexOf(cryptoProvlist[i]) >= 0) return containerId.substring(0, containerId.indexOf("/"));
    }

    return containerId.substring(0, containerId.lastIndexOf("/"));
  }

  /**@private*/
  function sign(containerId, userPin, data, ifcDataType, ifcSignType, callback, cspUI) {
    getCryptoById(getCryptoIdByContainerId(containerId), function (msg) {
      if (IFCError.IFC_OK !== msg.error_code) {
        callback(msg);
        return;
      }

      if (typeof cspUI === "undefined") {
        cspUI = IFCConst.IFC_SHOW_CSP_UI;
      }

      //hashType больше не используется в плагине начиная с версии 3.1н.0, оставлен для совместимости
      connector.send({
          func_name: "sign",
          params: {
            "containerId": containerId,
            "userPin": userPin ? userPin : '',
            "inDataType": ifcDataType,
            "data": data,
            "hashType": IFCConst.IFC_HARDWARE_HASH,
            "signType": ifcSignType,
            "cspUI": cspUI,
            "outDataType": IFCConst.IFC_BASE64
          }
        },
        callback);
    });
  }

  /**@private*/
  function verify(containerId, sign, signType, data, dataType, peerCertificate, callback) {
    if (peerCertificate) {
      getCertificateHandleFromString(peerCertificate, function (msg) {
        if (IFCError.IFC_OK !== msg.error_code) {
          callback(msg);
          return;
        }

        var x509Handle = msg.x509Handle;
        connector.send({
            func_name: "verify",
            params: {
              "containerId": containerId,
              "inDataType": dataType,
              "data": data,
              "signType": signType,
              "sign": sign,
              "x509Handle": x509Handle
            }
          },
          function (msg) {
            var err_code = msg.error_code;
            var verify_result;
            if (IFCError.IFC_OK === msg.error_code) {
              verify_result = msg.verify_result;
            }

            // Free certificate
            freeCertificateHandle(x509Handle, function (msg) {
              if (IFCError.IFC_OK === msg.error_code)
                callback({"error_code": err_code, "verify_result": verify_result});
              else
                callback(msg);
            });
          });
      });
    } else {
      // NO PEER CERTIFICATE
      connector.send({
          func_name: "verify",
          params: {
            "containerId": containerId,
            "inDataType": dataType,
            "data": data,
            "signType": signType,
            "sign": sign,
            "x509Handle": 0
          }
        },
        callback);
    }
  }

  function sign_xml(containerId, userPin, wsu_id, data, inDataType, outDataType, callback, cspUI) {
    getCryptoById(getCryptoIdByContainerId(containerId), function (msg) {
      if (IFCError.IFC_OK !== msg.error_code) {
        callback(msg);
        return;
      }

      if (typeof cspUI === "undefined") {
        cspUI = 1;
      }

      connector.send({
          func_name: "sign_xml",
          params: {
            "containerId": containerId,
            "userPin": userPin ? userPin : '',
            "wsu_id": wsu_id,
            "inDataType": inDataType,
            "data": data,
            "cspUI": cspUI,
            "outDataType": outDataType
          }
        },
        callback);
    });
  }

  function verify_xml(containerId, wsu_id, sign, inDataType, callback) {

    connector.send({
        func_name: "verify_xml",
        params: {
          "containerId": containerId,
          "wsu_id": wsu_id,
          "inDataType": inDataType,
          "sign": sign,

        }
      },
      function (msg) {
        if (IFCError.IFC_OK === msg.error_code)
          callback({"error_code": msg.error_code, "verify_result": msg.verify_result});
        else
          callback(msg);


      });
  }

  /**@private*/
  function getHashByDataType(containerId, dataType, data, callback) {
    connector.send({
      func_name: "hash",
      params: {
        "containerId": containerId,
        "inDataType": dataType,
        "data": data,
        "outDataType": IFCConst.IFC_BASE64
      }
    }, function (msg) {
      if (IFCError.IFC_OK !== msg.error_code) {
        callback(msg);
        return;
      }
      callback({"error_code": IFCError.IFC_OK, "hash": new IFCHash(msg.hashValue)});
    });

  }

  function generateKeyPairAndCsrExtended(containerId, userPin, subjectDN, extendedKeyUsage, certificatePolicies, callback) {
    return generateKeyPairAndCsrV2Extended(containerId, userPin, subjectDN, extendedKeyUsage, certificatePolicies, "", callback);
  }

  function generateKeyPairAndCsrV2Extended(containerId, userPin, subjectDN, extendedKeyUsage, certificatePolicies, csrExtensions, callback) {
    connector.send({
      func_name: "key_gen",
      params: {"containerId": containerId, "userPin": userPin}
    }, function (msg) {
      if (IFCError.IFC_OK !== msg.error_code) {
        callback(msg);
        return;
      }

      var dn = new IFCDN(subjectDN, IFCConst.DN_SEPARATOR_INPUT);
      var dn_array = dn.getSubjectArray();

      var extendedKeyUsage_str = "clientAuth,emailProtection," + "1.2.643.2.2.34.6," + extendedKeyUsage;
      var extendedKeyUsage_json_array = extendedKeyUsage_str.split(",");
      var certificatePolicies_json_array = certificatePolicies.split(",");
      var real_key_id = msg.real_id;

      connector.send({
        func_name: "req_gen",
        params: {
          "containerId": real_key_id,
          "userPin": userPin,
          "subject": dn_array,
          "extendedKeyUsage": extendedKeyUsage_json_array,
          "certificatePolicies": certificatePolicies_json_array,
          "signInstrument": "",
          "req_format": IFCConst.IFC_REQ_BASE64ENCODED,
          "csrExtensions": csrExtensions
        }
      }, function (msg) {
        if (IFCError.IFC_OK !== msg.error_code) {
          callback(msg);
          return;
        }
        callback({
          "error_code": IFCError.IFC_OK,
          "real_id": real_key_id,
          "req_base64_length": msg.req_base64_length,
          "req_base64": msg.req_base64,
          "req": new IFCCertificateRequest(real_key_id, msg.req_base64)
        });
      });
    });
  }

  /**@private
   * @description Возвращает перечень сертификатов, доступных для Модуля, в виде массива объектов IFCCertificate.
   * */
  function getCertificateList(callback, show_progress) {
    getCryptoList(function (msg) {
      if (IFCError.IFC_OK !== msg.error_code) {
        callback(msg);
        return;
      }

      var crypto_array = msg.ifc_list;
      var cryptoID_array = [];
      for (var i = 0; i < crypto_array.length; i++) {
        cryptoID_array.push(crypto_array[i].getCryptoId());
      }

      connector.send({
        func_name: "get_list_certs_by_cryptoid_array",
        params: {"cryptoID_array": cryptoID_array, "show_progress": show_progress}
      }, function (msg) {
        if (IFCError.IFC_OK !== msg.error_code) {
          callback(msg);
          return;
        }

        if (msg.intermediate) {
          callback(msg);
          return;
        }


        var certsArray = [];
        for (var i = 0; i < msg.result_array.length; i++) {
          var cur_crypto = false;

          // Находим объект IFCCrypto по ID
          for (var j = 0; j < crypto_array.length; j++) {
            if (crypto_array[j].getCryptoId() === msg.result_array[i].crypto_id) {
              cur_crypto = crypto_array[j];
              break;
            }
          }
          if (cur_crypto === false)
            continue;

          // Находим сертификаты для этого СКЗИ
          for (var z = 0; z < msg.result_array[i].cert_list.length; z++) {
            certsArray.push(new IFCCertificate(msg.result_array[i].cert_list[z], cur_crypto));
          }
        }
        callback({"error_code": IFCError.IFC_OK, "certs_list": certsArray});
      });
    });
  }

  /**@private
   * @description Возвращает перечень сертификатов, в виде массива объектов IFCCertificate.
   * Поиск сертификатов производится на СКЗИ, заданном с помощью идентификатора СКЗИ (cryptoId).
   * */
  function getCertificateListByCryptoId(cryptoId, callback) {
    getCryptoById(cryptoId, function (msg) {
      if (IFCError.IFC_OK !== msg.error_code) {
        callback(msg);
        return;
      }

      var crypto = msg.crypto;
      connector.send({func_name: "get_list_certs", params: {"cryptoID": crypto.getCryptoId()}}, function (msg) {
        if (IFCError.IFC_OK !== msg.error_code) {
          callback(msg);
          return;
        }

        const certsArray = [];
        for (var i = 0; i < msg.cert_list.length; i++) {
          certsArray.push(new IFCCertificate(msg.cert_list[i], crypto));
        }
        callback({"error_code": IFCError.IFC_OK, certs_list: certsArray});
      });
    });
  }

  /**@private
   * @description Возвращает перечень ключевых контейнеров, в виде массива объектов IFCCertificate.
   * Поиск сертификатов производится на СКЗИ, заданном с помощью идентификатора СКЗИ (cryptoId).
   * Отображает в том числе контейнеры, в которых не содержится сертификата.
   * */
  function getKeyListByCryptoId(cryptoId, userPin, callback) {
    getCryptoById(cryptoId, function (msg) {
      if (IFCError.IFC_OK !== msg.error_code) {
        callback(msg);
        return;
      }

      var crypto = msg.crypto;
      if (!(userPin && userPin.length > 0) && crypto.isPKCS11()) {
        callback({"error_code": IFCError.IFC_P11_INVALID_PIN_ERROR});
      }

      connector.send({
        func_name: "get_list_keys",
        params: {"cryptoID": crypto.getCryptoId(), "userPin": userPin}
      }, function (msg) {
        if (IFCError.IFC_OK !== msg.error_code) {
          callback(msg);
          return;
        }

        const keysArray = [];
        for (var i = 0; i < msg.keys_list.length; i++) {
          keysArray.push(new IFCCertificate(msg.keys_list[i], crypto));
        }

        callback({"error_code": IFCError.IFC_OK, keys_list: keysArray});
      });
    });
  }

  /**@private
   * @description Генерация ключевой пары и CSR. ContainerId задается входным параметром.
   * @returns {IFCCertificateRequest} Объект содержит заданный идентификатор контейнера и значение запроса на сертификат, кодированное в Base64.
   * */
  function generateKeyPairAndCsrForContainerId(containerId, userPin, subjectDN, callback) {
    return generateKeyPairAndCsrForContainerIdV2(containerId, userPin, subjectDN, "", callback);
  }

  function generateKeyPairAndCsrForContainerIdV2(containerId, userPin, subjectDN, csrExtensions, callback) {
    var cryptoId = getCryptoIdByContainerId(containerId);

    getCryptoById(cryptoId, function (msg) {
      if (IFCError.IFC_OK !== msg.error_code) {
        callback(msg);
        return;
      }

      if (!(userPin && userPin.length > 0) && msg.crypto.isPKCS11()) {
        callback({"error_code": IFCError.IFC_P11_INVALID_PIN_ERROR});
        return;
      }

      generateKeyPairAndCsrV2Extended(containerId, userPin, subjectDN, msg.crypto.getExtendedKeyUsage(), msg.crypto.getCertificatePolicies(), csrExtensions, callback)
    })
  }

  /**@private
   * @description Создание самоподписанного сертификата
   * */
  function makeSelfSignedCert(containerId, userPin, request, callback) {
    var cryptoId = getCryptoIdByContainerId(containerId);

    getCryptoById(cryptoId, function (msg) {
      if (IFCError.IFC_OK !== msg.error_code) {
        callback(msg);
        return;
      }

      if (!(userPin && userPin.length > 0) && msg.crypto.isPKCS11()) {
        callback({"error_code": IFCError.IFC_P11_INVALID_PIN_ERROR});
        return;
      }
      connector.send({
        func_name: "make_cert",
        params: {"containerId": containerId, "userPin": userPin, "request": request}
      }, function (msg) {
        callback(msg);
      });
    });

  }

  /**@private
   * @description Генерация псевдослучайного GUID. GUID используется при генерации уникальных containerId
   * */
  function getGuid(callback) {
    connector.send({func_name: "get_guid", params: {"prefix": guidPrefix}}, callback);
  }

  /**@private
   * @description Генерация ключевой пары и CSR.
   * */
  function generateKeyPairAndCsr(cryptoId, userPin, subjectDN, callback) {
    return generateKeyPairAndCsrV2(cryptoId, userPin, subjectDN, "", callback);
  }

  function generateKeyPairAndCsrV2(cryptoId, userPin, subjectDN, csrExtensions, callback) {
    getGuid(function (msg) {
      if (IFCError.IFC_OK !== msg.error_code) {
        callback(msg);
        return;
      }

      var containerId = cryptoId + "/" + msg.guid;

      return generateKeyPairAndCsrForContainerIdV2(containerId, userPin, subjectDN, csrExtensions, callback);
    })
  }

  /**@private
   * @description Удаляет ключевой контейнер.
   * */
  function deleteContainer(containerId, userPin, callback) {
    getCryptoById(getCryptoIdByContainerId(containerId), function (msg) {
      if (IFCError.IFC_OK !== msg.error_code) {
        callback(msg);
        return;
      }

      var crypto = msg.crypto;
      if (!(userPin && userPin.length > 0) && crypto.isPKCS11()) {
        callback({"error_code": IFCError.IFC_P11_INVALID_PIN_ERROR});
        return;
      }

      connector.send({
        func_name: "key_delete",
        params: {"containerId": containerId, "userPin": userPin}
      }, callback);
    });
  }

  function getCertificateHandleFromString(dataString, callback) {
    connector.send({
      func_name: "load_x509_from_data",
      params: {"cert": dataString, "cert_data_type": IFCConst.IFC_CERT_UNKNOWN}
    }, callback);
  }

  function getCertificateHandleFromContainerID(containerId, callback) {
    connector.send({func_name: "load_x509_from_container", params: {"containerId": containerId}}, callback);
  }

  function freeCertificateHandle(x509Handle, callback) {
    connector.send({func_name: "free_x509", params: {"x509Handle": x509Handle}}, callback);
  }

  function getCertificateByHandle(x509Handle, callback) {
    // Set the certificate to a container
    connector.send({func_name: "get_x509_info", params: {"x509Handle": x509Handle}}, function (msg) {
      if (IFCError.IFC_OK !== msg.error_code) {
        callback(msg);
        return;
      }

      var cert = new IFCCertificateInfo(msg.cert_info);
      callback({"error_code": msg.error_code, "cert": cert});
    });
  }

  /**@private
   * @description Получает сертификат в виде строки base64 и возвращает по нему подробную информацию.
   * */
  function getCertificateFromString(dataString, callback) {
    getCertificateHandleFromString(dataString, function (msg) {
      if (IFCError.IFC_OK !== msg.error_code) {
        callback(msg);
        return;
      }

      var x509Handle = msg.x509Handle;

      // Set the certificate to a container
      getCertificateByHandle(x509Handle, function (msg) {
        if (IFCError.IFC_OK !== msg.error_code) {
          callback(msg);
          return;
        }

        var cert = msg.cert;

        // Free certificate handle
        freeCertificateHandle(x509Handle, function (msg) {
          callback({"error_code": msg.error_code, "cert": cert});
        });
      });
    });
  }

  /**@private
   * @description Извлекает сертификат из контейнера и возвращает по нему подробную информацию.
   * */
  function getCertificate(containerId, callback) {
    getCertificateHandleFromContainerID(containerId, function (msg) {
      if (IFCError.IFC_OK !== msg.error_code) {
        callback(msg);
        return;
      }

      var x509Handle = msg.x509Handle;

      // Set the certificate to a container
      connector.send({func_name: "get_x509_info", params: {"x509Handle": x509Handle}}, function (msg) {
        if (IFCError.IFC_OK !== msg.error_code) {
          callback(msg);
          return;
        }

        var cert = new IFCCertificateInfo(msg.cert_info);
        // Free certificate
        freeCertificateHandle(x509Handle, function (msg) {
          callback({"error_code": msg.error_code, "cert": cert});
        });
      });
    });
  }


  /**@private
   * @description Записывает сертификат в ключевой контейнер.
   * */
  function putCertificate(containerId, userPin, certificateValue, callback) {
    var cryptoId = getCryptoIdByContainerId(containerId);

    getCryptoById(cryptoId, function (msg) {
      if (IFCError.IFC_OK !== msg.error_code) {
        callback(msg);
        return;
      }

      if (!(userPin && userPin.length > 0) && msg.crypto.isPKCS11()) {
        callback({"error_code": IFCError.IFC_P11_INVALID_PIN_ERROR});
        return;
      }

      // Load certificate from BASE64-data or PEM-data
      getCertificateHandleFromString(certificateValue, function (msg) {
        if (IFCError.IFC_OK !== msg.error_code) {
          callback(msg);
          return;
        }
        var x509Handle = msg.x509Handle;

        // Set the certificate to a container
        connector.send({
          func_name: "set_x509",
          params: {"containerId": containerId, "userPin": userPin, "x509Handle": x509Handle}
        }, function (msg) {
          if (IFCError.IFC_OK !== msg.error_code) {
            callback(msg);
            return;
          }

          // Free certificate
          freeCertificateHandle(x509Handle, function (msg) {
            callback(msg);
            return;
          });
        });
      });
    });
  }


  /**@private
   * @description Шифрует входные данные, используя:
   * - контейнер с ключевой парой и сертификатом отправителя (обращается к нему по containerId);
   * - сертификат получателя (принимается в Base64).
   * Входные данные должны быть в Base64.
   * */
  function encrypt(containerId, userPin, peerCertificateBase64, data, callback) {
    if (!(userPin && userPin.length > 0)) {
      callback({"error_code": IFCError.IFC_P11_INVALID_PIN_ERROR});
      return;
    }

    getCertificateHandleFromString(peerCertificateBase64, function (msg) {
      if (IFCError.IFC_OK !== msg.error_code) {
        callback(msg);
        return;
      }

      const peer_x509Handle = msg.x509Handle;

      connector.send({
          func_name: "encrypt",
          params: {
            "containerId": containerId,
            "userPin": userPin,
            "peerX509Handle": peer_x509Handle,
            "data": data
          }
        },
        function (msg) {
          var err_code = msg.error_code;
          var result;
          if (IFCError.IFC_OK === msg.error_code) {
            result = new IFCEncrypted(msg.enc_data_base64, msg.enc_key_base64, msg.cert_base64);
          }

          // Free certificate
          freeCertificateHandle(peer_x509Handle, function (msg) {
            if (IFCError.IFC_OK !== msg.error_code) {
              callback(msg);
              return;
            }

            if (IFCError.IFC_OK === err_code)
              callback({"error_code": err_code, "encrypted": result});
            else
              callback({"error_code": err_code});
          });
        });
    });
  }

  /**@private
   * @description Расшифровывает входные данные, используя:
   * - контейнер с ключевой парой и сертификатом получателя (обращается к нему по containerId);
   * - сертификат отправителя (принимается в Base64);
   * - зашифрованный сессионный ключ.
   * Входные данные должны быть в Base64.
   * */
  function decrypt(containerId, userPin, peerCertificateBase64, encryptedData, encryptedKey, callback) {
    if (!(userPin && userPin.length > 0)) {
      callback({"error_code": IFCError.IFC_P11_INVALID_PIN_ERROR});
      return;
    }

    getCertificateHandleFromString(peerCertificateBase64, function (msg) {
      if (IFCError.IFC_OK !== msg.error_code) {
        callback(msg);
        return;
      }

      const peer_x509Handle = msg.x509Handle;

      connector.send({
          func_name: "decrypt",
          params: {
            "containerId": containerId,
            "userPin": userPin,
            "peerX509Handle": peer_x509Handle,
            "encryptedData": encryptedData,
            "encryptedKey": encryptedKey
          }
        },
        function (msg) {
          var err_code = msg.error_code;
          var result;
          if (IFCError.IFC_OK === msg.error_code) {
            result = msg.decrypted;
          }

          // Free certificate
          freeCertificateHandle(peer_x509Handle, function (msg) {
            if (IFCError.IFC_OK !== msg.error_code) {
              callback(msg);
              return;
            }

            if (IFCError.IFC_OK === err_code)
              callback({"error_code": err_code, "decrypted": result});
            else
              callback({"error_code": err_code});
          });
        });
    });
  }

  // Специфичные для PKCS#11 методы

  /**@private
   * @description Инициализация СКЗИ. Только для PKCS#11.
   * */
  function pkcs11Init(cryptoId, cryptoDescription, userPin, adminPin, callback) {
    if (!(userPin && userPin.length > 0)) {
      callback({"error_code": IFCError.IFC_P11_INVALID_PIN_ERROR});
      return;
    }
    if (!(adminPin && adminPin.length > 0)) {
      callback({"error_code": IFCError.IFC_P11_INVALID_PIN_ERROR});
      return;
    }

    connector.send({
      func_name: "p11_init",
      params: {"cryptoID": cryptoId, "label": cryptoDescription, "userPin": userPin, "adminPin": adminPin}
    }, callback);
  }

  /**@private
   * @description Смена ПИН-кода пользователя для СКЗИ. Только для PKCS#11.
   * */
  function pkcs11ChangeUserPin(cryptoId, currentPin, newPin, callback) {
    if (!(currentPin && currentPin.length > 0)) {
      callback({"error_code": IFCError.IFC_P11_INVALID_PIN_ERROR});
      return;
    }
    if (!(newPin && newPin.length > 0)) {
      callback({"error_code": IFCError.IFC_P11_INVALID_PIN_ERROR});
      return;
    }

    connector.send({
      func_name: "p11_pin_change",
      params: {
        "cryptoID": cryptoId,
        "pinType": IFCConst.P11_PIN_TYPE_USER,
        "currentPin": currentPin,
        "newPin": newPin
      }
    }, callback);
  }

  /**@private
   * @description Разблокировать ПИН-код пользователя СКЗИ. Только для PKCS#11.
   * */
  function pkcs11UnlockUserPin(cryptoId, adminPin, callback) {
    if (!(adminPin && adminPin.length > 0)) {
      callback({"error_code": IFCError.IFC_P11_INVALID_PIN_ERROR});
      return;
    }

    connector.send({func_name: "p11_pin_unlock", params: {"cryptoID": cryptoId, "adminPin": adminPin}}, callback);
  }

  /**@private
   * @description  Смена ПИН-кода администратора для СКЗИ. Только для PKCS#11.
   * */
  function pkcs11ChangeAdminPin(cryptoId, currentPin, newPin, callback) {
    if (!(currentPin && currentPin.length > 0)) {
      callback({"error_code": IFCError.IFC_P11_INVALID_PIN_ERROR});
      return;
    }
    if (!(newPin && newPin.length > 0)) {
      callback({"error_code": IFCError.IFC_P11_INVALID_PIN_ERROR});
      return;
    }

    connector.send({
      func_name: "p11_pin_change",
      params: {
        "cryptoID": cryptoId,
        "pinType": IFCConst.P11_PIN_TYPE_ADMIN,
        "currentPin": currentPin,
        "newPin": newPin
      }
    }, callback);
  }

  /**@private
   * @description Изменяет идентификатор контейнера, сохраненного на СКЗИ. Только для PKCS#11.
   * */
  function pkcs11RenameContainer(containerId, newContainerId, userPin, callback) {
    if (!(userPin && userPin.length > 0)) {
      callback({"error_code": IFCError.IFC_P11_INVALID_PIN_ERROR});
      return;
    }
    connector.send({
      func_name: "p11_key_rename",
      params: {"containerId": containerId, "newContainerId": newContainerId, "userPin": userPin}
    }, callback);
  }


  /**@private
   * @description "Перемещает" контейнер из oldContainerId в newContainerId. Только для PKCS#11.
   * Алгоритм: удаляет контейнер с newContainerId, если он существует. Переименовывает контейнер
   * oldContainerId в newContainerId
   * */
  function pkcs11MoveContainer(oldContainerId, newContainerId, userPin, callback) {
    if (!(userPin && userPin.length > 0)) {
      callback({"error_code": IFCError.IFC_P11_INVALID_PIN_ERROR});
      return;
    }

    getCryptoById(getCryptoIdByContainerId(oldContainerId), function (msg) {
      if (IFCError.IFC_OK !== msg.error_code) {
        callback(msg);
        return;
      }

      if (msg.crypto == null || !msg.crypto.isPKCS11()) {
        callback({"error_code": IFCError.IFC_BAD_PARAMS});
        return;
      }

      // deleting the old container
      var containerToDelete = getCryptoIdByContainerId(oldContainerId) + "/" + newContainerId;
      deleteContainer(containerToDelete, userPin, function (msg) {
        if (IFCError.IFC_OK === msg.error_code || IFCError.IFC_CONTAINER_NOT_FOUND === msg.error_code) {
          pkcs11RenameContainer(oldContainerId, newContainerId, userPin, callback);
        }
      });
    });
  }


  // Методы низкоуровнего взаимодействия со смарт-картами

  /**@private
   *  @description Отправка подключенной смарт-карте или криптотокену APDU-команды.
   * */
  function sendAPDU(readerName, requestData, callback) {
    connector.send({
      func_name: "send_apdu",
      params: {"readerName": readerName, "apdu_string": requestData}
    }, callback);
  }


  ///////////////////////////////////////////////
  // Публичные методы библиотеки
  ///////////////////////////////////////////////

  /**@public
   * @description Инициализация и запуск мониторинга состояния соединения с плагином
   * */
  this.init = function (initOnLoad) {
    var that = this;
    var timeout = null;

    this.status = {
      isNativeMessaging: isNativeMessaging(),
      isNewSafari: isNewSafari(),
      extensionIsInstalled: null,
      pluginIsRunning: null
    };

    if (initOnLoad) {
      if (this.status.isNewSafari) {
        timeout = 5000;
      } else {
        timeout = 500;
      }
    } else {
      timeout = 4;
    }

    if (this.status.isNativeMessaging) {

      setTimeout(function () {
        if (document.getElementById('ifcplugin-extension-is-installed')) {
          that.status.extensionIsInstalled = true;

          if (document.getElementById('ifc-plugin-is-installed')) {
            that.status.pluginIsRunning = true;
          } else {
            that.status.pluginIsRunning = false;
          }
        } else {
          that.status.extensionIsInstalled = false;
        }

        triggerPluginEvent('updatePluginStatus');
      }, timeout);
    } else {
      this.status.pluginIsRunning = false;

      this.getPluginVersion(function (msg) {
        if (IFCError.IFC_OK === msg.error_code) {
          that.status.pluginIsRunning = true;
        }
      });

      setTimeout(function () {
        triggerPluginEvent('updatePluginStatus');
      }, 1000);
    }

    setTimeout(that.init.bind(that), 5000);
  };

  /**@public
   * @description Возвращает версию библиотеки.
   * @returns {String} Формат версии: X.X.X
   * */
  this.getLibVersion = function (callback) {
    return libVersion;
  };

  /**@public
   * @description Создает IFCPlugin: Инициализация и настройка Плагина
   * */
  this.create = function (file_config, config_string, callback) {
    connector.send({
      func_name: "create",
      params: {
        "file_config": file_config,
        "config_string": config_string,
        "log_file_location": "",
        "plugin_log_level": ""
      }
    }, callback);
  };

  /**@public
   * @description Возвращает версию плагина.
   * */
  this.getPluginVersion = function (callback) {
    connector.send({func_name: "version"}, callback);
  };

  /**@public
   * @description Возвращает перечень СКЗИ, доступных для плагина, в виде массива объектов IFCCrypto.
   * */
  this.getCryptoList = function (callback) {
    return getCryptoList(callback);
  };

  /**@public
   * @description Возвращает перечень СКЗИ, доступных для плагина через интерфейс PKCS#11, в виде массива объектов IFCCrypto.
   * */
  this.getPKCS11CryptoList = function (callback) {
    return getCryptoListByType(IFCConst.IFC_CRYPTO_PKCS11, callback);
  };

  /**@public
   * @description Возвращает перечень СКЗИ, доступных для плагина через интерфейс CAPI, в виде массива объектов IFCCrypto.
   * */
  this.getCAPICryptoList = function (callback) {
    return getCryptoListByType(IFCConst.IFC_CRYPTO_CAPI, callback);
  };

  /**@public
   * @description Возвращает перечень СКЗИ, доступных для плагина через интерфейс CAPI под LINUX, в виде массива объектов IFCCrypto.
   * */
  this.getCAPILINUXCryptoList = function (callback) {
    return getCryptoListByType(IFCConst.IFC_CRYPTO_CAPI_LINUX, callback);
  };

  /**@public
   * @description Возвращает информацию о СКЗИ (объект IFCCrypto), по переданному на вход cryptoId.
   * */
  this.getCryptoById = function (cryptoId, callback) {
    return getCryptoById(cryptoId, callback);
  };


  /**@public
   * @description Возвращает перечень сертификатов, доступных для Модуля, в виде массива объектов IFCCertificate.
   * */
  this.getCertificateList = function (callback) {
    return getCertificateList(callback, 0);
  };

  /**@public
   * @description Возвращает перечень сертификатов, доступных для Модуля, в виде массива объектов IFCCertificate и прогресс обработки сертификатов.
   * */
  this.getCertificateListWithProgress = function (callback) {
    return getCertificateList(callback, 1);
  };

  /**@public
   * @description Возвращает перечень сертификатов, в виде массива объектов IFCCertificate.
   * Поиск сертификатов производится на СКЗИ, заданном с помощью идентификатора СКЗИ (cryptoId).
   * */
  this.getCertificateListByCryptoId = function (cryptoId, callback) {
    return getCertificateListByCryptoId(cryptoId, callback);
  };

  /**@public
   * @description Возвращает перечень ключевых контейнеров, в виде массива объектов IFCCertificate.
   * Поиск сертификатов производится на СКЗИ, заданном с помощью идентификатора СКЗИ (cryptoId).
   * Отображает в том числе контейнеры, в которых не содержится сертификата.
   * */
  this.getKeyListByCryptoId = function (cryptoId, userPin, callback) {
    return getKeyListByCryptoId(cryptoId, userPin, callback);
  };

  /**@public
   * @description Получение идентификатора криптоустройства по ContainerId.
   * */
  this.getCryptoIdByContainerId = function (callback) {
    return getCryptoIdByContainerId(callback);
  };

  // Методы работы с электронной подписью

  /**@public
   * @description Формирует подпись в формате XML
   */
  this.signDataXml = function (containerId, pin, wsu_id, data, outDataType, callback, cspUI) {
    return sign_xml(containerId, pin, wsu_id, data, IFCConst.IFC_DATATYPE_DATA, outDataType, callback, cspUI)
  };

  if (testFunctionsEnabled) {
    this.verifyDataXml = function (containerId, wsu_id, signature, callback) {
      return verify_xml(containerId, wsu_id, signature, IFCConst.IFC_DATATYPE_DATA, callback);
    }
  }

  /**@public
   * @description Декодирует из base64 данные входной строки и Формирует подпись в формате XML
   */
  this.signDataBase64Xml = function (containerId, pin, wsu_id, data, outDataType, callback, cspUI) {
    return sign_xml(containerId, pin, wsu_id, data, IFCConst.IFC_DATATYPE_DATA_BASE64, outDataType, callback, cspUI)
  };

  if (testFunctionsEnabled) {
    this.verifyDataBase64Xml = function (containerId, wsu_id, signature, callback) {
      return verify_xml(containerId, wsu_id, signature, IFCConst.IFC_DATATYPE_DATA_BASE64, callback);
    }
  }

  /**@public
   * @description Формирует электронную подпись в формате CMS Attached для переданной строки данных.
   * */
  this.signDataCmsAttached = function (containerId, pin, data, callback, cspUI) {
    return sign(containerId, pin, data, IFCConst.IFC_DATATYPE_DATA, IFCConst.IFC_SIGNTYPE_CMS_ATTACHED, callback, cspUI);
  };

  if (testFunctionsEnabled) {
    this.verifyDataCmsAttached = function (containerId, signature, callback) {
      return verify(containerId, signature, IFCConst.IFC_SIGNTYPE_CMS_ATTACHED, "", IFCConst.IFC_DATATYPE_DATA, "", callback);
    }
  }

  /**@public
   * @description Формирует электронную подпись в формате CMS Detached для переданной строки данных.
   * */
  this.signDataCmsDetached = function (containerId, pin, data, callback, cspUI) {
    return sign(containerId, pin, data, IFCConst.IFC_DATATYPE_DATA, IFCConst.IFC_SIGNTYPE_CMS_DETACHED, callback, cspUI);
  };

  if (testFunctionsEnabled) {
    this.verifyDataCmsDetached = function (containerId, signature, data, callback) {
      return verify(containerId, signature, IFCConst.IFC_SIGNTYPE_CMS_DETACHED, data, IFCConst.IFC_DATATYPE_DATA, "", callback);
    }
  }

  /**@public
   * @description Формирует электронную подпись в формате CAdES-BES Attached для переданной строки данных.
   * */
  this.signDataCadesBesAttached = function (containerId, pin, data, callback, cspUI) {
    return sign(containerId, pin, data, IFCConst.IFC_DATATYPE_DATA, IFCConst.IFC_SIGNTYPE_CADES_BES_ATTACHED, callback, cspUI);
  };

  if (testFunctionsEnabled) {
    this.verifyDataCadesBesAttached = function (containerId, signature, callback) {
      return verify(containerId, signature, IFCConst.IFC_SIGNTYPE_CADES_BES_ATTACHED, "", IFCConst.IFC_DATATYPE_DATA, "", callback);
    }
  }

  /**@public
   * @description Формирует электронную подпись в формате CAdES-BES Detached для переданной строки данных.
   * */
  this.signDataCadesBesDetached = function (containerId, pin, data, callback, cspUI) {
    return sign(containerId, pin, data, IFCConst.IFC_DATATYPE_DATA, IFCConst.IFC_SIGNTYPE_CADES_BES_DETACHED, callback, cspUI);
  };

  if (testFunctionsEnabled) {
    this.verifyDataCadesBesDetached = function (containerId, signature, data, callback) {
      return verify(containerId, signature, IFCConst.IFC_SIGNTYPE_CADES_BES_DETACHED, data, IFCConst.IFC_DATATYPE_DATA, "", callback);
    }
  }

  /**@public
   * @description Декодирует из base64 данные входной строки. Формирует электронную подпись для декодированного содержимого
   * в формате CMS Attached.
   * */
  this.signDataBase64CmsAttached = function (containerId, pin, data, callback, cspUI) {
    return sign(containerId, pin, data, IFCConst.IFC_DATATYPE_DATA_BASE64, IFCConst.IFC_SIGNTYPE_CMS_ATTACHED, callback, cspUI);
  };

  if (testFunctionsEnabled) {
    this.verifyDataBase64CmsAttached = function (containerId, signature, callback) {
      return verify(containerId, signature, IFCConst.IFC_SIGNTYPE_CMS_ATTACHED, "", IFCConst.IFC_DATATYPE_DATA_BASE64, "", callback);
    }
  }

  /**@public
   * @description Декодирует из base64 данные входной строки. Формирует электронную подпись для декодированного содержимого
   * в формате CMS Detached.
   * */
  this.signDataBase64CmsDetached = function (containerId, pin, data, callback, cspUI) {
    return sign(containerId, pin, data, IFCConst.IFC_DATATYPE_DATA_BASE64, IFCConst.IFC_SIGNTYPE_CMS_DETACHED, callback, cspUI);
  };

  if (testFunctionsEnabled) {
    this.verifyDataBase64CmsDetached = function (containerId, signature, data, callback) {
      return verify(containerId, signature, IFCConst.IFC_SIGNTYPE_CMS_DETACHED, data, IFCConst.IFC_DATATYPE_DATA_BASE64, "", callback);
    }
  }

  /**@public
   * @description Декодирует из base64 данные входной строки. Формирует электронную подпись для декодированного содержимого
   * в формате CAdES-BES Attached.
   * */
  this.signDataBase64CadesBesAttached = function (containerId, pin, data, callback, cspUI) {
    return sign(containerId, pin, data, IFCConst.IFC_DATATYPE_DATA_BASE64, IFCConst.IFC_SIGNTYPE_CADES_BES_ATTACHED, callback, cspUI);
  };

  if (testFunctionsEnabled) {
    this.verifyDataBase64CadesBesAttached = function (containerId, signature, callback) {
      return verify(containerId, signature, IFCConst.IFC_SIGNTYPE_CADES_BES_ATTACHED, "", IFCConst.IFC_DATATYPE_DATA_BASE64, "", callback);
    }
  }

  /**@public
   * @description Декодирует из base64 данные входной строки. Формирует электронную подпись для декодированного содержимого
   * в формате CAdES-BES Detached.
   * */
  this.signDataBase64CadesBesDetached = function (containerId, pin, data, callback, cspUI) {
    return sign(containerId, pin, data, IFCConst.IFC_DATATYPE_DATA_BASE64, IFCConst.IFC_SIGNTYPE_CADES_BES_DETACHED, callback, cspUI);
  };

  if (testFunctionsEnabled) {
    this.verifyDataBase64CadesBesDetached = function (containerId, signature, data, callback) {
      return verify(containerId, signature, IFCConst.IFC_SIGNTYPE_CADES_BES_DETACHED, data, IFCConst.IFC_DATATYPE_DATA_BASE64, "", callback);
    }
  }

  /**@public
   * @description Декодирует из base64 данные входной строки, содержащей хеш для подписания.
   * Формирует электронную подпись для декодированного содержимого
   * в формате CMS Detached.
   * */
  this.signDataHash64CmsDetached = function (containerId, pin, data, callback, cspUI) {
    return sign(containerId, pin, data, IFCConst.IFC_DATATYPE_HASH_BASE64, IFCConst.IFC_SIGNTYPE_CMS_DETACHED, callback, cspUI);
  };

  if (testFunctionsEnabled) {
    this.verifyDataHash64CmsDetached = function (containerId, signature, data, callback) {
      return verify(containerId, signature, IFCConst.IFC_SIGNTYPE_CMS_DETACHED, data, IFCConst.IFC_DATATYPE_HASH_BASE64, "", callback);
    }
  }

  /**@public
   * @description Декодирует из base64 данные входной строки, содержащей хеш для подписания.
   * Формирует электронную подпись для декодированного содержимого
   * в формате CAdES-BES Detached.
   * */
  this.signDataHash64CadesBesDetached = function (containerId, pin, data, callback, cspUI) {
    return sign(containerId, pin, data, IFCConst.IFC_DATATYPE_HASH_BASE64, IFCConst.IFC_SIGNTYPE_CADES_BES_DETACHED, callback, cspUI);
  };

  if (testFunctionsEnabled) {
    this.verifyDataHash64CadesBesDetached = function (containerId, signature, data, callback) {
      return verify(containerId, signature, IFCConst.IFC_SIGNTYPE_CADES_BES_DETACHED, data, IFCConst.IFC_DATATYPE_HASH_BASE64, "", callback);
    }
  }

  /**@public
   * @description Формирует "сырую" электронную подпись данных, прямой порядок байт.
   * */
  this.signDataSimple = function (containerId, pin, data, callback, cspUI) {
    return sign(containerId, pin, data, IFCConst.IFC_DATATYPE_DATA, IFCConst.IFC_SIGNTYPE_SIMPLE, callback, cspUI);
  };

  if (testFunctionsEnabled) {
    this.verifyDataSimple = function (containerId, signature, data, peerCertificate, callback) {
      return verify(containerId, signature, IFCConst.IFC_SIGNTYPE_SIMPLE, data, IFCConst.IFC_DATATYPE_DATA, peerCertificate, callback);
    }
  }

  /**@public
   * @description Формирует "сырую" электронную подпись для поданного хеша, прямой порядок байт. Хеш должен быть кодирован в Base64.
   * */
  this.signHashSimple = function (containerId, pin, hash, callback, cspUI) {
    return sign(containerId, pin, hash, IFCConst.IFC_DATATYPE_HASH_BASE64, IFCConst.IFC_SIGNTYPE_SIMPLE, callback, cspUI);
  };

  if (testFunctionsEnabled) {
    this.verifyHashSimple = function (containerId, signature, hash, peerCertificate, callback) {
      return verify(containerId, signature, IFCConst.IFC_SIGNTYPE_SIMPLE, hash, IFCConst.IFC_DATATYPE_HASH_BASE64, peerCertificate, callback);
    }
  }

  /**@public
   * @description Формирует "сырую" электронную подпись данных, обратный порядок байт.
   * */
  this.signDataSimpleReversed = function (containerId, pin, data, callback, cspUI) {
    return sign(containerId, pin, data, IFCConst.IFC_DATATYPE_DATA, IFCConst.IFC_SIGNTYPE_SIMPLE_REVERSE, callback, cspUI);
  };

  if (testFunctionsEnabled) {
    this.verifyDataSimpleReversed = function (containerId, signature, data, peerCertificate, callback) {
      return verify(containerId, signature, IFCConst.IFC_SIGNTYPE_SIMPLE_REVERSE, data, IFCConst.IFC_DATATYPE_DATA, peerCertificate, callback);
    }
  }

  /**@public
   * @description Декодирует из base64 данные входной строки. Формирует "сырую" электронную подпись.
   * */
  this.signDataBase64Simple = function (containerId, pin, data, callback, cspUI) {
    return sign(containerId, pin, data, IFCConst.IFC_DATATYPE_DATA_BASE64, IFCConst.IFC_SIGNTYPE_SIMPLE, callback, cspUI);
  };

  if (testFunctionsEnabled) {
    this.verifyDataBase64Simple = function (containerId, signature, data, peerCertificate, callback) {
      return verify(containerId, signature, IFCConst.IFC_SIGNTYPE_SIMPLE, data, IFCConst.IFC_DATATYPE_DATA_BASE64, peerCertificate, callback);
    }
  }

  // Методы для работы с ключевыми парами и сертификатами

  /**@public
   * @description Генерация ключевой пары и CSR. ContainerId задается входным параметром.
   * @returns {IFCCertificateRequest} Объект содержит заданный идентификатор контейнера и значение запроса на сертификат, кодированное в Base64.
   * */
  this.generateKeyPairAndCsrForContainerId = function (containerId, userPin, subjectDN, callback) {
    return generateKeyPairAndCsrForContainerId(containerId, userPin, subjectDN, callback);
  };

  /**@public
   * @description Генерация ключевой пары и CSR. ContainerId задается входным параметром. Обновленная версия с возможностью добавлять в CSR расширения
   * @returns {IFCCertificateRequest} Объект содержит заданный идентификатор контейнера и значение запроса на сертификат, кодированное в Base64.
   * */
  this.generateKeyPairAndCsrForContainerIdV2 = function (containerId, userPin, subjectDN, csrExtensions, callback) {
    return generateKeyPairAndCsrForContainerIdV2(containerId, userPin, subjectDN, csrExtensions, callback);
  };

  /**@public
   * @description Генерация ключевой пары и CSR.
   * */
  this.generateKeyPairAndCsr = function (cryptoId, userPin, subjectDN, callback) {
    return generateKeyPairAndCsr(cryptoId, userPin, subjectDN, callback);
  };

  /**@public
   * @description Генерация ключевой пары и CSR. Обновленная версия с возможностью добавлять в CSR расширения
   * */
  this.generateKeyPairAndCsrV2 = function (cryptoId, userPin, subjectDN, csrExtensions, callback) {
    return generateKeyPairAndCsrV2(cryptoId, userPin, subjectDN, csrExtensions, callback);
  };

  if (testFunctionsEnabled) {
    /**@public
     * @description Создание самоподписанного сертификата.
     * */
    this.makeSelfSignedCert = function (containerId, userPin, request, callback) {
      return makeSelfSignedCert(containerId, userPin, request, callback);
    }
  }

  /**@public
   * @description Записывает сертификат в ключевой контейнер.
   * */
  this.putCertificate = function (containerId, userPin, certificateValue, callback) {
    return putCertificate(containerId, userPin, certificateValue, callback);
  };

  /**@public
   * @description Удаляет ключевой контейнер.
   * */
  this.deleteContainer = function (containerId, userPin, callback) {
    return deleteContainer(containerId, userPin, callback);
  };

  // Методы работы с GUID
  /**@public
   * @description Генерация псевдослучайного GUID. GUID используется при генерации уникальных containerId
   * */
  this.getGuid = function (callback) {
    return getGuid(callback);
  };

  /**@public
   * @description Устанавливает префикс, используемый для генерации GUID.
   * */
  this.setGuidPrefix = function (newPrefix) {
    guidPrefix = newPrefix;
  };

  /**@public
   * @description Возвращает текущий префикс, используемый для генерации GUID.
   * */
  this.getGuidPrefix = function () {
    return guidPrefix;
  };


  /**@public
   * @description Извлекает сертификат из контейнера и возвращает по нему подробную информацию.
   * */
  this.getCertificate = function (containerId, callback) {
    return getCertificate(containerId, callback);
  };

  /**@public
   * @description Получает сертификат в виде строки base64 и возвращает по нему подробную информацию.
   * */
  this.getCertificateFromString = function (dataString, callback) {
    return getCertificateFromString(dataString, callback);
  };

  // Методы работы с ХЭШ-функцией

  /**@public
   * @description Вычисляет хеш для входной строки данных.
   * */
  this.getHash = function (containerId, data, callback) {
    return getHashByDataType(containerId, IFCConst.IFC_DATATYPE_DATA, data, callback);
  };

  /**@public
   * @description Декодирует из base64 входную строку данных, вычисляет для декодированной строки хеш.
   * */
  this.getHashFromBase64 = function (containerId, data, callback) {
    return getHashByDataType(containerId, IFCConst.IFC_DATATYPE_DATA_BASE64, data, callback);
  };

  // Функции шифрования-расшифрования

  /**@public
   * @description Шифрует входные данные, используя:
   * - контейнер с ключевой парой и сертификатом отправителя (обращается к нему по containerId);
   * - сертификат получателя (принимается в Base64).
   * Входные данные должны быть в Base64.
   * */
  this.encrypt = function (containerId, userPin, peerCertificateBase64, data, callback) {
    return encrypt(containerId, userPin, peerCertificateBase64, data, callback);
  };

  /**@public
   * @description Расшифровывает входные данные, используя:
   * - контейнер с ключевой парой и сертификатом получателя (обращается к нему по containerId);
   * - сертификат отправителя (принимается в Base64);
   * - зашифрованный сессионный ключ.
   * Входные данные должны быть в Base64.
   * */
  this.decrypt = function (containerId, userPin, peerCertificateBase64, encryptedData, encryptedKey, callback) {
    return decrypt(containerId, userPin, peerCertificateBase64, encryptedData, encryptedKey, callback);
  };

  // Специфичные для PKCS#11 методы

  /**@public
   * @description Инициализация СКЗИ. Только для PKCS#11.
   * */
  this.pkcs11Init = function (cryptoId, cryptoDescription, userPin, adminPin, callback) {
    return pkcs11Init(cryptoId, cryptoDescription, userPin, adminPin, callback);
  };

  /**@public
   * @description Смена ПИН-кода пользователя для СКЗИ. Только для PKCS#11.
   * */
  this.pkcs11ChangeUserPin = function (cryptoId, currentPin, newPin, callback) {
    return pkcs11ChangeUserPin(cryptoId, currentPin, newPin, callback);
  };

  /**@public
   * @description Разблокировать ПИН-код пользователя СКЗИ. Только для PKCS#11.
   * */
  this.pkcs11UnlockUserPin = function (cryptoId, adminPin, callback) {
    return pkcs11UnlockUserPin(cryptoId, adminPin, callback);
  };

  /**@public
   * @description  Смена ПИН-кода администратора для СКЗИ. Только для PKCS#11.
   * */
  this.pkcs11ChangeAdminPin = function (cryptoId, currentPin, newPin, callback) {
    return pkcs11ChangeAdminPin(cryptoId, currentPin, newPin, callback);
  };

  /**@public
   * @description Изменяет идентификатор контейнера, сохраненного на СКЗИ. Только для PKCS#11.
   * */
  this.pkcs11RenameContainer = function (containerId, newContainerId, userPin, callback) {
    return pkcs11RenameContainer(containerId, newContainerId, userPin, callback);
  };


  /**@public
   * @description "Перемещает" контейнер из oldContainerId в newContainerId. Только для PKCS#11.
   * Алгоритм: удаляет контейнер с newContainerId, если он существует. Переименовывает контейнер
   * oldContainerId в newContainerId
   * */
  this.pkcs11MoveContainer = function (oldContainerId, newContainerId, userPin, callback) {
    return pkcs11MoveContainer(oldContainerId, newContainerId, userPin, callback);
  };


  // Методы низкоуровнего взаимодействия со смарт-картами

  /**@public
   *  @description Отправка подключенной смарт-карте или криптотокену APDU-команды.
   * */
  this.sendAPDU = function (readerName, requestData, callback) {
    return sendAPDU(readerName, requestData, callback);
  }
}
