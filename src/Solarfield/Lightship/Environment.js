define(
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
		'solarfield/ok-kit-js/src/Solarfield/Ok/StructUtils',
		'solarfield/lightship-js/src/Solarfield/Lightship/Options',
		'solarfield/ok-kit-js/src/Solarfield/Ok/Logger',
		'solarfield/lightship-js/src/Solarfield/Lightship/ComponentChain',
		'solarfield/lightship-js/src/Solarfield/Lightship/EnvironmentPlugins',
		'solarfield/lightship-js/src/Solarfield/Lightship/ComponentResolver',
	],
	function (
		ObjectUtils, StructUtils, Options, Logger, ComponentChain, EnvironmentPlugins,
		ComponentResolver
	) {
		"use strict";

		/**
		 * @class Solarfield.Lightship.Environment
		 */
		var Environment = ObjectUtils.extend(null, {
			/**
			 * @protected
			 */
			resolvePlugins: function () {

			},

			/**
			 * @return {ComponentChain}
			 * @protected
			 */
			createComponentChain: function () {
				return new ComponentChain([
					{
						id: 'solarfield/lightship-js',
						path: 'solarfield/lightship-js/src/Solarfield/Lightship',
					},

					{
						id: 'app',
						path: 'app/App',
					}
				]);
			},
			
			/**
			 * @return {ComponentChain}
			 */
			getComponentChain: function (aModuleCode) {
				if (!this._sle_baseChain) this._sle_baseChain = this.createComponentChain();
				
				var chain = this._sle_baseChain;
				
				if (aModuleCode) {
					chain = chain.withLinkAppended({
						id: 'module',
						path: 'app/App/Modules/' + aModuleCode,
					});
				}
				
				return chain;
			},

			/**
			 * @returns {ComponentResolver}
			 */
			getComponentResolver: function () {
				if (!this._sle_componentResolver) {
					this._sle_componentResolver = new ComponentResolver({
						logger: this.getLogger().withName(this.getLogger().name + '/componentResolver'),
					});
				}

				return this._sle_componentResolver;
			},

			/**
			 * @return {boolean}
			 */
			isDevModeEnabled: function () {
				return this._sle_devModeEnabled;
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

			getPlugins: function () {
				if (!this._sle_plugins) this._sle_plugins = new EnvironmentPlugins(this);
				return this._sle_plugins;
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
				this.resolvePlugins();
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
