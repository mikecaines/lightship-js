/**
 * {@link http://github.com/solarfield/lightship-js}
 * {@license https://github.com/solarfield/lightship-js/blob/master/LICENSE}
 */

define(
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
		'solarfield/lightship-js/src/Solarfield/Lightship/ControllerPlugins',
	],
	function (
		ObjectUtils, Route
	) {
		"use strict";
		
		/**
		 * @class Context
		 */
		return ObjectUtils.extend(null, {
			/**
			 * @return {Route}
			 */
			getRoute: function () {
				return this._slc_route;
			},
			
			/**
			 * @param {Route} aRoute
			 */
			setRoute: function (aRoute) {
				this._slc_route = (aRoute instanceof Route) ? aRoute : new Route(aRoute);
			},
			
			/**
			 * @param {Route} aRoute
			 * @constructor
			 */
			constructor: function (aRoute) {
				this._slc_route = aRoute;
			}
		});
	}
);
