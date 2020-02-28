////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NOTE Imports
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const {
  XML_DSIG_GOST: {
    XmlDsigGost2012Url256,
    XmlDsigGost2012Url256Digest,
    XmlDsigGost2012Url512,
    XmlDsigGost2012Url512Digest,
    XmlDsigGost3410Url,
    XmlDsigGost3411Url,
  },
  CADESCOM: {
    CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED,
    CADESCOM_XML_SIGNATURE_TYPE_ENVELOPING,
    CADESCOM_XML_SIGNATURE_TYPE_TEMPLATE,
  }
} = require('./constants');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NOTE Functions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @method template
 * @param {String} signAlgorithm алгоритм подписи
 */
function template(signAlgorithm) {
  /**
   * @function doHashAlgorithm
   * @param {String} hashAlgorithm алгоритм хэширования
   */
  return function doHashAlgorithm(hashAlgorithm) {
    return {
      signAlgorithm,
      hashAlgorithm,
    };
  };
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NOTE Object create
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description объект предоставляет методы для выбора опций при подписании XML документа
 */
const xmlSitnatureMethods = Object.create(null);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NOTE Methods
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @method xmlSitnatureType
 * @param {Number} CADESCOM_XML_SIGNATURE_TYPE тип подписи XML кокумента
 * @returns {Number}
 * @throws {Error}
 * @description выбирает значение константы для типа подписи XML документа
 */
xmlSitnatureMethods.doXmlSitnatureType = function doXmlSitnatureType(CADESCOM_XML_SIGNATURE_TYPE) {
  switch (CADESCOM_XML_SIGNATURE_TYPE) {
    case 0:
      // Вложенная подпись
      return CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED;

    case 1:
      // Оборачивающая подпись
      return CADESCOM_XML_SIGNATURE_TYPE_ENVELOPING;

      /**
       * @todo тип подписи CADESCOM_XML_SIGNATURE_TYPE_TEMPLATE на данном этапе не поддерживается
       * @description при выдове данного пипа будет ошибка
       */
    case 2:
      // Подпись по шаблону
      return CADESCOM_XML_SIGNATURE_TYPE_TEMPLATE;

    default:
      throw new Error('Тип подписи не поддерживается');
  }
}

/**
 * @method doXmlSitnatureAlgorithm
 * @param {String} value алгоритм сертификата
 * @returns {Object}
 * @throws {Error}
 * @description определяет алгоритм подписания XML документа в зависимости от алгоритма сертификата
 */
xmlSitnatureMethods.doXmlSitnatureAlgorithm = function doXmlSitnatureAlgorithm(value) {
  switch (value) {
    case '1.2.643.2.2.19':
      // алгоритм ГОСТ Р 34.10-2001
      return template(XmlDsigGost3410Url)(XmlDsigGost3411Url);

    case '1.2.643.7.1.1.1.1':
      // алгоритм ГОСТ Р 34.10-2012 256 бит
      return template(XmlDsigGost2012Url256)(XmlDsigGost2012Url256Digest);

    case '1.2.643.7.1.1.1.2':
      // алгоритм ГОСТ Р 34.10-2012 512 бит
      return template(XmlDsigGost2012Url512)(XmlDsigGost2012Url512Digest);

    default:
      throw new Error('Сертификат не соответствует ГОСТ Р 34.10-2012 (256 или 512 бит) или ГОСТ Р 34.10-2001');
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NOTE Exports
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = Object.create(xmlSitnatureMethods);