// AJAX.js

AJAX = {};

AJAX.get = function(url, success, error){
    if (window.crossOriginRequest){
        return window.crossOriginRequest(url, success, error);
    }else{
        return $.ajax({
            'url': url,
            'success': success,
            'error': error,
            'dataType': 'text'
        });
    }
}