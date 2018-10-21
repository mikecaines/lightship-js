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
		 * @class Environment
		 */
		var Environment = ObjectUtils.extend(null, {
			/**
			 * @return {ComponentChain}
			 */
			createComponentChain: function () {
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
			},
			
			/**
			 * @return {ComponentChain}
			 */
			getComponentChain: function (aModuleCode) {
				if (!this._sle_baseChain) this._sle_baseChain = this.createComponentChain();
				
				var chain = this._sle_baseChain;
				
				if (aModuleCode) {
					chain = chain.clone();
					
					chain.insertAfter(null, {
						id: 'module',
						path: 'app/App/Modules/' + aModuleCode,
					});
				}
				
				return chain;
			},
			
			/**
			 * @return {Options}
			 */
			getVars: function () {
				if (!this._sle_vars) {
					this._sle_vars = new Options({
						readOnly:true
					});
				}
				
				return this._sle_vars;
			},
			
			/**
			 * @return {Logger}
			 */
			getLogger: function () {
				if (!this._sle_logger) {
					this._sle_logger = new Logger();
				}
				
				return this._sle_logger;
			},

			/**
			 * @param {{}} aOptions
			 * @param {bool} aOptions.debug
			 * @param {{}} aOptions.vars
			 */
			constructor: function (aOptions) {
				this._sle_vars = null;
				this._sle_logger = null;
				this._sle_baseChain = null;

				var options = StructUtils.assign({
					debug: false,
					vars: {},
				}, aOptions);

				if (!self.App) self.App = {};

				self.App.DEBUG = options.debug == true;

				var vars = this.getVars();
				Object.keys(options.vars).forEach(function (k) {
					vars.set(k, options.vars[k]);
				});
			},
		});
		
		return Environment;
	}
);

/**
 * @typedef {Object} ChainLink
 * @property {string} id - Unique identifier for this link. Usually a string in the form of "vendor/package".
 * @property {string} path - JS module path to directory containing components. e.g. "vendor/package/src/Foo/Bar"
 */
