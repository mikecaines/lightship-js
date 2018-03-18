define(
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
		'solarfield/ok-kit-js/src/Solarfield/Ok/StructUtils',
	],
	function (ObjectUtils, StructUtils) {
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
				
				
				//if level is known
				if (level in Logger._sol_levels) {
					funcName = Logger._sol_levels[level];
					
					funcArgs = [aMessage];
					if (aContext !== undefined) funcArgs.push(aContext);
				}
				
				//else level is unknown, treat args as console.log() style
				else {
					funcName = 'log';
					funcArgs = Array.prototype.slice.call(arguments); //convert arguments to an Array
				}
				
				
				//if we have a name
				if (this.name) {
					//prepend the name to the output
					funcArgs.unshift('%c' + this.name.replace(/%/g, '%%'), 'color:GrayText', '');
				}
				
				//else we don't have a name
				else {
					//if args are in "message, substitutions" style
					if (funcArgs.length >= 2 && typeof funcArgs[0] == 'string') {
						//escape % characters (substitution markers) in message
						funcArgs[0] = funcArgs[0].replace(/%/g, '%%');
					}
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
			
			/**
			 * @constructor
			 * @param {{}=} aOptions - Configuration options.
			 * @param {string=} [aOptions.name=''] - The name/channel of the logger.
			 */
			constructor: function (aOptions) {
				var options = StructUtils.assign({
					name: '',
				}, aOptions);
				
				/**
				 * @public
				 * @type {string}
				 */
				this.name = ''+(options.name||'');
			},
		});
		
		/**
		 * @static
		 * @private
		 */
		Logger._sol_levels = {
			EMERGENCY: 'error',
			ALERT: 'error',
			CRITICAL: 'error',
			ERROR: 'error',
			WARNING: 'warn',
			NOTICE: 'info',
			INFO: 'info',
			DEBUG: 'debug',
		};
		
		return Logger;
	}
);