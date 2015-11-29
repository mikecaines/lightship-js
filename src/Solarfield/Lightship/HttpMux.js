"use strict";

/**
 * @namespace Solarfield.Lightship
 */
Solarfield.Ok.defineNamespace('Solarfield.Lightship');




/**
 * @class Solarfield.Lightship.HttpMux
 * Utility wrapper for XMLHttpRequest, which ensures only one request is ever executed. Aborting of any currently
 * executing requests is handled automatically, and all begin/end events are fired in the correct order.
 */
Solarfield.Lightship.HttpMux = function (aRequestDefaults) {
	this._lhm_currentXhr = null;
	this._lhm_currentInfo = null;
	this._lhm_requestDefaults = null;
	this._lhm_listeners = {};

	this._lhm_handleXhrLoadend = this._lhm_handleXhrLoadend.bind(this);

	if (aRequestDefaults) {
		this.setRequestDefaults(aRequestDefaults);
	}
};

/**
 * @param {{
 *   url: string=,
 *   method: string=,
 *   data: *=,
 *   responseType: string=,
 *   onBegin: function=,
 *   onEnd: function=,
 * }} aRequest
 */
Solarfield.Lightship.HttpMux.prototype.send = function (aRequest) {
	var xhr, request;

	if (this._lhm_currentXhr) {
		this._lhm_currentXhr.abort();
	}

	request = this._lhm_normalizeRequest(aRequest);

	xhr = new XMLHttpRequest();
	xhr.responseType = request.responseType;
	xhr.addEventListener('loadend', this._lhm_handleXhrLoadend);

	this._lhm_currentXhr = xhr;

	this._lhm_currentInfo = {
		onBegin: request.onBegin,
		onEnd: request.onEnd
	};

	xhr.open(request.method, request.url);

	this._lhm_dispatchEvent({
		type: 'begin',
		currentTarget: this,
		xhr: xhr
	}, this._lhm_currentInfo, true);

	xhr.send(request.data);
};

Solarfield.Lightship.HttpMux.prototype.abort = function () {
	if (this._lhm_currentXhr) {
		this._lhm_currentXhr.abort();
	}
};

Solarfield.Lightship.HttpMux.prototype.setRequestDefaults = function (aDefaults) {
	this._lhm_requestDefaults = aDefaults;
};

Solarfield.Lightship.HttpMux.prototype.addEventListener = function (aType, aListener) {
	if (!(aType in this._lhm_listeners)) {
		this._lhm_listeners[aType] = [];
	}

	this._lhm_listeners[aType].push(aListener);
};

Solarfield.Lightship.HttpMux.prototype._lhm_handleXhrLoadend = function (aEvt) {
	var xhr = this._lhm_currentXhr;
	var info = this._lhm_currentInfo;

	this._lhm_currentXhr = null;
	this._lhm_currentInfo = null;

	this._lhm_dispatchEvent({
		type: 'end',
		currentTarget: this,
		xhr: xhr,
		response: xhr.response,
		responseType: xhr.responseType
	}, info, false);
};

Solarfield.Lightship.HttpMux.prototype._lhm_normalizeRequest = function (aRequest) {
	var request, k;

	request = {
		url: '',
		method: 'post',
		data: null,
		responseType: '',
		onBegin: null,
		onEnd: null
	};

	if (this._lhm_requestDefaults) {
		for (k in this._lhm_requestDefaults) {
			request[k] = this._lhm_requestDefaults[k];
		}
	}

	if (aRequest) {
		for (k in aRequest) {
			request[k] = aRequest[k];
		}
	}

	return request;
};

Solarfield.Lightship.HttpMux.prototype._lhm_dispatchEvent = function (aEvent, aInfo, aOrder) {
	var listeners, i, k;

	//queue persistent listeners
	listeners = (aEvent.type in this._lhm_listeners) ? this._lhm_listeners[aEvent.type].concat([]) : [];

	//queue one-time listener
	k = 'on' + Solarfield.Ok.strUpperCaseFirst(Solarfield.Ok.strDashToCamel(aEvent.type));
	if (k in aInfo) {
		if (aInfo[k]) {
			listeners[aOrder ? 'push' : 'unshift'](aInfo[k]);
		}
	}

	for (i = 0; i < listeners.length; i++) {
		listeners[i].call(this, aEvent);
	}
};
