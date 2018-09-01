/**
 * {@link http://github.com/solarfield/lightship-js}
 * {@license https://github.com/solarfield/lightship-js/blob/master/LICENSE}
 */

define(
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
	],
	function (
		ObjectUtils
	) {
		"use strict";
		
		/**
		 * @class Route
		 */
		return ObjectUtils.extend(null, {
			/**
			 * @return {{}}
			 */
			getControllerOptions: function () {
				return this._slr_controllerOptions;
			},
			
			/**
			 * @return {string}
			 */
			getModuleCode: function () {
				return this._slr_moduleCode;
			},
			
			/**
			 * @param {{}} aOptions
			 * @param {{}} aOptions.controllerOptions
			 * @param {string} aOptions.moduleCode
			 * @constructor
			 */
			constructor: function (aOptions) {
				this._slr_moduleCode = aOptions.moduleCode;
				this._slr_controllerOptions = aOptions.controllerOptions;
			}
		});
	}
);
