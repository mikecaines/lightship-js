define(
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
	],
	function (ObjectUtils) {
		"use strict";

		/**
		 * A SystemJS registry based component resolver.
		 * @class Solarfield.Lightship.ComponentResolver
		 */
		var ComponentResolver = ObjectUtils.extend(null, {
			/**
			 *
			 * @param {ComponentChain} aChain
			 * @param {string} aClassNamePart
			 * @param {string|null} aViewTypeCode
			 * @param {string|null} aPluginCode
			 * @return {*}
			 */
			resolveComponent: function (aChain, aClassNamePart, aViewTypeCode, aPluginCode) {
				// reverse the chain
				var chain = [];
				aChain.forEach(function (link) {chain.push(link)});
				chain.reverse();
				
				var component = null;
				var i, link, modulePath;
				
				for (i = 0; i < chain.length; i++) {
					link = chain[i];
					
					modulePath = link.path;
					
					if (aPluginCode) {
						modulePath += link.pluginsPath;
						modulePath += '/' + aPluginCode;
					}
					
					modulePath += '/';
					if (aViewTypeCode) modulePath += aViewTypeCode;
					modulePath += aClassNamePart;
					
					//TODO: System should be passed to this instance, not referenced globally
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
		});
		
		return ComponentResolver;
	}
);
