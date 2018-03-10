define(
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
		'solarfield/ok-kit-js/src/Solarfield/Ok/StructUtils',
	],
	function (ObjectUtils, StructUtils) {
		"use strict";

		/**
		 * A SystemJS registry based component resolver.
		 * @class Solarfield.Lightship.ComponentResolver
		 */
		var ComponentResolver = ObjectUtils.extend(null, {
			resolveComponent: function (aChain, aClassNamePart, aViewTypeCode, aPluginCode) {
				var chain = aChain.slice().reverse();
				var component = null;
				var i, link, modulePath;
				
				for (i = 0; i < chain.length; i++) {
					//TODO: should be defaulted elsewhere
					link = StructUtils.assign({
						path: '',
						pluginsSubPath: '/Plugins'
					}, chain[i]);
					
					modulePath = link.path;
					
					if (aPluginCode) {
						modulePath += link.pluginsSubPath;
						modulePath += '/' + aPluginCode;
					}
					
					modulePath += '/' + this.generateClassName(link, aClassNamePart, aViewTypeCode, aPluginCode);
					
					modulePath = System.normalizeSync(modulePath);
					
					if (System.registry.has(modulePath)) {
						component = {
							classObject: System.registry.get(modulePath).default
						};
						
						break;
					}
				}
				
				return component;
			},
			
			generateClassName: function (aLink, aClassNamePart, aViewTypeCode, aPluginCode) {
				var className = '';
				
				className += aClassNamePart;
				
				return className;
			},
		});
		
		return ComponentResolver;
	}
);
