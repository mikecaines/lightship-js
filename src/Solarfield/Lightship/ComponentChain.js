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
			
			insertBefore: function(aId, aLink) {
				var link = aLink instanceof ComponentChainLink ? aLink : new ComponentChainLink(aLink);
				this._socc_links.splice(this._getLinkIndex(), 0, link);
			},
			
			insertAfter: function(aId, aLink) {
				var link = aLink instanceof ComponentChainLink ? aLink : new ComponentChainLink(aLink);
				
				if (aId === null) {
					this._socc_links.push(link);
				}
				else {
					var index = this._getLinkIndex(aId);
					if (index === null) this._socc_links.push(link);
					else this._socc_links.splice(index, 0, link);
				}
			},
			
			forEach: function (cb) {
				this._socc_links.forEach(function (link, index) {
					cb(link, index);
				});
			},
			
			clone: function () {
				var clone = new this.constructor();
				
				this.forEach(function (link) {
					clone.insertAfter(null, link);
				});
				
				return clone;
			},
			
			constructor: function () {
				this._socc_links = [];
			},
		});
		
		return ComponentChain
	}
);
