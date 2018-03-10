define(
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
		'solarfield/ok-kit-js/src/Solarfield/Ok/StructUtils',
	],
	function (ObjectUtils, StructUtils) {
		"use strict";
		
		/**
		 * @class Solarfield.Lightship.Options
		 */
		var Options = ObjectUtils.extend(null, {
			add: function (aCode, aValue) {
				if (!this.has(aCode)) {
					this.set(aCode, aValue);
				}
			},
			
			set: function (aCode, aValue) {
				var type;
				
				if (this._slo_readOnly && this.has(aCode)) {
					throw new Error(
						"Option '" + aCode + "' is read only."
					);
				}
				
				type = typeof aValue;
				if (!(
						aValue === null || aValue === undefined
						|| type == 'string' || type == 'number' || type == 'boolean'
					)) {
					throw new Error(
						"Option values must be scalar or null."
					);
				}
				
				this._slo_data[aCode] = aValue;
			},
			
			get: function (aCode) {
				if (!this.has(aCode)) throw new Error(
					"Unknown option: '" + aCode + "'."
				);
				
				return this._slo_data[aCode];
			},
			
			has: function (aCode) {
				return aCode in this._slo_data;
			},
			
			constructor: function (aOptions) {
				var options = StructUtils.assign({
					readOnly: false
				}, aOptions);
				
				this._slo_data = {};
				this._slo_readOnly = options.readOnly == true;
			}
		});
		
		return Options;
	}
);