define(
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
		'solarfield/lightship-js/src/Solarfield/Lightship/ComponentChainLink',
	],
	function (ObjectUtils, ComponentChainLink) {
		/**
		 * @class ComponentChain
		 */
		var ComponentChain = ObjectUtils.extend(null, {
			_getLinkIndex: function (aId) {
				for (var i = 0; i < this._socc_links.length; i++) {
					if (this._socc_links[i].id === aId) return i;
				}
				
				return null;
			},
			
			get: function (aId) {
				for (var i = 0; i < this._socc_links.length; i++) {
					if (this._socc_links[i].id === aId) return this._socc_links[i];
				}
				
				return null;
			},

			withLinkInsertedBefore: function(aLink, aId) {
				var chain = this.clone();
				var link = aLink instanceof ComponentChainLink ? aLink : new ComponentChainLink(aLink);
				chain._socc_links.splice(chain._getLinkIndex(aId), 0, link);
				return chain;
			},

			withLinkInsertedAfter: function(aLink, aId) {
				var chain = this.clone();
				var link = aLink instanceof ComponentChainLink ? aLink : new ComponentChainLink(aLink);
				
				if (aId === null) {
					chain._socc_links.push(link);
				}
				else {
					var index = chain._getLinkIndex(aId);
					if (index === null) chain._socc_links.push(link);
					else chain._socc_links.splice(index, 0, link);
				}

				return chain;
			},

			withLinkPrepended: function (aLink) {
				var chain = this.clone();
				var link = aLink instanceof ComponentChainLink ? aLink : new ComponentChainLink(aLink);
				chain._socc_links.unshift(link);
				return chain;
			},

			withLinkAppended: function (aLink) {
				var chain = this.clone();
				var link = aLink instanceof ComponentChainLink ? aLink : new ComponentChainLink(aLink);
				chain._socc_links.push(link);
				return chain;
			},

			forEach: function (cb) {
				this._socc_links.forEach(function (link, index) {
					cb(link, index);
				});
			},
			
			clone: function () {
				return new this.constructor(this._socc_links);
			},
			
			constructor: function (aLinks) {
				this._socc_links = [];

				if (aLinks) {
					for (var i = 0; i < aLinks.length; i++) {
						this._socc_links.push(
							aLinks[i] instanceof ComponentChainLink
								? aLinks[i] : new ComponentChainLink(aLinks[i])
						)
					}
				}
			},
		});
		
		return ComponentChain
	}
);
