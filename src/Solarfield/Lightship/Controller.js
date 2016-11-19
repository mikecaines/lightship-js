define(
	'solarfield/lightship-js/src/Solarfield/Lightship/Controller',
	[
		'app/App/Environment',
		'solarfield/batten-js/src/Solarfield/Batten/Controller',
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
		'solarfield/ok-kit-js/src/Solarfield/Ok/StructUtils',
		'solarfield/ok-kit-js/src/Solarfield/Ok/ExtendableEventManager',
		'solarfield/ok-kit-js/src/Solarfield/Ok/ExtendableEvent'
	],
	function (Environment, BattenController, ObjectUtils, StructUtils, ExtendableEventManager, ExtendableEvent) {
		"use strict";

		/**
		 * @class Solarfield.Lightship.Controller
		 * @extends Solarfield.Batten.Controller
		 * @property {Solarfield.Batten.Controller} super
		 */
		var Controller = ObjectUtils.extend(BattenController, {
			/**
			 * @protected
			 * @param {Solarfield.Ok.ExtendableEvent} aEvt
			 * @returns {Promise}
			 */
			onHookup: function (aEvt) {
				return aEvt.waitUntil(Promise.resolve().then(function () {
					var model = this.getModel();
					var messages, i;

					//store any pending data
					model.set('app.pendingData', this._lc_queuedPendingData);

					messages = this.getModel().getAsArray('app.pendingData.app.standardOutput.messages');
					for (i = 0; i < messages.length; i++) {
						Environment.getLogger().info(messages[i].message);
					}
				}.bind(this)));
			},

			/**
			 * @protected
			 * @param {Event} aEvt
			 */
			onDoTask: function (aEvt) {

			},

			/**
			 * @protected
			 * @param {Event} aEvt
			 */
			onBeforeDoTask: function (aEvt) {

			},

			/**
			 * @inheritDoc
			 */
			constructor: function (aCode, aOptions) {
				Controller.super.call(this, aCode, aOptions);

				this._lc_queuedPlugins = StructUtils.get(aOptions, 'pluginRegistrations');
				this._lc_queuedPendingData = StructUtils.get(aOptions, 'pendingData');
			},

			resolvePlugins: function () {
				Controller.super.prototype.resolvePlugins.call(this);

				var i, plugins;

				if (this._lc_queuedPlugins) {
					plugins = this.getPlugins();

					for (i = 0; i < this._lc_queuedPlugins.length; i++) {
						plugins.register(this._lc_queuedPlugins[i].componentCode);
					}
				}
			},

			hookup: function () {
				return Controller.super.prototype.hookup.call(this)
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
			},

			run: function () {
				Controller.super.prototype.run.call(this);

				//clear any pending data
				this.getModel().set('app.pendingData', null);
			},

			doTask: function () {
				Controller.super.prototype.doTask.apply(this, arguments);

				var event;

				event = {
					type: 'before-do-task',
					target: this
				};

				this.dispatchEvent(event, {
					listener: this.onBeforeDoTask,
					breakOnError: true
				});

				event = {
					type: 'do-task',
					target: this
				};

				this.dispatchEvent(event, {
					listener: this.onDoTask,
					breakOnError: true
				});

				this.dispatchEvent(event);
			}
		});

		ObjectUtils.defineNamespace('Solarfield.Lightship');
		return Solarfield.Lightship.Controller = Controller;
	}
);
