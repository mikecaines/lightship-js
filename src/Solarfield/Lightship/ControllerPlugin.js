define(
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
		'solarfield/ok-kit-js/src/Solarfield/Ok/EventTarget'
	],
	function (ObjectUtils, EventTarget) {
		"use strict";
		
		/**
		 * @class Solarfield.Lightship.ControllerPlugin
		 * @param {Controller} aController
		 * @param {string} aCode
		 * @constructor
		 */
		var ControllerPlugin = function (aController, aCode) {
			this._slcp_controller = aController;
			this._slcp_code = aCode;
			this._slcp_eventTarget = new EventTarget();
		};
		
		/**
		 * @protected
		 * @see Solarfield.Ok.EventTarget::dispatchEvent()
		 */
		ControllerPlugin.prototype.dispatchEvent = function (aEvent, aOptions) {
			this._slcp_eventTarget.dispatchEvent(this, aEvent, aOptions);
		};
		
		/**
		 * @returns {Controller}
		 */
		ControllerPlugin.prototype.getController = function () {
			return this._slcp_controller;
		};
		
		ControllerPlugin.prototype.addEventListener = function (aEventType, aListener) {
			this._slcp_eventTarget.addEventListener(aEventType, aListener);
		};
		
		return ControllerPlugin;
	}
);