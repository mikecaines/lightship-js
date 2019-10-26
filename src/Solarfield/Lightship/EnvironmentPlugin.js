define(
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
		'solarfield/ok-kit-js/src/Solarfield/Ok/EventTarget'
	],
	function (ObjectUtils, EventTarget) {
		"use strict";
		
		/**
		 * @class Solarfield.Lightship.EnvironmentPlugin
		 * @param {Environment} aEnvironment
		 * @param {string} aCode
		 * @constructor
		 */
		var EnvironmentPlugin = function (aEnvironment, aCode) {
			this._slep_environment = aEnvironment;
			this._slep_code = aCode;
			this._slep_eventTarget = new EventTarget();
		};
		
		/**
		 * @protected
		 * @see Solarfield.Ok.EventTarget::dispatchEvent()
		 */
		EnvironmentPlugin.prototype.dispatchEvent = function (aEvent, aOptions) {
			this._slep_eventTarget.dispatchEvent(this, aEvent, aOptions);
		};
		
		/**
		 * @returns {Environment}
		 */
		EnvironmentPlugin.prototype.getEnvironment = function () {
			return this._slep_environment;
		};
		
		EnvironmentPlugin.prototype.addEventListener = function (aEventType, aListener) {
			this._slep_eventTarget.addEventListener(aEventType, aListener);
		};
		
		return EnvironmentPlugin;
	}
);
