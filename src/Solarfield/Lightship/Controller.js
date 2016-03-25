define(
	'solarfield/lightship-js/src/Solarfield/Lightship/Controller',
	[
		'app/App/Environment',
		'solarfield/batten-js/src/Solarfield/Batten/Controller',
		'solarfield/ok-kit-js/src/Solarfield/Ok/ok'
	],
	function (Environment, BattenController, Ok) {
		"use strict";

		/**
		 * @class Solarfield.Lightship.Controller
		 * @extends Solarfield.Batten.Controller
		 * @constructor
		 */
		var Controller = Ok.extendObject(BattenController, {
			constructor: function (aCode, aOptions) {
				Controller.super.call(this, aCode, aOptions);

				this._lc_queuedPlugins = Ok.objectGet(aOptions, 'pluginRegistrations');
				this._lc_queuedPendingData = Ok.objectGet(aOptions, 'pendingData');
			},

			resolvePlugins: function () {
				Controller.super.prototype.resolvePlugins.call(this);

				var i, plugins;

				if (this._lc_queuedPlugins) {
					plugins = this.getPlugins();

					for (i = 0; i < this._lc_queuedPlugins.length; i++) {
						plugins.register(this._lc_queuedPlugins[i].componentCode, this._lc_queuedPlugins[i].installationCode);
					}
				}
			},

			hookup: function () {
				Controller.super.prototype.hookup.call(this);

				var model = this.getModel();
				var messages, i;

				//store any pending data
				model.set('app.pendingData', this._lc_queuedPendingData);

				messages = this.getModel().getAsArray('app.pendingData.app.standardOutput.messages');
				for (i = 0; i < messages.length; i++) {
					Environment.getLogger().info(messages[i].message);
				}

				if (this.hasEventListeners('hookup')) {
					this.dispatchEvent({
						type: 'hookup',
						target: this
					});
				}
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

		Ok.defineNamespace('Solarfield.Lightship');
		return Solarfield.Lightship.Controller = Controller;
	}
);
