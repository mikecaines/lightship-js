define(
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
		'solarfield/ok-kit-js/src/Solarfield/Ok/StructProxy',
	],
	function (ObjectUtils, StructProxy) {
		"use strict";
		
		/**
		 * @class Solarfield.Lightship.Model
		 */
		var Model = ObjectUtils.extend(null, {
			get: function (aPath) {
				return this._data.get(aPath)
			},

			getAsString: function (aPath) {
				return this._data.getAsString(aPath)
			},

			getAsBool: function (aPath) {
				return this._data.getAsBool(aPath)
			},

			getAsArray: function (aPath) {
				return this._data.getAsArray(aPath)
			},

			getAsObject: function (aPath) {
				return this._data.getAsObject(aPath)
			},

			set: function (aPath, aValue) {
				this._data.set(aPath, aValue);
			},

			getCode: function () {
				return this._code;
			},

			getEnvironment: function () {
				return this._env;
			},

			init: function () {},

			/**
			 * @param {Environment} aEnvironment
			 * @param {string} aModuleCode
			 * @param {{}} aOptions
			 */
			constructor: function (aEnvironment, aModuleCode, aOptions) {
				Object.defineProperties(this, {
					_env: {
						value: aEnvironment,
					},

					_code: {
						value: aModuleCode,
					},

					_data: {
						value: new StructProxy({}),
					},
				});
			}
		});
		
		return Model;
	}
);
