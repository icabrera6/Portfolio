// CloudFront Function (cloudfront-js-2.0), viewer request, default behaviour.
// One canonical host and one URL for the Spanish home page:
//   www.icabrera-portfolio.com/*  -> 301 https://icabrera-portfolio.com/*
//   /index.html                   -> 301 /
var CANONICAL_HOST = 'icabrera-portfolio.com';

function queryString(qs) {
    var parts = [];
    for (var key in qs) {
        var entry = qs[key];
        var values = entry.multiValue ? entry.multiValue.map(function (v) { return v.value; }) : [entry.value];
        values.forEach(function (v) {
            parts.push(v === '' ? key : key + '=' + v);
        });
    }
    return parts.length ? '?' + parts.join('&') : '';
}

function handler(event) {
    var request = event.request;
    var host = request.headers.host ? request.headers.host.value : '';
    var uri = request.uri;

    if (host === CANONICAL_HOST && uri !== '/index.html') {
        return request;
    }

    var path = uri === '/index.html' ? '/' : uri;
    return {
        statusCode: 301,
        statusDescription: 'Moved Permanently',
        headers: {
            location: { value: 'https://' + CANONICAL_HOST + path + queryString(request.querystring) },
            'cache-control': { value: 'max-age=3600' }
        }
    };
}
