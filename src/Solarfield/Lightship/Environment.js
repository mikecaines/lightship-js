define(
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
		'solarfield/ok-kit-js/src/Solarfield/Ok/StructUtils',
		'solarfield/lightship-js/src/Solarfield/Lightship/Options',
		'solarfield/ok-kit-js/src/Solarfield/Ok/Logger',
		'solarfield/lightship-js/src/Solarfield/Lightship/ComponentChain',
	],
	function (ObjectUtils, StructUtils, Options, Logger, ComponentChain) {
		"use strict";

		/**
		 * @class Solarfield.Lightship.Environment
		 * @abstract
		 * @constructor
		 */
		var Environment = function () {
			throw Error("Class is abstract.");
		};
		
		/** @var ComponentChain @static */ Environment._sle_baseChain = null;
		/** @static */ Environment._sle_vars = null;
		/** @static */ Environment._sle_logger = null;
		
		/**
		 * @static
		 * @return {ComponentChain}
		 */
		Environment.createComponentChain = function () {
			var chain = new ComponentChain();
			
			chain.insertAfter(null, {
				id: 'solarfield/lightship-js',
				path: 'solarfield/lightship-js/src/Solarfield/Lightship',
			});
			
			chain.insertAfter(null, {
				id: 'app',
				path: 'app/App',
			});
			
			return chain;
		};
		
		/**
		 * @static
		 * @return {ComponentChain}
		 */
		Environment.getComponentChain = function () {
			if (!Environment._sle_baseChain) Environment._sle_baseChain = this.createComponentChain();
			return Environment._sle_baseChain;
		};
		
		/**
		 * @static
		 * @return {Options}
		 */
		Environment.getVars = function () {
			if (!Environment._sle_vars) {
				Environment._sle_vars = new Options({
					readOnly:true
				});
			}
			
			return Environment._sle_vars;
		};
		
		/**
		 * @static
		 * @return {Logger}
		 */
		Environment.getLogger = function () {
			if (!Environment._sle_logger) {
				Environment._sle_logger = new Logger();
			}
			
			return Environment._sle_logger;
		};
		
		/**
		 * @static
		 * @param {{
		 *  debug: bool,
		 *  vars: {}
		 * }} aOptions
		 */
		Environment.init = function (aOptions) {
			var options = StructUtils.assign({
				debug: false,
				vars: {}
			}, aOptions);
			
			if (!self.App) self.App = {};
			
			self.App.DEBUG = options.debug == true;
			
			var vars = this.getVars();
			Object.keys(options.vars).forEach(function (k) {
				vars.set(k, options.vars[k]);
			});
		};
		
		return Environment;
	}
);

/**
 * @typedef {Object} ChainLink
 * @property {string} id - Unique identifier for this link. Usually a string in the form of "vendor/package".
 * @property {string} path - JS module path to directory containing components. e.g. "vendor/package/src/Foo/Bar"
 */
