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
		 * @constructor
		 */
		var Controller = ObjectUtils.extend(BattenController, {
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
					var model = this.getModel();
					var messages, i;

					//store any pending data
					model.set('app.pendingData', this._lc_queuedPendingData);

					messages = this.getModel().getAsArray('app.pendingData.app.standardOutput.messages');
					for (i = 0; i < messages.length; i++) {
						Environment.getLogger().info(messages[i].message);
					}

					//dispatch a hookup event
					return this.hasEventListeners('hookup')
						? this.dispatchExtendableEvent(new ExtendableEventManager(function (aWaitQueue) {
								return new ExtendableEvent({
									type: 'hookup',
									target: this
								}, aWaitQueue);
							}.bind(this)))
						: Promise.resolve()
					;
				}.bind(this));
			},

			doTask: function () {
				Controller.super.prototype.doTask.apply(this, arguments);

				if (this.hasEventListeners('before-do-task')) {
					this.dispatchEvent({
						type: 'before-do-task',
						target: this
					});
				}

				//clear any pending data, as it should always be handled in hookup()
				this.getModel().set('app.pendingData', null);

				if (this.hasEventListeners('do-task')) {
					this.dispatchEvent({
						type: 'do-task',
						target: this
					});
				}
			}
		});

		ObjectUtils.defineNamespace('Solarfield.Lightship');
		return Solarfield.Lightship.Controller = Controller;
	}
);
