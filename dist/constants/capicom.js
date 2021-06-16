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
    global.capicom = mod.exports;
  }
})(this, function (module) {
  'use strict';

  module.exports = {
    /**
     * @constant {Number} CAPICOM_LOCAL_MACHINE_STORE Локальное хранилище компьютера.
     */
    CAPICOM_LOCAL_MACHINE_STORE: 1,
    /**
     * @constant {Number} CAPICOM_CURRENT_USER_STORE Хранилище текущего пользователя.
     */
    CAPICOM_CURRENT_USER_STORE: 2,
    /**
     * @constant {String} CAPICOM_MY_STORE Хранилище персональных сертификатов пользователя.
     */
    CAPICOM_MY_STORE: 'My',
    /**
     * @constant {Number} CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED
     * Открывает хранилище на чтение/запись, если пользователь имеет права на чтение/запись.
     * Если прав на запись нет, то хранилище открывается за чтение.
     */
    CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED: 2,
    /**
     * @constant {Number} CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED	Вложенная подпись.
     */
    CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED: 0,
    /**
     * @constant {Number} CADESCOM_XML_SIGNATURE_TYPE_ENVELOPING Оборачивающая подпись.
     */
    CADESCOM_XML_SIGNATURE_TYPE_ENVELOPING: 1,
    /**
     * @constant {Number} CADESCOM_XML_SIGNATURE_TYPE_TEMPLATE Подпись по шаблону.
     */
    CADESCOM_XML_SIGNATURE_TYPE_TEMPLATE: 2,
    /**
     * @constant {Number} CAPICOM_CERTIFICATE_INCLUDE_CHAIN_EXCEPT_ROOT Сохраняет все сертификаты цепочки за исключением корневого.
     */
    CAPICOM_CERTIFICATE_INCLUDE_CHAIN_EXCEPT_ROOT: 0,
    /**
     * @constant {Number} CAPICOM_CERTIFICATE_INCLUDE_END_ENTITY_ONLY Сертификат включает только конечное лицо
     */
    CAPICOM_CERTIFICATE_INCLUDE_END_ENTITY_ONLY: 2,
    /**
     * @constant {Number} CAPICOM_CERTIFICATE_INCLUDE_WHOLE_CHAIN Сохраняет полную цепочку.
     */
    CAPICOM_CERTIFICATE_INCLUDE_WHOLE_CHAIN: 1,
    /**
     * @constant {Number} CAPICOM_CERT_INFO_SUBJECT_SIMPLE_NAME Возвращает имя наименования сертификата.
     */
    CAPICOM_CERT_INFO_SUBJECT_SIMPLE_NAME: 0,
    /**
     * @constant {Number} CAPICOM_CERT_INFO_ISSUER_SIMPLE_NAME Возвращает имя издателя сертификата.
     */
    CAPICOM_CERT_INFO_ISSUER_SIMPLE_NAME: 1,
    /**
     * @constant {Number} CAPICOM_CERTIFICATE_FIND_SHA1_HASH Возвращает сертификаты соответствующие указанному хэшу SHA1.
     */
    CAPICOM_CERTIFICATE_FIND_SHA1_HASH: 0,
    /**
     * @constant {Number} CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME
     * Возвращает сертификаты, наименование которого точно или частично совпадает с указанным.
     */
    CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME: 1,
    /**
     * @constant {Number} CAPICOM_CERTIFICATE_FIND_ISSUER_NAME
     * Возвращает сертификаты, наименование издателя которого точно или частично совпадает с указанным.
     */
    CAPICOM_CERTIFICATE_FIND_ISSUER_NAME: 2,
    /**
     * @constant {Number} CAPICOM_CERTIFICATE_FIND_ROOT_NAME
     * Возвращает сертификаты, у которых наименование корневого точно или частично совпадает с указанным.
     */
    CAPICOM_CERTIFICATE_FIND_ROOT_NAME: 3,
    /**
     * @constant {Number} CAPICOM_CERTIFICATE_FIND_TEMPLATE_NAME
     * Возвращает сертификаты, у которых шаблонное имя точно или частично совпадает с указанным.
     */
    CAPICOM_CERTIFICATE_FIND_TEMPLATE_NAME: 4,
    /**
     * @constant {Number} CAPICOM_CERTIFICATE_FIND_EXTENSION
     * Возвращает сертификаты, у которых имеется раширение, совпадающее с указанным.
     */
    CAPICOM_CERTIFICATE_FIND_EXTENSION: 5,
    /**
     * @constant {Number} CAPICOM_CERTIFICATE_FIND_EXTENDED_PROPERTY
     * Возвращает сертификаты, у которых идентификатор раширенного свойства совпадает с указанным.
     */
    CAPICOM_CERTIFICATE_FIND_EXTENDED_PROPERTY: 6,
    /**
     * @constant {Number} CAPICOM_CERTIFICATE_FIND_CERTIFICATE_POLICY Возвращает сертификаты, содержащие указанный OID политики.
     */
    CAPICOM_CERTIFICATE_FIND_CERTIFICATE_POLICY: 8,
    /**
     * @constant {Number} CAPICOM_CERTIFICATE_FIND_TIME_VALID Возвращает действующие на текущее время сертификаты.
     */
    CAPICOM_CERTIFICATE_FIND_TIME_VALID: 9,
    /**
     * @constant {Number} CAPICOM_CERTIFICATE_FIND_TIME_NOT_YET_VALID Возвращает сертификаты, время которых невалидно.
     */
    CAPICOM_CERTIFICATE_FIND_TIME_NOT_YET_VALID: 10,
    /**
     * @constant {Number} CAPICOM_CERTIFICATE_FIND_TIME_EXPIRED Возвращает просроченные сертификаты.
     */
    CAPICOM_CERTIFICATE_FIND_TIME_EXPIRED: 11,
    /**
     * @constant {Number} CAPICOM_CERTIFICATE_FIND_KEY_USAGE
     * Возвращает сертификаты, содержащие ключи, которые могут быть использованны указанным способом.
     */
    CAPICOM_CERTIFICATE_FIND_KEY_USAGE: 12,
    /**
     * @constant {Number} CAPICOM_DIGITAL_SIGNATURE_KEY_USAGE Ключ может быть использован для создания цифровой подписи.
     */
    CAPICOM_DIGITAL_SIGNATURE_KEY_USAGE: 128,
    /**
     * @constant {Number} CAPICOM_PROPID_ENHKEY_USAGE EKU.
     */
    CAPICOM_PROPID_ENHKEY_USAGE: 9,
    /**
     * @constant {Number} CAPICOM_PROPID_KEY_PROV_INFO информация о ключе
     */
    CAPICOM_PROPID_KEY_PROV_INFO: 2,
    /**
     * @constant {Number} CAPICOM_OID_OTHER Объект не соответствует ни одному из предуставленных типов.
     */
    CAPICOM_OID_OTHER: 0,
    /**
     * @constant {Number} CAPICOM_OID_KEY_USAGE_EXTENSION Расширение сертификата, содержащее информацию о назначении открытого ключа.
     */
    CAPICOM_OID_KEY_USAGE_EXTENSION: 10,
    /**
     * @constant {Number} CAPICOM_EKU_OTHER Сертификат может быть использован для чего-то, что не предустановлено.
     */
    CAPICOM_EKU_OTHER: 0,
    /**
     * @constant {Number} CAPICOM_EKU_SERVER_AUTH Сертификат может быть использован для аутентификации сервера.
     */
    CAPICOM_EKU_SERVER_AUTH: 1,
    /**
     * @constant {Number} CAPICOM_EKU_CLIENT_AUTH Сертификат может быть использован для аутентификации клиента.
     */
    CAPICOM_EKU_CLIENT_AUTH: 2,
    /**
     * @constant {Number} CAPICOM_EKU_CODE_SIGNING Сертификат может быть использован для создания цифровой подписи.
     */
    CAPICOM_EKU_CODE_SIGNING: 3,
    /**
     * @constant {Number} CAPICOM_EKU_EMAIL_PROTECTION Сертификат может быть использован для защиты электронной подписи.
     */
    CAPICOM_EKU_EMAIL_PROTECTION: 4,
    /**
     * @constant {Number} CAPICOM_EKU_SMARTCARD_LOGON Сертификат может быть использован для входа со смарт карты.
     */
    CAPICOM_EKU_SMARTCARD_LOGON: 5,
    /**
     * @constant {Number} CAPICOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME Время подписи.
     */
    CAPICOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME: 0
  };
});