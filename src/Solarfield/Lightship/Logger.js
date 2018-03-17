define(
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils'
	],
	function (ObjectUtils) {
		"use strict";
		
		/**
		 * A logger that provides support for all RFC 5424 levels, and forwards to the global/browser console.
		 * Calls to log with an unknown level, will fallback to the behaviour of the window.console.log method.
		 * @class Solarfield.Lightship.Logger
		 * @see https://tools.ietf.org/html/rfc5424#page-11
		 */
		var Logger = ObjectUtils.extend(null, {
			log: function (aLevel, aMessage, aContext) {
				var level = (''+aLevel).toUpperCase();
				var funcName, funcArgs;
				
				if (level in this._sol_levels) {
					funcName = this._sol_levels[level];
					
					funcArgs = [aMessage];
					if (aContext !== undefined) funcArgs.push(aContext);
				}
				
				else {
					funcName = 'log';
					funcArgs = arguments;
				}
				
				console[funcName].apply(console, funcArgs);
			},
			
			emergency: function (aMessage, aContext) {
				this.log('EMERGENCY', aMessage, aContext);
			},
			
			alert: function (aMessage, aContext) {
				this.log('ALERT', aMessage, aContext);
			},
			
			critical: function (aMessage, aContext) {
				this.log('EMERGENCY', aMessage, aContext);
			},
			
			error: function (aMessage, aContext) {
				this.log('EMERGENCY', aMessage, aContext);
			},
			
			warn: function (aMessage, aContext) {
				this.log('WARNING', aMessage, aContext);
			},
			
			warning: function (aMessage, aContext) {
				this.warn(aMessage, aContext);
			},
			
			notice: function (aMessage, aContext) {
				this.log('NOTICE', aMessage, aContext);
			},
			
			info: function (aMessage, aContext) {
				this.log('INFO', aMessage, aContext);
			},
			
			debug: function (aMessage, aContext) {
				this.log('DEBUG', aMessage, aContext);
			},
			
			constructor: function () {
				this._sol_levels = {
					EMERGENCY: 'error',
					ALERT: 'error',
					CRITICAL: 'error',
					ERROR: 'error',
					WARNING: 'warn',
					NOTICE: 'info',
					INFO: 'info',
					DEBUG: 'debug',
				};
			},
		});
		
		return Logger;
	}
);