//#region src/lib/cadesplugin_api.js
(function() {
	if (window.cadesplugin) return;
	var pluginObject;
	var plugin_resolved = 0;
	var plugin_reject;
	var plugin_resolve;
	var isOpera = 0;
	var isFireFox = 0;
	var isEdge = 0;
	var isSafari = 0;
	var isYandex = 0;
	var cadesplugin_loaded_event_recieved = false;
	var isFireFoxExtensionLoaded = false;
	var canPromise = !!window.Promise;
	var cadesplugin;
	if (canPromise) cadesplugin = new Promise(function(resolve, reject) {
		plugin_resolve = resolve;
		plugin_reject = reject;
	});
	else cadesplugin = {};
	function check_browser() {
		var ua = navigator.userAgent, tem, M = ua.match(/(opera|yabrowser|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
		if (/trident/i.test(M[1])) {
			tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
			return {
				name: "IE",
				version: tem[1] || ""
			};
		}
		if (M[1] === "Chrome") {
			tem = ua.match(/\b(OPR|Edg|Edge|YaBrowser)\/(\d+)/);
			if (tem != null) return {
				name: tem[1].replace("OPR", "Opera"),
				version: tem[2]
			};
		}
		M = M[2] ? [M[1], M[2]] : [
			navigator.appName,
			navigator.appVersion,
			"-?"
		];
		if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
		return {
			name: M[0],
			version: M[1]
		};
	}
	var browserSpecs = check_browser();
	function cpcsp_console_log(level, msg) {
		if (typeof console === "undefined") return;
		if (level <= cadesplugin.current_log_level) {
			if (level === cadesplugin.LOG_LEVEL_DEBUG) console.log("DEBUG: %s", msg);
			if (level === cadesplugin.LOG_LEVEL_INFO) console.info("INFO: %s", msg);
			if (level === cadesplugin.LOG_LEVEL_ERROR) console.error("ERROR: %s", msg);
			return;
		}
	}
	function set_log_level(level) {
		if (!(level === cadesplugin.LOG_LEVEL_DEBUG || level === cadesplugin.LOG_LEVEL_INFO || level === cadesplugin.LOG_LEVEL_ERROR)) {
			cpcsp_console_log(cadesplugin.LOG_LEVEL_ERROR, "cadesplugin_api.js: Incorrect log_level: " + level);
			return;
		}
		cadesplugin.current_log_level = level;
		if (cadesplugin.current_log_level === cadesplugin.LOG_LEVEL_DEBUG) cpcsp_console_log(cadesplugin.LOG_LEVEL_INFO, "cadesplugin_api.js: log_level = DEBUG");
		if (cadesplugin.current_log_level === cadesplugin.LOG_LEVEL_INFO) cpcsp_console_log(cadesplugin.LOG_LEVEL_INFO, "cadesplugin_api.js: log_level = INFO");
		if (cadesplugin.current_log_level === cadesplugin.LOG_LEVEL_ERROR) cpcsp_console_log(cadesplugin.LOG_LEVEL_INFO, "cadesplugin_api.js: log_level = ERROR");
		if (isNativeMessageSupported()) {
			if (cadesplugin.current_log_level === cadesplugin.LOG_LEVEL_DEBUG) window.postMessage("set_log_level=debug", "*");
			if (cadesplugin.current_log_level === cadesplugin.LOG_LEVEL_INFO) window.postMessage("set_log_level=info", "*");
			if (cadesplugin.current_log_level === cadesplugin.LOG_LEVEL_ERROR) window.postMessage("set_log_level=error", "*");
		}
	}
	function set_constantValues() {
		cadesplugin.CAPICOM_LOCAL_MACHINE_STORE = 1;
		cadesplugin.CAPICOM_CURRENT_USER_STORE = 2;
		cadesplugin.CADESCOM_LOCAL_MACHINE_STORE = 1;
		cadesplugin.CADESCOM_CURRENT_USER_STORE = 2;
		cadesplugin.CADESCOM_CONTAINER_STORE = 100;
		cadesplugin.CAPICOM_MY_STORE = "My";
		cadesplugin.CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED = 2;
		cadesplugin.CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME = 1;
		cadesplugin.CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED = 0;
		cadesplugin.CADESCOM_XML_SIGNATURE_TYPE_ENVELOPING = 1;
		cadesplugin.CADESCOM_XML_SIGNATURE_TYPE_TEMPLATE = 2;
		cadesplugin.XmlDsigGost3410UrlObsolete = "http://www.w3.org/2001/04/xmldsig-more#gostr34102001-gostr3411";
		cadesplugin.XmlDsigGost3411UrlObsolete = "http://www.w3.org/2001/04/xmldsig-more#gostr3411";
		cadesplugin.XmlDsigGost3410Url = "urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr34102001-gostr3411";
		cadesplugin.XmlDsigGost3411Url = "urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr3411";
		cadesplugin.CADESCOM_CADES_DEFAULT = 0;
		cadesplugin.CADESCOM_CADES_BES = 1;
		cadesplugin.CADESCOM_CADES_T = 5;
		cadesplugin.CADESCOM_CADES_X_LONG_TYPE_1 = 93;
		cadesplugin.CADESCOM_ENCODE_BASE64 = 0;
		cadesplugin.CADESCOM_ENCODE_BINARY = 1;
		cadesplugin.CADESCOM_ENCODE_ANY = -1;
		cadesplugin.CAPICOM_CERTIFICATE_INCLUDE_CHAIN_EXCEPT_ROOT = 0;
		cadesplugin.CAPICOM_CERTIFICATE_INCLUDE_WHOLE_CHAIN = 1;
		cadesplugin.CAPICOM_CERTIFICATE_INCLUDE_END_ENTITY_ONLY = 2;
		cadesplugin.CAPICOM_CERT_INFO_SUBJECT_SIMPLE_NAME = 0;
		cadesplugin.CAPICOM_CERT_INFO_ISSUER_SIMPLE_NAME = 1;
		cadesplugin.CAPICOM_CERTIFICATE_FIND_SHA1_HASH = 0;
		cadesplugin.CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME = 1;
		cadesplugin.CAPICOM_CERTIFICATE_FIND_ISSUER_NAME = 2;
		cadesplugin.CAPICOM_CERTIFICATE_FIND_ROOT_NAME = 3;
		cadesplugin.CAPICOM_CERTIFICATE_FIND_TEMPLATE_NAME = 4;
		cadesplugin.CAPICOM_CERTIFICATE_FIND_EXTENSION = 5;
		cadesplugin.CAPICOM_CERTIFICATE_FIND_EXTENDED_PROPERTY = 6;
		cadesplugin.CAPICOM_CERTIFICATE_FIND_APPLICATION_POLICY = 7;
		cadesplugin.CAPICOM_CERTIFICATE_FIND_CERTIFICATE_POLICY = 8;
		cadesplugin.CAPICOM_CERTIFICATE_FIND_TIME_VALID = 9;
		cadesplugin.CAPICOM_CERTIFICATE_FIND_TIME_NOT_YET_VALID = 10;
		cadesplugin.CAPICOM_CERTIFICATE_FIND_TIME_EXPIRED = 11;
		cadesplugin.CAPICOM_CERTIFICATE_FIND_KEY_USAGE = 12;
		cadesplugin.CAPICOM_DIGITAL_SIGNATURE_KEY_USAGE = 128;
		cadesplugin.CAPICOM_PROPID_ENHKEY_USAGE = 9;
		cadesplugin.CAPICOM_OID_OTHER = 0;
		cadesplugin.CAPICOM_OID_KEY_USAGE_EXTENSION = 10;
		cadesplugin.CAPICOM_EKU_CLIENT_AUTH = 2;
		cadesplugin.CAPICOM_EKU_SMARTCARD_LOGON = 5;
		cadesplugin.CAPICOM_EKU_OTHER = 0;
		cadesplugin.CAPICOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME = 0;
		cadesplugin.CADESCOM_AUTHENTICATED_ATTRIBUTE_DOCUMENT_NAME = 1;
		cadesplugin.CADESCOM_AUTHENTICATED_ATTRIBUTE_DOCUMENT_DESCRIPTION = 2;
		cadesplugin.CADESCOM_ATTRIBUTE_OTHER = -1;
		cadesplugin.CADESCOM_STRING_TO_UCS2LE = 0;
		cadesplugin.CADESCOM_BASE64_TO_BINARY = 1;
		cadesplugin.CADESCOM_DISPLAY_DATA_NONE = 0;
		cadesplugin.CADESCOM_DISPLAY_DATA_CONTENT = 1;
		cadesplugin.CADESCOM_DISPLAY_DATA_ATTRIBUTE = 2;
		cadesplugin.CADESCOM_ENCRYPTION_ALGORITHM_RC2 = 0;
		cadesplugin.CADESCOM_ENCRYPTION_ALGORITHM_RC4 = 1;
		cadesplugin.CADESCOM_ENCRYPTION_ALGORITHM_DES = 2;
		cadesplugin.CADESCOM_ENCRYPTION_ALGORITHM_3DES = 3;
		cadesplugin.CADESCOM_ENCRYPTION_ALGORITHM_AES = 4;
		cadesplugin.CADESCOM_ENCRYPTION_ALGORITHM_GOST_28147_89 = 25;
		cadesplugin.CADESCOM_HASH_ALGORITHM_SHA1 = 0;
		cadesplugin.CADESCOM_HASH_ALGORITHM_MD2 = 1;
		cadesplugin.CADESCOM_HASH_ALGORITHM_MD4 = 2;
		cadesplugin.CADESCOM_HASH_ALGORITHM_MD5 = 3;
		cadesplugin.CADESCOM_HASH_ALGORITHM_SHA_256 = 4;
		cadesplugin.CADESCOM_HASH_ALGORITHM_SHA_384 = 5;
		cadesplugin.CADESCOM_HASH_ALGORITHM_SHA_512 = 6;
		cadesplugin.CADESCOM_HASH_ALGORITHM_CP_GOST_3411 = 100;
		cadesplugin.CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_256 = 101;
		cadesplugin.CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_512 = 102;
		cadesplugin.LOG_LEVEL_DEBUG = 4;
		cadesplugin.LOG_LEVEL_INFO = 2;
		cadesplugin.LOG_LEVEL_ERROR = 1;
		cadesplugin.CADESCOM_AllowNone = 0;
		cadesplugin.CADESCOM_AllowNoOutstandingRequest = 1;
		cadesplugin.CADESCOM_AllowUntrustedCertificate = 2;
		cadesplugin.CADESCOM_AllowUntrustedRoot = 4;
		cadesplugin.CADESCOM_SkipInstallToStore = 268435456;
	}
	function async_spawn(generatorFunc) {
		function continuer(verb, arg) {
			var result;
			try {
				result = generator[verb](arg);
			} catch (err) {
				return Promise.reject(err);
			}
			if (result.done) return result.value;
			else return Promise.resolve(result.value).then(onFulfilled, onRejected);
		}
		var generator = generatorFunc(Array.prototype.slice.call(arguments, 1));
		var onFulfilled = continuer.bind(continuer, "next");
		var onRejected = continuer.bind(continuer, "throw");
		return onFulfilled();
	}
	function isIE() {
		return browserSpecs.name === "IE" || browserSpecs.name === "MSIE";
	}
	function isIOS() {
		return navigator.userAgent.match(/ipod/i) || navigator.userAgent.match(/ipad/i) || navigator.userAgent.match(/iphone/i);
	}
	function isNativeMessageSupported() {
		if (isIE()) return false;
		if (browserSpecs.name === "Edge") {
			isEdge = true;
			return true;
		}
		if (browserSpecs.name === "Edg") return true;
		if (browserSpecs.name === "YaBrowser") {
			isYandex = true;
			return true;
		}
		if (browserSpecs.name === "Opera") {
			isOpera = true;
			if (browserSpecs.version >= 33) return true;
			else return false;
		}
		if (browserSpecs.name === "Firefox") {
			isFireFox = true;
			if (browserSpecs.version >= 52) return true;
			else return false;
		}
		if (browserSpecs.name === "Chrome") {
			if (browserSpecs.version >= 42) return true;
			else return false;
		}
		if (browserSpecs.name === "Safari") {
			isSafari = true;
			return browserSpecs.version >= 12;
		}
	}
	function CreateObject(name) {
		if (isIOS()) return call_ru_cryptopro_npcades_10_native_bridge("CreateObject", [name]);
		if (isIE()) {
			if (name.match(/X509Enrollment/i)) try {
				return document.getElementById("certEnrollClassFactory").CreateObject(name);
			} catch (e) {
				throw "Для создания обьектов X509Enrollment следует настроить веб-узел на использование проверки подлинности по протоколу HTTPS";
			}
			try {
				return document.getElementById("webClassFactory").CreateObject(name);
			} catch (e) {
				return new ActiveXObject(name);
			}
		}
		return pluginObject.CreateObject(name);
	}
	function decimalToHexString(number) {
		if (number < 0) number = 4294967295 + number + 1;
		return number.toString(16).toUpperCase();
	}
	function GetMessageFromException(e) {
		var err = e.message;
		if (!err) err = e;
		else if (e.number) err += " (0x" + decimalToHexString(e.number) + ")";
		return err;
	}
	function getLastError(exception) {
		if (isNativeMessageSupported() || isIE() || isIOS()) return GetMessageFromException(exception);
		try {
			return pluginObject.getLastError();
		} catch (e) {
			return GetMessageFromException(exception);
		}
	}
	function ReleasePluginObjects() {
		return cpcsp_chrome_nmcades.ReleasePluginObjects();
	}
	function CreateObjectAsync(name) {
		return pluginObject.CreateObjectAsync(name);
	}
	var ru_cryptopro_npcades_10_native_bridge = {
		callbacksCount: 1,
		callbacks: {},
		resultForCallback: function resultForCallback(callbackId, resultArray) {
			var callback = ru_cryptopro_npcades_10_native_bridge.callbacks[callbackId];
			if (!callback) return;
			callback.apply(null, resultArray);
		},
		call: function call(functionName, args, callback) {
			var hasCallback = callback && typeof callback === "function";
			var callbackId = hasCallback ? ru_cryptopro_npcades_10_native_bridge.callbacksCount++ : 0;
			if (hasCallback) ru_cryptopro_npcades_10_native_bridge.callbacks[callbackId] = callback;
			var iframe = document.createElement("IFRAME");
			var arrObjs = new Array("_CPNP_handle");
			try {
				iframe.setAttribute("src", "cpnp-js-call:" + functionName + ":" + callbackId + ":" + encodeURIComponent(JSON.stringify(args, arrObjs)));
			} catch (e) {
				alert(e);
			}
			document.documentElement.appendChild(iframe);
			iframe.parentNode.removeChild(iframe);
			iframe = null;
		}
	};
	function call_ru_cryptopro_npcades_10_native_bridge(functionName, array) {
		var tmpobj;
		var ex;
		ru_cryptopro_npcades_10_native_bridge.call(functionName, array, function(e, response) {
			ex = e;
			var str = "tmpobj=" + response;
			eval(str);
			if (typeof tmpobj === "string") {
				tmpobj = tmpobj.replace(/\\\n/gm, "\n");
				tmpobj = tmpobj.replace(/\\\r/gm, "\r");
			}
		});
		if (ex) throw ex;
		return tmpobj;
	}
	function show_firefox_missing_extension_dialog() {
		if (!window.cadesplugin_skip_extension_install) {
			var ovr = document.createElement("div");
			ovr.id = "cadesplugin_ovr";
			ovr.style = "visibility: hidden; position: fixed; left: 0px; top: 0px; width:100%; height:100%; background-color: rgba(0,0,0,0.7)";
			ovr.innerHTML = "<div id='cadesplugin_ovr_item' style='position:relative; width:400px; margin:100px auto; background-color:#fff; border:2px solid #000; padding:10px; text-align:center; opacity: 1; z-index: 1500'><button id='cadesplugin_close_install' style='float: right; font-size: 10px; background: transparent; border: 1; margin: -5px'>X</button><p>Для работы КриптоПро ЭЦП Browser plugin на данном сайте необходимо расширение для браузера. Убедитесь, что оно у Вас включено или установите его.<p><a href='https://www.cryptopro.ru/sites/default/files/products/cades/extensions/firefox_cryptopro_extension_latest.xpi'>Скачать расширение</a></p></div>";
			document.getElementsByTagName("Body")[0].appendChild(ovr);
			document.getElementById("cadesplugin_close_install").addEventListener("click", function() {
				plugin_loaded_error("Плагин недоступен");
				document.getElementById("cadesplugin_ovr").style.visibility = "hidden";
			});
			ovr.addEventListener("click", function() {
				plugin_loaded_error("Плагин недоступен");
				document.getElementById("cadesplugin_ovr").style.visibility = "hidden";
			});
			ovr.style.visibility = "visible";
		}
	}
	function install_opera_extension() {
		if (!window.cadesplugin_skip_extension_install) document.addEventListener("DOMContentLoaded", function() {
			var ovr = document.createElement("div");
			ovr.id = "cadesplugin_ovr";
			ovr.style = "visibility: hidden; position: fixed; left: 0px; top: 0px; width:100%; height:100%; background-color: rgba(0,0,0,0.7)";
			ovr.innerHTML = "<div id='cadesplugin_ovr_item' style='position:relative; width:400px; margin:100px auto; background-color:#fff; border:2px solid #000; padding:10px; text-align:center; opacity: 1; z-index: 1500'><button id='cadesplugin_close_install' style='float: right; font-size: 10px; background: transparent; border: 1; margin: -5px'>X</button><p>Для работы КриптоПро ЭЦП Browser plugin на данном сайте необходимо установить расширение из каталога дополнений Opera.<p><button id='cadesplugin_install' style='font:12px Arial'>Установить расширение</button></p></div>";
			document.getElementsByTagName("Body")[0].appendChild(ovr);
			document.getElementById("cadesplugin_install").addEventListener("click", function(event) {
				opr.addons.installExtension("epebfcehmdedogndhlcacafjaacknbcm", function() {
					document.getElementById("cadesplugin_ovr").style.visibility = "hidden";
					location.reload();
				}, function() {});
			});
			document.getElementById("cadesplugin_close_install").addEventListener("click", function() {
				plugin_loaded_error("Плагин недоступен");
				document.getElementById("cadesplugin_ovr").style.visibility = "hidden";
			});
			ovr.addEventListener("click", function() {
				plugin_loaded_error("Плагин недоступен");
				document.getElementById("cadesplugin_ovr").style.visibility = "hidden";
			});
			ovr.style.visibility = "visible";
			document.getElementById("cadesplugin_ovr_item").addEventListener("click", function(e) {
				e.stopPropagation();
			});
		});
		else plugin_loaded_error("Плагин недоступен");
	}
	function firefox_or_edge_nmcades_onload() {
		if (window.cadesplugin_extension_loaded_callback) window.cadesplugin_extension_loaded_callback();
		isFireFoxExtensionLoaded = true;
		cpcsp_chrome_nmcades.check_chrome_plugin(plugin_loaded, plugin_loaded_error);
	}
	function load_js_script(url, successFunc, errorFunc) {
		var script = document.createElement("script");
		script.setAttribute("type", "text/javascript");
		script.setAttribute("src", url);
		script.onerror = errorFunc;
		script.onload = successFunc;
		document.getElementsByTagName("head")[0].appendChild(script);
	}
	function nmcades_api_onload() {
		if (!isIE() && !isFireFox && !isSafari && !isEdge) {
			if (window.cadesplugin_extension_loaded_callback) window.cadesplugin_extension_loaded_callback();
		}
		window.postMessage("cadesplugin_echo_request", "*");
		window.addEventListener("message", function(event) {
			if (typeof event.data !== "string" || !event.data.match("cadesplugin_loaded")) return;
			if (cadesplugin_loaded_event_recieved) return;
			if (isFireFox || isSafari || isEdge) {
				var url = event.data.substring(event.data.indexOf("url:") + 4);
				if (!isEdge && !url.match("^(moz|safari)-extension://[a-zA-Z0-9/_-]+/nmcades_plugin_api.js$")) {
					plugin_loaded_error();
					return;
				}
				load_js_script(url, firefox_or_edge_nmcades_onload, plugin_loaded_error);
			} else cpcsp_chrome_nmcades.check_chrome_plugin(plugin_loaded, plugin_loaded_error);
			cadesplugin_loaded_event_recieved = true;
		}, false);
	}
	function load_extension() {
		if (isFireFox || isSafari || isEdge) {
			nmcades_api_onload();
			return;
		}
		var operaUrl = "chrome-extension://epebfcehmdedogndhlcacafjaacknbcm/nmcades_plugin_api.js";
		var manifestv2Url = "chrome-extension://iifchhfnnmpdbibifmljnfjhpififfog/nmcades_plugin_api.js";
		var manifestv3Url = "chrome-extension://pfhgbfnnjiafkhfdkmpiflachepdcjod/nmcades_plugin_api.js";
		if (isYandex) {
			load_js_script(operaUrl, nmcades_api_onload, function() {
				load_js_script(manifestv2Url, nmcades_api_onload, function() {
					load_js_script(manifestv3Url, nmcades_api_onload, plugin_loaded_error);
				});
			});
			return;
		}
		if (isOpera) {
			load_js_script(manifestv2Url, nmcades_api_onload, function() {
				load_js_script(operaUrl, nmcades_api_onload, function() {
					load_js_script(manifestv3Url, nmcades_api_onload, plugin_loaded_error);
				});
			});
			return;
		}
		load_js_script(manifestv2Url, nmcades_api_onload, function() {
			load_js_script(manifestv3Url, nmcades_api_onload, plugin_loaded_error);
		});
	}
	function load_npapi_plugin() {
		var elem = document.createElement("object");
		elem.setAttribute("id", "cadesplugin_object");
		elem.setAttribute("type", "application/x-cades");
		elem.setAttribute("style", "visibility: hidden");
		document.getElementsByTagName("body")[0].appendChild(elem);
		pluginObject = document.getElementById("cadesplugin_object");
		if (isIE()) {
			var elem1 = document.createElement("object");
			elem1.setAttribute("id", "certEnrollClassFactory");
			elem1.setAttribute("classid", "clsid:884e2049-217d-11da-b2a4-000e7bbb2b09");
			elem1.setAttribute("style", "visibility: hidden");
			document.getElementsByTagName("body")[0].appendChild(elem1);
			var elem2 = document.createElement("object");
			elem2.setAttribute("id", "webClassFactory");
			elem2.setAttribute("classid", "clsid:B04C8637-10BD-484E-B0DA-B8A039F60024");
			elem2.setAttribute("style", "visibility: hidden");
			document.getElementsByTagName("body")[0].appendChild(elem2);
		}
	}
	function plugin_loaded() {
		plugin_resolved = 1;
		if (window.cadesplugin_plugin_loaded_callback) window.cadesplugin_plugin_loaded_callback();
		if (canPromise) plugin_resolve();
		else window.postMessage("cadesplugin_loaded", "*");
	}
	function plugin_loaded_error(msg, noThrow) {
		if (typeof msg === "undefined" || typeof msg === "object") msg = "Плагин недоступен";
		plugin_resolved = 1;
		if (canPromise) {
			if (noThrow) console.error(msg);
			else plugin_reject(msg);
		} else window.postMessage("cadesplugin_load_error", "*");
	}
	function check_load_timeout() {
		if (plugin_resolved === 1) return;
		if (isFireFox && !isFireFoxExtensionLoaded) show_firefox_missing_extension_dialog();
		plugin_resolved = 1;
		if (window.cadesplugin_timeout_failed_callback) window.cadesplugin_timeout_failed_callback();
		if (canPromise) plugin_reject("Истекло время ожидания загрузки плагина");
		else window.postMessage("cadesplugin_load_error", "*");
	}
	function createPromise(arg) {
		return new Promise(arg);
	}
	function check_npapi_plugin() {
		try {
			var oAbout = CreateObject("CAdESCOM.About");
			plugin_loaded();
		} catch (err) {
			document.getElementById("cadesplugin_object").style.display = "none";
			var mimetype = navigator.mimeTypes && navigator.mimeTypes["application/x-cades"];
			if (mimetype) {
				if (mimetype.enabledPlugin) plugin_loaded_error("Плагин загружен, но не создаются обьекты");
				else plugin_loaded_error("Ошибка при загрузке плагина");
			} else plugin_loaded_error("Плагин недоступен", true);
		}
	}
	function check_plugin_working() {
		var div = document.createElement("div");
		div.innerHTML = "<!--[if lt IE 9]><iecheck></iecheck><![endif]-->";
		if (div.getElementsByTagName("iecheck").length === 1) {
			plugin_loaded_error("Internet Explorer версии 8 и ниже не поддерживается");
			return;
		}
		if (isNativeMessageSupported()) load_extension();
		else if (!canPromise) window.addEventListener("message", function(event) {
			if (event.data !== "cadesplugin_echo_request") return;
			load_npapi_plugin();
			check_npapi_plugin();
		}, false);
		else if (document.readyState === "complete") {
			load_npapi_plugin();
			check_npapi_plugin();
		} else window.addEventListener("load", function(event) {
			load_npapi_plugin();
			check_npapi_plugin();
		}, false);
	}
	function set_pluginObject(obj) {
		pluginObject = obj;
	}
	function set_load_timeout() {
		if (window.cadesplugin_load_timeout) setTimeout(check_load_timeout, window.cadesplugin_load_timeout);
		else setTimeout(check_load_timeout, 2e4);
	}
	var onVisibilityChange = function() {
		if (document.hidden === false) {
			document.removeEventListener("visibilitychange", onVisibilityChange);
			set_load_timeout();
			check_plugin_working();
		}
	};
	cadesplugin.JSModuleVersion = "2.1.1";
	cadesplugin.async_spawn = async_spawn;
	cadesplugin.set = set_pluginObject;
	cadesplugin.set_log_level = set_log_level;
	cadesplugin.getLastError = getLastError;
	if (isNativeMessageSupported()) {
		cadesplugin.CreateObjectAsync = CreateObjectAsync;
		cadesplugin.ReleasePluginObjects = ReleasePluginObjects;
	}
	if (!isNativeMessageSupported()) cadesplugin.CreateObject = CreateObject;
	set_constantValues();
	cadesplugin.current_log_level = cadesplugin.LOG_LEVEL_ERROR;
	window.cadesplugin = cadesplugin;
	if (isSafari && document.hidden) {
		document.addEventListener("visibilitychange", onVisibilityChange);
		return;
	}
	set_load_timeout();
	check_plugin_working();
	return cadesplugin;
})();
//#endregion
//#region src/certificateAdjuster.js
/**
* @description объект, в котором собираются данные о сертификате и методы по работе с этими данными
*/
var CertificateAdjuster = Object.create(null);
/**
* @method init
* @param {Object} currentCert
* @description конструктор
*/
CertificateAdjuster.init = function init(currentCert) {
	const { certApi, issuerInfo, privateKey, serialNumber, thumbprint, subjectInfo, validPeriod } = currentCert;
	this.certApi = certApi;
	this.issuerInfo = issuerInfo;
	this.privateKey = privateKey;
	this.serialNumber = serialNumber;
	this.thumbprint = thumbprint;
	this.subjectInfo = subjectInfo;
	this.validPeriod = validPeriod;
};
/**
* @method getInfo
* @param {String} subjectIssuer раздел информации 'issuerInfo' или 'subjectInfo'
* @returns {Object}
* @throws {Error}
* @description возвращает объект из сформированных значений в формате key: value
*/
CertificateAdjuster.getInfo = function getInfo(subjectIssuer) {
	if (!this[subjectIssuer]) throw new Error("Не верно указан аттрибут");
	const subjectIssuerArr = this[subjectIssuer].split(", ");
	const _possibleInfo = this.possibleInfo(subjectIssuer);
	const formedSubjectIssuerInfo = {};
	subjectIssuerArr.map((tag) => {
		const tagArr = tag.split("=");
		tagArr[0] = `${tagArr[0]}=`;
		formedSubjectIssuerInfo[_possibleInfo[tagArr[0]]] = tagArr[1];
	});
	return formedSubjectIssuerInfo;
};
/**
* @method getSubjectInfo
* @returns {Object}
* @description возвращает распаршенную информацию о строке subjectInfo в формате key: value
*/
CertificateAdjuster.getSubjectInfo = function getSubjectInfo() {
	return this.getInfo("subjectInfo");
};
/**
* @method friendlyInfo
* @param {String} subjectIssuer раздел информации 'issuerInfo' или 'subjectInfo'
* @returns {Object}
* @throws {Error}
* @description возврящает объект из сформированных значений
*/
CertificateAdjuster.friendlyInfo = function friendlyInfo(subjectIssuer) {
	if (!this[subjectIssuer]) throw new Error("Не верно указан аттрибут");
	const subjectIssuerArr = this[subjectIssuer].split(", ");
	const _possibleInfo = this.possibleInfo(subjectIssuer);
	return subjectIssuerArr.map((tag) => {
		const tagArr = tag.split("=");
		tagArr[0] = `${tagArr[0]}=`;
		return {
			text: tagArr[1],
			value: _possibleInfo[tagArr[0]]
		};
	});
};
/**
* @method friendlySubjectInfo
* @returns {Array}
* @description возвращает распаршенную информацию о строке subjectInfo
*/
CertificateAdjuster.friendlySubjectInfo = function friendlySubjectInfo() {
	return this.friendlyInfo("subjectInfo");
};
/**
* @method friendlyIssuerInfo
* @returns {Array}
* @description возвращает распаршенную информацию о строке issuerInfo
*/
CertificateAdjuster.friendlyIssuerInfo = function friendlyIssuerInfo() {
	return this.friendlyInfo("issuerInfo");
};
/**
* @method friendlyValidPeriod
* @returns {Object}
* @description возвращает распаршенную информацию об объекте validPeriod
*/
CertificateAdjuster.friendlyValidPeriod = function friendlyValidPeriod() {
	const { from, to } = this.validPeriod;
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
	const attrs = {
		"UnstructuredName=": "Неструктурированное имя",
		"E=": "Email",
		"C=": "Страна",
		"S=": "Регион",
		"L=": "Город",
		"STREET=": "Адрес",
		"O=": "Компания",
		"T=": "Должность",
		"ОГРНИП=": "ОГРНИП",
		"OGRNIP=": "ОГРНИП",
		"SNILS=": "СНИЛС",
		"СНИЛС=": "СНИЛС",
		"INN=": "ИНН",
		"ИНН=": "ИНН",
		"ИНН ЮЛ=": "ИНН_ЮЛ",
		"ОГРН=": "ОГРН",
		"OGRN=": "ОГРН"
	};
	switch (subjectIssuer) {
		case "subjectInfo":
			attrs["SN="] = "Фамилия";
			attrs["G="] = "Имя/Отчество";
			attrs["CN="] = "Владелец";
			attrs["OU="] = "Отдел/подразделение";
			return attrs;
		case "issuerInfo":
			attrs["CN="] = "Удостоверяющий центр";
			attrs["OU="] = "Тип";
			return attrs;
		default: throw new Error("Не верно указан кейс получаемых данных");
	}
};
/**
* @function friendlyDate
* @param {String} date строка с датой
* @returns {Object}
* @description формирует дату от переданного пареметра
*/
CertificateAdjuster.friendlyDate = function friendlyDate(date) {
	const newDate = new Date(date);
	const [day, month, year] = [
		newDate.getDate(),
		newDate.getMonth() + 1,
		newDate.getFullYear()
	];
	const [hours, minutes, seconds] = [
		newDate.getHours(),
		newDate.getMinutes(),
		newDate.getSeconds()
	];
	return {
		ddmmyy: `${day}/${month}/${year}`,
		hhmmss: `${hours}:${minutes}:${seconds}`
	};
};
/**
* @async
* @method isValid
* @returns {Boolean} возвращает валидность сертификата
* @throws {Error} возвращает сообщение об ошибке
* @description прозиводит проверку на валидность сертификата
*/
CertificateAdjuster.isValid = async function isValid() {
	try {
		return await (await this.certApi.IsValid()).Result;
	} catch (error) {
		throw new Error(`Произошла ошибка при проверке валидности сертификата: ${error.message}`);
	}
};
//#endregion
//#region src/cadescomMethods.js
/**
* @description объект для создания асинхроннного/синхранного объекта методом cadesplugin
*/
var cadesMethods = Object.create(null);
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
cadesMethods.createObject = async function createObject(method) {
	return await window.cadesplugin.CreateObject ? await window.cadesplugin.CreateObject(method) : await window.cadesplugin.CreateObjectAsync(method);
};
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
	O_STORE: "CAdESCOM.Store",
	O_ATTS: "CADESCOM.CPAttribute",
	O_SIGNED_DATA: "CAdESCOM.CadesSignedData",
	O_SIGNER: "CAdESCOM.CPSigner",
	O_SIGNED_XML: "CAdESCOM.SignedXML",
	O_ABOUT: "CAdESCOM.About"
});
//#endregion
//#region src/constants/cadescom.js
var CADESCOM = {
	/**
	* @constant {Number} CADESCOM_STRING_TO_UCS2LE Данные будут перекодированы в UCS - 2 little endian.
	*/
	CADESCOM_STRING_TO_UCS2LE: 0,
	/**
	* @constant {Number} CADESCOM_BASE64_TO_BINARY Данные будут перекодированы из Base64 в бинарный массив.
	*/
	CADESCOM_BASE64_TO_BINARY: 1,
	/**
	* @constant {Number} CADESCOM_LOCAL_MACHINE_STORE Локальное хранилище компьютера.
	*/
	CADESCOM_LOCAL_MACHINE_STORE: 1,
	/**
	* @constant {Number} CADESCOM_CURRENT_USER_STORE Хранилище текущего пользователя.
	*/
	CADESCOM_CURRENT_USER_STORE: 2,
	/**
	* @constant {Number} CADESCOM_CONTAINER_STORE
	* Хранилище сертификатов в контейнерах закрытых ключей.В данный Store попадут все сертификаты из контейнеров закрытых ключей которые
	* доступны в системе в момент открытия.
	*/
	CADESCOM_CONTAINER_STORE: 100,
	/**
	* @constant {Number} CADESCOM_CADES_DEFAULT Тип подписи по умолчанию(CAdES - X Long Type 1).
	*/
	CADESCOM_CADES_DEFAULT: 0,
	/**
	* @constant {Number} CADESCOM_CADES_BES Тип подписи CAdES BES.
	*/
	CADESCOM_CADES_BES: 1,
	/**
	* @constant {Number} CADESCOM_CADES_T Тип подписи CAdES - T.
	*/
	CADESCOM_CADES_T: 5,
	/**
	* @constant {Number} CADESCOM_CADES_X_LONG_TYPE_1 Тип подписи CAdES - X Long Type 1.
	*/
	CADESCOM_CADES_X_LONG_TYPE_1: 93,
	/**
	* @constant {Number} CADESCOM_ENCODE_BASE64 Кодировка BASE64.
	*/
	CADESCOM_ENCODE_BASE64: 0,
	/**
	* @constant {Number} CADESCOM_ENCODE_BINARY Бинарные данные.
	*/
	CADESCOM_ENCODE_BINARY: 1,
	/**
	* @constant {Number} CADESCOM_AUTHENTICATED_ATTRIBUTE_DOCUMENT_NAME Название документа.
	*/
	CADESCOM_AUTHENTICATED_ATTRIBUTE_DOCUMENT_NAME: 1,
	/**
	* @constant {Number} CADESCOM_AUTHENTICATED_ATTRIBUTE_DOCUMENT_DESCRIPTION Описание документа.
	*/
	CADESCOM_AUTHENTICATED_ATTRIBUTE_DOCUMENT_DESCRIPTION: 2,
	/**
	* @constant {Number} CADESCOM_ATTRIBUTE_OTHER Прочие атрибуты.
	*/
	CADESCOM_ATTRIBUTE_OTHER: -1,
	/**
	* @constant {Number} CADESCOM_DISPLAY_DATA_NONE Данные не будут пересылаться в устройство.
	*/
	CADESCOM_DISPLAY_DATA_NONE: 0,
	/**
	* @constant {Number} CADESCOM_DISPLAY_DATA_CONTENT Отображаемые данные лежат в теле сообщения.
	*/
	CADESCOM_DISPLAY_DATA_CONTENT: 1,
	/**
	* @constant {Number} CADESCOM_DISPLAY_DATA_ATTRIBUTE Отображаемые данные лежат в подписанном атрибуте сообщения.
	*/
	CADESCOM_DISPLAY_DATA_ATTRIBUTE: 2,
	/**
	* @constant {Object} Алгоритм RSA
	*/
	CADESCOM_ENCRYPTION_ALGORITHM_RC: {
		/**
		* @constant {Number} RC2 Алгоритм RSA RC2.
		*/
		RC2: 0,
		/**
		* @constant {Number} RC4 Алгоритм RSA RC4.
		*/
		RC4: 1
	},
	/**
	* @constant {Number} CADESCOM_ENCRYPTION_ALGORITHM_DES Алгоритм DES.
	*/
	CADESCOM_ENCRYPTION_ALGORITHM_DES: 2,
	/**
	* @constant {Number} CADESCOM_ENCRYPTION_ALGORITHM_3DES Алгоритм 3 DES.
	*/
	CADESCOM_ENCRYPTION_ALGORITHM_3DES: 3,
	/**
	* @constant {Number} CADESCOM_ENCRYPTION_ALGORITHM_AES Алгоритм AES.
	*/
	CADESCOM_ENCRYPTION_ALGORITHM_AES: 4,
	/**
	* @constant {Number} CADESCOM_ENCRYPTION_ALGORITHM_GOST_28147_89 Алгоритм ГОСТ 28147 - 89.
	*/
	CADESCOM_ENCRYPTION_ALGORITHM_GOST_28147_89: 25,
	/**
	* @constant {Number} CADESCOM_HASH_ALGORITHM_SHA1 Алгоритм SHA1.
	*/
	CADESCOM_HASH_ALGORITHM_SHA1: 0,
	/**
	* @constant {Number} CADESCOM_HASH_ALGORITHM Алгоритм MD.
	*/
	CADESCOM_HASH_ALGORITHM: {
		/**
		* @constant {Number} CADESCOM_HASH_ALGORITHM_MD2 Алгоритм MD2.
		*/
		MD2: 1,
		/**
		* @constant {Number} CADESCOM_HASH_ALGORITHM_MD4 Алгоритм MD4.
		*/
		MD4: 2,
		/**
		* @constant {Number} CADESCOM_HASH_ALGORITHM_MD5 Алгоритм MD5.
		*/
		MD5: 3
	},
	/**
	* @constant {Number} CADESCOM_HASH_ALGORITHM_SHA_256 Алгоритм SHA1 с длиной ключа 256 бит.
	*/
	CADESCOM_HASH_ALGORITHM_SHA_256: 4,
	/**
	* @constant {Number} CADESCOM_HASH_ALGORITHM_SHA_384 Алгоритм SHA1 с длиной ключа 384 бита.
	*/
	CADESCOM_HASH_ALGORITHM_SHA_384: 5,
	/**
	* @constant {Number} CADESCOM_HASH_ALGORITHM_SHA_512 Алгоритм SHA1 с длиной ключа 512 бит.
	*/
	CADESCOM_HASH_ALGORITHM_SHA_512: 6,
	/**
	* @constant {Number} CADESCOM_HASH_ALGORITHM_CP_GOST_3411 Алгоритм ГОСТ Р 34.11 - 94.
	*/
	CADESCOM_HASH_ALGORITHM_CP_GOST_3411: 100,
	/**
	* @constant {Number} CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_256 Алгоритм ГОСТ Р 34.10 - 2012.
	*/
	CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_256: 101,
	/**
	* @constant {Number} CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_512 Алгоритм ГОСТ Р 34.10 - 2012.
	*/
	CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_512: 102,
	/**
	* @constant {Number} CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED Вложенная подпись.
	*/
	CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED: 0,
	/**
	* @constant {Number} CADESCOM_XML_SIGNATURE_TYPE_ENVELOPING Оборачивающая подпись.
	*/
	CADESCOM_XML_SIGNATURE_TYPE_ENVELOPING: 1,
	/**
	* @constant {Number} CADESCOM_XML_SIGNATURE_TYPE_TEMPLATE Подпись по шаблону.
	*/
	CADESCOM_XML_SIGNATURE_TYPE_TEMPLATE: 2
};
//#endregion
//#region src/constants/capicom.js
var CAPICOM = {
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
	CAPICOM_MY_STORE: "My",
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
//#endregion
//#region src/constants/XmlDsigGost.js
var XML_DSIG_GOST = {
	/**
	* @constant {String} XmlDsigGost3410Url Алгоритм подписи для XmlDsig.
	*/
	XmlDsigGost3410Url: "urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr34102001-gostr3411",
	/**
	* @constant {String} XmlDsigGost3411Url Алгоритм подписи для XmlDsig.
	*/
	XmlDsigGost3411Url: "urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr3411",
	/**
	* @constant {String} XmlDsigGost2012Url256 Алгоритм подписи для XmlDsig.
	*/
	XmlDsigGost2012Url256: "urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr34102012-gostr34112012-256",
	/**
	* @constant {String} XmlDsigGost2012Url256Digest Алгоритм подписи для XmlDsig.
	*/
	XmlDsigGost2012Url256Digest: "urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr34112012-256",
	/**
	* @constant {String} XmlDsigGost2012Url512 Алгоритм подписи для XmlDsig.
	*/
	XmlDsigGost2012Url512: "urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr34102012-gostr34112012-512",
	/**
	* @constant {String} XmlDsigGost2012Url512Digest Алгоритм подписи для XmlDsig.
	*/
	XmlDsigGost2012Url512Digest: "urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr34112012-512",
	/**
	* @constant {String} XmlDsigGost3410UrlObsolete Алгоритм подписи для XmlDsig.
	*/
	XmlDsigGost3410UrlObsolete: "http://www.w3.org/2001/04/xmldsig-more#gostr34102001-gostr3411",
	/**
	* @constant {String} XmlDsigGost3411UrlObsolete Алгоритм подписи для XmlDsig.
	*/
	XmlDsigGost3411UrlObsolete: "http://www.w3.org/2001/04/xmldsig-more#gostr3411"
};
//#endregion
//#region src/xmlSitnatureMethods.js
var { XmlDsigGost2012Url256, XmlDsigGost2012Url256Digest, XmlDsigGost2012Url512, XmlDsigGost2012Url512Digest, XmlDsigGost3410Url, XmlDsigGost3411Url } = XML_DSIG_GOST;
var { CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED: CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED$1, CADESCOM_XML_SIGNATURE_TYPE_ENVELOPING, CADESCOM_XML_SIGNATURE_TYPE_TEMPLATE } = CADESCOM;
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
			hashAlgorithm
		};
	};
}
/**
* @description объект предоставляет методы для выбора опций при подписании XML документа
*/
var xmlSitnatureMethods = Object.create(null);
/**
* @method xmlSitnatureType
* @param {Number} CADESCOM_XML_SIGNATURE_TYPE тип подписи XML кокумента
* @returns {Number}
* @throws {Error}
* @description выбирает значение константы для типа подписи XML документа
*/
xmlSitnatureMethods.doXmlSitnatureType = function doXmlSitnatureType(CADESCOM_XML_SIGNATURE_TYPE) {
	switch (CADESCOM_XML_SIGNATURE_TYPE) {
		case 0: return CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED$1;
		case 1: return CADESCOM_XML_SIGNATURE_TYPE_ENVELOPING;
		/**
		* @todo тип подписи CADESCOM_XML_SIGNATURE_TYPE_TEMPLATE на данном этапе не поддерживается
		* @description при выдове данного пипа будет ошибка
		*/
		case 2: return CADESCOM_XML_SIGNATURE_TYPE_TEMPLATE;
		default: throw new Error("Тип подписи не поддерживается");
	}
};
/**
* @method doXmlSitnatureAlgorithm
* @param {String} value алгоритм сертификата
* @returns {Object}
* @throws {Error}
* @description определяет алгоритм подписания XML документа в зависимости от алгоритма сертификата
*/
xmlSitnatureMethods.doXmlSitnatureAlgorithm = function doXmlSitnatureAlgorithm(value) {
	switch (value) {
		case "1.2.643.2.2.19": return template(XmlDsigGost3410Url)(XmlDsigGost3411Url);
		case "1.2.643.7.1.1.1.1": return template(XmlDsigGost2012Url256)(XmlDsigGost2012Url256Digest);
		case "1.2.643.7.1.1.1.2": return template(XmlDsigGost2012Url512)(XmlDsigGost2012Url512Digest);
		default: throw new Error("Сертификат не соответствует ГОСТ Р 34.10-2012 (256 или 512 бит) или ГОСТ Р 34.10-2001");
	}
};
var xmlSitnatureApi = Object.create(xmlSitnatureMethods);
var { doXmlSitnatureAlgorithm, doXmlSitnatureType } = xmlSitnatureApi;
//#endregion
//#region src/certificatesApi.js
var { CAPICOM_CURRENT_USER_STORE, CAPICOM_MY_STORE, CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED, CAPICOM_CERTIFICATE_FIND_SHA1_HASH, CAPICOM_CERTIFICATE_FIND_TIME_VALID, CAPICOM_CERTIFICATE_FIND_EXTENDED_PROPERTY, CAPICOM_PROPID_KEY_PROV_INFO, CAPICOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME, CAPICOM_CERTIFICATE_INCLUDE_END_ENTITY_ONLY } = CAPICOM;
var { CADESCOM_BASE64_TO_BINARY, CADESCOM_CADES_BES, CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED } = CADESCOM;
/**
* @description объект предоставляет методы для получения данных о сертификатах, а так же для их подписания
*/
var CertificatesApi = Object.create(null);
/**
* @async
* @method about
* @description выводит информацию
*/
CertificatesApi.about = async function about() {
	try {
		return await cadescomMethods.oAbout();
	} catch (error) {
		throw new Error(error.message);
	}
};
/**
* @async
* @method getCertsList
* @throws {Error}
* @description получает массив валидных сертификатов
*/
CertificatesApi.getCertsList = async function getCertsList() {
	try {
		const oStore = await cadescomMethods.oStore();
		await oStore.Open(CAPICOM_CURRENT_USER_STORE, CAPICOM_MY_STORE, CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED);
		const certificates = await oStore.Certificates;
		if (!certificates) throw new Error("Нет доступных сертификатов");
		const findCertsWithPrivateKey = await (await certificates.Find(CAPICOM_CERTIFICATE_FIND_TIME_VALID)).Find(CAPICOM_CERTIFICATE_FIND_EXTENDED_PROPERTY, CAPICOM_PROPID_KEY_PROV_INFO);
		const count = await findCertsWithPrivateKey.Count;
		if (!count) throw new Error("Нет сертификатов с приватным ключом");
		const createCertList = [];
		for (let index = 0; index < count; index++) {
			const certApi = await findCertsWithPrivateKey.Item(index + 1);
			const certificateAdjuster = Object.create(CertificateAdjuster);
			certificateAdjuster.init({
				certApi,
				issuerInfo: await certApi.IssuerName,
				privateKey: await certApi.PrivateKey,
				serialNumber: await certApi.SerialNumber,
				subjectInfo: await certApi.SubjectName,
				thumbprint: await certApi.Thumbprint,
				validPeriod: {
					from: await certApi.ValidFromDate,
					to: await certApi.ValidToDate
				}
			});
			createCertList.push(certificateAdjuster);
		}
		oStore.Close();
		return createCertList;
	} catch (error) {
		throw new Error(error.message);
	}
};
/**
* @async
* @method currentCadesCert
* @param {String} thumbprint значение сертификата
* @throws {Error}
* @description получает сертификат по thumbprint значению сертификата
*/
CertificatesApi.currentCadesCert = async function currentCadesCert(thumbprint) {
	try {
		if (!thumbprint) throw new Error("Не указано thumbprint значение сертификата");
		else if (typeof thumbprint !== "string") throw new Error("Не валидное значение thumbprint сертификата");
		const oStore = await cadescomMethods.oStore();
		await oStore.Open(CAPICOM_CURRENT_USER_STORE, CAPICOM_MY_STORE, CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED);
		const certificates = await oStore.Certificates;
		const count = await certificates.Count;
		const findCertificate = await certificates.Find(CAPICOM_CERTIFICATE_FIND_SHA1_HASH, thumbprint);
		if (count) {
			const certificateItem = await findCertificate.Item(1);
			oStore.Close();
			return certificateItem;
		} else throw new Error(`Произошла ошибка при получении сертификата по thumbprint значению: ${thumbprint}`);
	} catch (error) {
		throw new Error(error.message);
	}
};
/**
* @async
* @method getCert
* @param {String} thumbprint значение сертификата
* @throws {Error}
* @description
* Получает сертификат по thumbprint значению сертификата.
* В отличие от currentCadesCert использует для поиска коллбек функцию getCertsList
* С помощью этой функции в сертификате доступны методы из certificateAdjuster
*/
CertificatesApi.getCert = async function getCert(thumbprint) {
	try {
		if (!thumbprint) throw new Error("Не указано thumbprint значение сертификата");
		else if (typeof thumbprint !== "string") throw new Error("Не валидное значение thumbprint сертификата");
		const certList = await this.getCertsList();
		for (let index = 0; index < certList.length; index++) if (thumbprint === certList[index].thumbprint) return await certList[index];
		throw new Error(`Не найдено сертификата по thumbprint значению: ${thumbprint}`);
	} catch (error) {
		throw new Error(error.message);
	}
};
/**
* @async
* @method signBase64
* @param {String} thumbprint значение сертификата
* @param {String} base64 строка в формате base64
* @param {Boolean} type тип подписи true=откреплённая false=прикреплённая
* @throws {Error}
* @description подпись строки в формате base64
*/
CertificatesApi.signBase64 = async function signBase64(thumbprint, base64, type = true) {
	try {
		if (!thumbprint) throw new Error("Не указано thumbprint значение сертификата");
		else if (typeof thumbprint !== "string") throw new Error("Не валидное значение thumbprint сертификата");
		const oAttrs = await cadescomMethods.oAtts();
		const oSignedData = await cadescomMethods.oSignedData();
		const oSigner = await cadescomMethods.oSigner();
		const currentCert = await this.currentCadesCert(thumbprint);
		const authenticatedAttributes2 = await oSigner.AuthenticatedAttributes2;
		await oAttrs.propset_Name(CAPICOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME);
		await oAttrs.propset_Value(/* @__PURE__ */ new Date());
		await authenticatedAttributes2.Add(oAttrs);
		await oSignedData.propset_ContentEncoding(CADESCOM_BASE64_TO_BINARY);
		await oSignedData.propset_Content(base64);
		await oSigner.propset_Certificate(currentCert);
		await oSigner.propset_Options(CAPICOM_CERTIFICATE_INCLUDE_END_ENTITY_ONLY);
		return await oSignedData.SignCades(oSigner, CADESCOM_CADES_BES, type);
	} catch (error) {
		throw new Error(error.message);
	}
};
/**
* @async
* @method signXml
* @param {String} thumbprint значение сертификата
* @param {String} xml строка в формате XML
* @param {Number} CADESCOM_XML_SIGNATURE_TYPE тип подписи 0=Вложенная 1=Оборачивающая 2=по шаблону @default 0
* @description подписание XML документа
*/
CertificatesApi.signXml = async function signXml(thumbprint, xml, cadescomXmlSignatureType = CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED) {
	try {
		const currentCert = await this.currentCadesCert(thumbprint);
		const value = await (await (await currentCert.PublicKey()).Algorithm).Value;
		const oSigner = await cadescomMethods.oSigner();
		const oSignerXML = await cadescomMethods.oSignedXml();
		const { signAlgorithm, hashAlgorithm } = doXmlSitnatureAlgorithm(value);
		const xmlSitnatureType = doXmlSitnatureType(cadescomXmlSignatureType);
		await oSigner.propset_Certificate(currentCert);
		await oSignerXML.propset_Content(xml);
		await oSignerXML.propset_SignatureType(xmlSitnatureType);
		await oSignerXML.propset_SignatureMethod(signAlgorithm);
		await oSignerXML.propset_DigestMethod(hashAlgorithm);
		return await oSignerXML.Sign(oSigner);
	} catch (error) {
		throw new Error(error.message);
	}
};
//#endregion
//#region src/index.js
var cadespluginOnload = () => (async function cadespluginOnload() {
	try {
		await window.cadesplugin;
		const { getCertsList, getCert, currentCadesCert, signBase64, signXml, about } = CertificatesApi;
		return {
			getCertsList,
			getCert,
			currentCadesCert,
			signBase64,
			signXml,
			about
		};
	} catch (error) {
		throw new Error(error);
	}
})();
//#endregion
export { cadespluginOnload as default };
