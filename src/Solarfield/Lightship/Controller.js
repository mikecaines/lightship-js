define(
	[
		'app/App/Environment',
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
		'solarfield/ok-kit-js/src/Solarfield/Ok/StringUtils',
		'solarfield/lightship-js/src/Solarfield/Lightship/ComponentResolver',
		'solarfield/lightship-js/src/Solarfield/Lightship/ControllerPlugins',
		'solarfield/ok-kit-js/src/Solarfield/Ok/EventTarget',
		'solarfield/lightship-js/src/Solarfield/Lightship/Model',
		'solarfield/lightship-js/src/Solarfield/Lightship/Options',
		'solarfield/ok-kit-js/src/Solarfield/Ok/StructUtils',
		'solarfield/ok-kit-js/src/Solarfield/Ok/ExtendableEventManager',
		'solarfield/ok-kit-js/src/Solarfield/Ok/ExtendableEvent',
		'solarfield/ok-kit-js/src/Solarfield/Ok/Conduit',
		'solarfield/ok-kit-js/src/Solarfield/Ok/HttpLoaderResult',
	],
	function (
		Environment, ObjectUtils, StringUtils, ComponentResolver, ControllerPlugins, EvtTarget, Model, Options,
		StructUtils, ExtendableEventManager, ExtendableEvent, Conduit, HttpLoaderResult
	) {
		"use strict";
		
		/**
		 * @class Solarfield.Lightship.Controller
		 * @param {String} aCode
		 * @param {Object} aOptions
		 */
		var Controller = function (aCode, aOptions) {
			this._slc_model = null;
			this._slc_code = aCode+'';
			this._slc_plugins = null;
			this._slc_eventTarget = new EvtTarget();
			this._slc_options = null;
			this._slc_componentResolver = null;
			this._slc_queuedPlugins = StructUtils.get(aOptions, 'pluginRegistrations');
			this._slc_queuedOptions = StructUtils.get(aOptions, 'options');
			this._slc_queuedPendingData = StructUtils.get(aOptions, 'pendingData');
			this._slc_mainConduit = null;
			
			this.handleConduitData = this.handleConduitData.bind(this);
		};
		
		/**
		 * @static
		 * @param aOptions
		 */
		Controller.bootstrap = function (aOptions) {
			try {
				var controller = this.boot(aOptions['bootInfo']);
				
				if (controller) {
					self.App.controller = controller;
					
					controller.connect()
					.then(function () {
						controller.run();
						return controller;
					})
					.catch(function (e) {
						controller.handleException(e);
					});
				}
			}
			
			catch (e) {
				this.bail(e);
			}
		};
		
		/**
		 * @static
		 * @param aInfo
		 * @return {Solarfield.Lightship.Controller}
		 */
		Controller.boot = function (aInfo) {
			var controller = this.fromCode(aInfo.moduleCode, aInfo.controllerOptions);
			controller.init();
			return controller;
		};
		
		/**
		 * @static
		 * @param aEx
		 */
		Controller.bail = function (aEx) {
			Environment.getLogger().error('Bailed.', {
				exception: aEx
			});
		};
		
		/**
		 * @static
		 * @returns {Solarfield.Lightship.ComponentResolver}
		 */
		Controller.getComponentResolver = function () {
			if (!this._slc_componentResolver) {
				this._slc_componentResolver = this.createComponentResolver();
			}
			
			return this._slc_componentResolver;
		};
		
		/**
		 * @static
		 * @returns {Solarfield.Lightship.ComponentResolver}
		 */
		Controller.createComponentResolver = function () {
			return new ComponentResolver(SystemJS);
		};
		
		/**
		 * Gets the MVC chain for the specified module code.
		 * @returns {object|null}
		 * @static
		 */
		Controller.getChain = function (aModuleCode) {
			var chain = Environment.getBaseChain().slice();
			
			if (aModuleCode != null) {
				chain.push({
					id: 'module',
					path: 'app/App/Modules/' + aModuleCode,
				});
			}
			
			return chain;
		};
		
		/**
		 * Creates an instance of the appropriate module class.
		 * @param {String} aCode
		 * @param {Object=} aOptions
		 * @returns {Solarfield.Lightship.Controller}
		 * @static
		 */
		Controller.fromCode = function (aCode, aOptions) {
			var component = this.getComponentResolver().resolveComponent(
				this.getChain(aCode),
				'Controller'
			);
			
			if (!component) {
				throw new Error(
					"Could not resolve Controller component for module '" + aCode + "'."
				);
			}
			
			return new component.classObject(aCode, aOptions);
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
			return aEvt.waitUntil(Promise.resolve().then(function () {
				var model = this.getModel();
				
				//store any pending data
				model.set('app.pendingData', this._slc_queuedPendingData);
				this._slc_queuedPendingData = null;
			}.bind(this)));
		};
		
		/**
		 * @protected
		 * @param {Event} aEvt
		 */
		Controller.prototype.onDoTask = function (aEvt) {
			//if there is pending data
			if (this.getModel().get('app.pendingData')) {
				//push it into the main conduit
				this.getMainConduit().push(this.getModel().get('app.pendingData'))
				
				//if any error occurs, push the error onto the conduit as well (app can handle it, etc.)
				.catch(function (e) {
					this.getMainConduit().push(e);
				}.bind(this))
				
				//finally
				.then(function () {
					//clear the pending data from the model
					this.getModel().set('app.pendingData', null);
				}.bind(this));
			}
		};
		
		/**
		 * @protected
		 * @param {ConduitDataEvent} aEvt
		 */
		Controller.prototype.handleConduitData = function (aEvt) {
			var bundles; //will hold the raw JSON data, which we will check for known bundles
			var t;
			
			if (aEvt.data instanceof HttpLoaderResult) {
				if (aEvt.data.response.constructor === Object) {
					bundles = aEvt.data.response;
				}
			}
			
			else if (aEvt.data.constructor === Object) {
				bundles = aEvt.data;
			}
			
			
			if (bundles) {
				t = StructUtils.get(bundles, 'app.standardOutput.messages');
				if (t) this.processStandardOutputMessages(t);
			}
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
			if (!this._slc_model) {
				this._slc_model = new Model();
			}
			
			return this._slc_model;
		};
		
		Controller.prototype.connect = function () {
			var controller = this;
			
			return new Promise(function (resolve, reject) {
				function handleDomReady() {
					document.removeEventListener('DOMContentLoaded', handleDomReady);
					
					Promise.resolve(controller.hookup())
					.then(function () {resolve()})
					.catch(function (ex) {reject(ex)});
				}
				
				if (self.document && ['interactive', 'complete'].includes(document.readyState)) {
					handleDomReady();
				}
				
				else {
					document.addEventListener('DOMContentLoaded', handleDomReady);
				}
			});
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
		
		Controller.prototype.run = function () {
			this.doTask();
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
		
		Controller.prototype.getCode = function () {
			return this._slc_code;
		};
		
		Controller.prototype.handleException = function (aEx) {
			Environment.getLogger().error(''+aEx, {
				exception: aEx
			});
		};
		
		Controller.prototype.getMainConduit = function () {
			if (!this._slc_mainConduit) {
				this._slc_mainConduit = new Conduit({
					name: 'app.main',
				});
				
				this._slc_mainConduit.addEventListener('data', this.handleConduitData);
			}
			
			return this._slc_mainConduit;
		};
		
		/**
		 * @param {Object[]} aMessages
		 * @param {string} aMessages[].message - Text of the message.
		 * @param {string} aMessages[].level - Uppercase name of a level defined by RFC 5424.
		 * @param {Object} aMessages[].context - Additional context information.
		 */
		Controller.prototype.processStandardOutputMessages = function (aMessages) {
			var messages = aMessages||[];
			var i;
			
			for (i = 0; i < messages.length; i++) {
				Environment.getLogger().log(messages[i].level, messages[i].message, messages[i].context);
			}
		};
		
		return Controller;
	}
);