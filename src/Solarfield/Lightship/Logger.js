define(
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils'
	],
	function (ObjectUtils) {
		"use strict";
		
		/**
		 * @class Solarfield.Lightship.Logger
		 */
		var Logger = function () {};
		
		if (self.console && console.log) {
			Logger.prototype.info = console.info ? function(m,c){if (arguments.length>1) console.info(m,c); else console.info(m)} : function(m,c){console.log(m,c)};
			Logger.prototype.warn = console.warn ? function(m,c){if (arguments.length>1) console.warn(m,c); else console.warn(m)} : Logger.prototype.info;
			Logger.prototype.error = console.error ? function(m,c){if (arguments.length>1) console.error(m,c); else console.error(m)} : Logger.prototype.info;
			Logger.prototype.debug = console.debug ? function(m,c){if (arguments.length>1) console.debug(m,c); else console.debug(m)} : Logger.prototype.info;
		}
		else {
			Logger.prototype.info = Logger.prototype.warn = Logger.prototype.error = Logger.prototype.debug = function(){};
		}
		
		return Logger;
	}
);