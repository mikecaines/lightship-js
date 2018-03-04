define(
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
		'solarfield/ok-kit-js/src/Solarfield/Ok/StructUtils',
		'solarfield/batten-js/src/Solarfield/Batten/ComponentResolver',
	],
	function (ObjectUtils, StructUtils, BattenComponentResolver) {
		"use strict";

		/**
		 * A SystemJS registry based component resolver.
		 * This differs from the batten-js resolver, in that it only uses JS modules, and does not require (or use at all),
		 * any JS "namespace" objects to be in the global scope.
		 *
		 * @class Solarfield.Lightship.ComponentResolver
		 * @extends Solarfield.Batten.ComponentResolver
		 * @property {Solarfield.Batten.Controller} super
		 */
		var ComponentResolver = ObjectUtils.extend(BattenComponentResolver, {
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
		});
		
		return ComponentResolver;
	}
);
