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
			 * @return {boolean}
			 */
			isDevModeEnabled: function () {
				return this._sle_devModeEnabled;
			},

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
			 * @param {Object[]} aMessages
			 * @param {string} aMessages[].message - Text of the message.
			 * @param {string} aMessages[].level - Uppercase name of a level defined by RFC 5424.
			 * @param {Object} aMessages[].context - Additional context information.
			 */
			processStdoutMessages: function (aMessages) {
				//TODO: move this to a LightshipBridge plugin
				var messages = aMessages||[];
				var i;

				for (i = 0; i < messages.length; i++) {
					messages[i].channel = 'server/stdout';
					this.getLogger().logItem(messages[i]);
				}
			},

			/**
			 * @static
			 * @param {Context} aContext
			 * @return {Promise}
			 */
			boot: function (aContext) {
				return System.import('app/App/Controller')
					.then(function (Controller) {
						try {
							var controller = Controller.fromContext(this, aContext);
						}
						catch (e) {
							return this.bail(e);
						}

						return Promise.resolve(controller)
							.then(function (controller) {
								if (this.isDevModeEnabled()) {
									self.App.controller = controller;
								}

								return controller.boot();
							}.bind(this))
							.catch(function (e) {
								return controller.handleException(e);
							})
					}.bind(this))
			},

			/**
			 * Will be called by ::bootstrap() if an uncaught error occurs before a Controller is created.
			 * Normally this is only called when in an unrecoverable error state.
			 * @see ::handleException().
			 * @param {Error} aEx
			 * @return {Promise}
			 */
			bail: function (aEx) {
				this.getLogger().error('Bailed.', {
					exception: aEx
				});

				return Promise.resolve();
			},

			init: function () {

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
					devModeEnabled: false,
					vars: {},
				}, aOptions);

				if (!self.App) self.App = {};

				this._sle_devModeEnabled = options.devModeEnabled === true;

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
