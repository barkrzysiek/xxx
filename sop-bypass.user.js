// ==UserScript==
// @name        Strażnik Murków - obejście Same Origin Policy
// @include     https://gorski-the-great.github.io/twwalls/app/*
// @grant       GM_xmlhttpRequest
// @connect     pl172.plemiona.pl
// @connect     pl.twstats.com
// ==/UserScript==

function crossOriginSuccessWrapper(v){
    unsafeWindow._CROSS_ORIGIN_REQ_DATA = v.responseText;
    setTimeout("window._CROSS_ORIGIN_REQ_SUCCESS(window._CROSS_ORIGIN_REQ_DATA)", 1);
}

function crossOriginErrorWrapper(v){
    setTimeout("window._CROSS_ORIGIN_REQ_FAIL({'status':'Unknown'})", 1);
}

function receiveMessage(event){
    GM_xmlhttpRequest({
        method: 'GET',
        url: unsafeWindow._CROSS_ORIGIN_REQ_URL,
        onload: crossOriginSuccessWrapper,
        error: crossOriginErrorWrapper
    });
}
window.addEventListener("message", receiveMessage, false);

function crossOriginRequest(url, success, error){
    window._CROSS_ORIGIN_REQ_URL = url;
    window._CROSS_ORIGIN_REQ_SUCCESS = success;
    window._CROSS_ORIGIN_REQ_FAIL = error;
    window.postMessage("crossOriginRequest", "*");
}

var s = document.createElement('script');
s.innerHTML = crossOriginRequest.toString();
document.body.appendChild(s);

