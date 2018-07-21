define(
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
		'solarfield/ok-kit-js/src/Solarfield/Ok/StructUtils',
	],
	function (ObjectUtils, StructUtils) {
		/**
		 * @class ComponentChainLink
		 */
		return ObjectUtils.extend(null, {
			constructor: function (aOptions) {
				var options = StructUtils.assign({
					id: '',
					path: '',
					pluginsPath: '/Plugins',
				}, aOptions);
				
				Object.defineProperties(this, {
					id: {value: ''+options.id},
					path: {value: ''+options.path},
					pluginsPath: {value: ''+options.pluginsPath},
				});
			}
		})
	}
);
