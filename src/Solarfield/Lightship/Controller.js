define(
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
		'solarfield/ok-kit-js/src/Solarfield/Ok/StringUtils',
		'solarfield/lightship-js/src/Solarfield/Lightship/ControllerPlugins',
		'solarfield/ok-kit-js/src/Solarfield/Ok/EventTarget',
		'solarfield/lightship-js/src/Solarfield/Lightship/Model',
		'solarfield/lightship-js/src/Solarfield/Lightship/Options',
		'solarfield/ok-kit-js/src/Solarfield/Ok/StructUtils',
		'solarfield/ok-kit-js/src/Solarfield/Ok/ExtendableEventManager',
		'solarfield/ok-kit-js/src/Solarfield/Ok/ExtendableEvent',
		'solarfield/ok-kit-js/src/Solarfield/Ok/Conduit',
	],
	function (
		ObjectUtils, StringUtils, ControllerPlugins, EvtTarget, Model, Options,
		StructUtils, ExtendableEventManager, ExtendableEvent, Conduit,
	) {
		"use strict";
		
		/**
		 * @class Solarfield.Lightship.Controller
		 * @param {Environment} aEnvironment
		 * @param {String} aCode
		 * @param {Model} aModel
		 * @param {Context} aContext
		 * @param {Object=} aOptions
		 */
		var Controller = function (aEnvironment, aCode, aModel, aContext, aOptions) {
			this._slc_environment = aEnvironment;
			this._slc_logger = null;
			this._slc_model = aModel;
			this._slc_code = aCode+'';
			this._slc_plugins = null;
			this._slc_eventTarget = new EvtTarget();
			this._slc_options = null;
			this._slc_queuedPlugins = StructUtils.get(aOptions, 'pluginRegistrations');
			this._slc_queuedOptions = StructUtils.get(aOptions, 'options');
			this._slc_mainConduit = null;
		};
		
		/**
		 * Creates an instance of the appropriate module class.
		 * @param {Environment} aEnvironment
		 * @param {Context} aContext
		 * @returns {Solarfield.Lightship.Controller}
		 * @static
		 */
		Controller.fromContext = function (aEnvironment, aContext) {
			var moduleCode = aContext.getRoute().getModuleCode();
			var component;

			// create the model
			component = aEnvironment.getComponentResolver().resolveComponent(
				aEnvironment.getComponentChain(moduleCode),
				'Model'
			);
			if (!component) throw new Error(
				"Could not resolve Model component for module '" + moduleCode + "'."
			);
			var model = new component.classObject(
				aEnvironment, moduleCode, aContext.getRoute().getModelOptions()
			);
			model.init();

			// create the controller
			component = aEnvironment.getComponentResolver().resolveComponent(
				aEnvironment.getComponentChain(moduleCode),
				'Controller'
			);
			if (!component) throw new Error(
				"Could not resolve Controller component for module '" + moduleCode + "'."
			);
			var controller = new component.classObject(
				aEnvironment, moduleCode, model, aContext, aContext.getRoute().getControllerOptions()
			);
			controller.init();

			return controller;
		};

		/**
		 * @protected
		 */
		Controller.prototype.resolvePlugins = function () {
			var plugins, i;
			
			if (this._slc_queuedPlugins) {
				plugins = this.getPlugins();
				
				for (i = 0; i < this._slc_queuedPlugins.length; i++) {
					plugins.register(this._slc_queuedPlugins[i].componentCode);
				}
				
				this._slc_queuedPlugins = null;
			}
		};
		
		/**
		 * @protected
		 */
		Controller.prototype.resolveOptions = function () {
			var options, k;
			
			if (this._slc_queuedOptions) {
				options = this.getOptions();
				
				for (k in this._slc_queuedOptions) {
					options.add(k, this._slc_queuedOptions[k]);
				}
				
				this._slc_queuedOptions = null;
			}
		};
		
		/**
		 * @param {Object} aEvent
		 * @param {Object=} aOptions
		 * @protected
		 * @see Solarfield.Ok.EventTarget::dispatchEvent()
		 */
		Controller.prototype.dispatchEvent = function (aEvent, aOptions) {
			this._slc_eventTarget.dispatchEvent(this, aEvent, aOptions);
		};
		
		/**
		 * @protected
		 * @param {Solarfield.Ok.ExtendableEventManager} aExtendable
		 * @param {Object=} aOptions Call time options.
		 * @see Solarfield.Ok.EventTarget::dispatchExtendableEvent()
		 */
		Controller.prototype.dispatchExtendableEvent = function (aExtendable, aOptions) {
			return this._slc_eventTarget.dispatchExtendableEvent(this, aExtendable, aOptions);
		};
		
		/**
		 * @protected
		 * @param {Solarfield.Ok.ExtendableEvent} aEvt
		 * @returns {Promise}
		 */
		Controller.prototype.onHookup = function (aEvt) {
			return Promise.resolve();
		};
		
		/**
		 * @protected
		 * @param {Event} aEvt
		 */
		Controller.prototype.onDoTask = function (aEvt) {

		};

		Controller.prototype.addEventListener = function (aEventType, aListener) {
			this._slc_eventTarget.addEventListener(aEventType, aListener);
		};
		
		Controller.prototype.getPlugins = function () {
			if (!this._slc_plugins) {
				this._slc_plugins = new ControllerPlugins(this);
			}
			
			return this._slc_plugins;
		};
		
		Controller.prototype.getOptions = function () {
			if (!this._slc_options) {
				this._slc_options = new Options();
			}
			
			return this._slc_options;
		};
		
		Controller.prototype.getModel = function () {
			return this._slc_model;
		};

		Controller.prototype.hookup = function () {
			return Promise.resolve()
			.then(function () {
				var event = new ExtendableEventManager(function (aWaitQueue) {
					return new ExtendableEvent({
						type: 'hookup',
						target: this
					}, aWaitQueue);
				}.bind(this));
				
				return this.dispatchExtendableEvent(event, {
					listener: this.onHookup,
					breakOnError: true
				})
				.then(function () {
					return this.dispatchExtendableEvent(event);
				}.bind(this));
			}.bind(this));
		};

		/**
		 * @return {Promise}
		 */
		Controller.prototype.run = function () {
			return new Promise(function (resolve, reject) {
				var handleDomReady = function () {
					document.removeEventListener('DOMContentLoaded', handleDomReady);

					Promise.resolve(this.hookup())
						.then(function () {resolve()})
						.catch(function (ex) {reject(ex)});
				}.bind(this);

				if (self.document && ['interactive', 'complete'].includes(document.readyState)) {
					handleDomReady();
				}
				else {
					document.addEventListener('DOMContentLoaded', handleDomReady);
				}
			}.bind(this))
				.then(function () {
					this.doTask();
				}.bind(this));
		};
		
		Controller.prototype.doTask = function () {
			var event = {
				type: 'do-task',
				target: this
			};
			
			this.dispatchEvent(event, {
				listener: this.onDoTask,
				breakOnError: true
			});
			
			this.dispatchEvent(event);
		};
		
		Controller.prototype.init = function () {
			this.resolvePlugins();
			this.resolveOptions();
		};
		
		/**
		 * Gets the controller's module code.
		 * @return {string} The code.
		 */
		Controller.prototype.getCode = function () {
			return this._slc_code;
		};
		
		/**
		 * Will be called if an uncaught error occurs after a Controller is created.
		 * Normally this is only called when ::run() fails.
		 * You can override this method, and attempt to boot another Controller for recovery purposes, etc.
		 * @param {Error} aEx The error.
		 * @return Promise
		 */
		Controller.prototype.handleException = function (aEx) {
			return this.getEnvironment().bail(aEx);
		};
		
		/**
		 * @public
		 * @return {Logger}
		 */
		Controller.prototype.getLogger = function () {
			if (!this._slc_logger) {
				this._slc_logger = this.getEnvironment().getLogger().withName('controller[' + this.getCode() + ']');
			}
			
			return this._slc_logger;
		};
		
		/**
		 * @public
		 * @return {Conduit}
		 */
		Controller.prototype.getMainConduit = function () {
			if (!this._slc_mainConduit) {
				this._slc_mainConduit = new Conduit({
					name: 'app.main',
				});
			}
			
			return this._slc_mainConduit;
		};

		/**
		 * @return {Environment}
		 */
		Controller.prototype.getEnvironment = function () {
			return this._slc_environment;
		};

		/**
		 * @param aContext
		 * @return {Promise}
		 */
		Controller.prototype.boot = function (aContext) {
			return this.run();
		};
		
		return Controller;
	}
);
