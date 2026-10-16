// CloudFront Function (cloudfront-js-2.0), viewer request, default behaviour.
//   www.icabrera-portfolio.com/*, *.cloudfront.net/*  -> 301 https://icabrera-portfolio.com/*
//   moved URLs (see MOVED)                           -> 301 to their new path
//   /folder                                          -> 301 /folder/
//   /folder/                                         -> served from /folder/index.html (S3 has no index documents)
var CANONICAL_HOST = 'icabrera-portfolio.com';

var MOVED = {
    '/index.html': '/',
    '/index-en.html': '/en/',
    '/en/index.html': '/en/',
    '/sitemap.xml': '/sitemap-index.xml'
};

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

function isFolderWithoutSlash(uri) {
    if (uri === '/' || uri.slice(-1) === '/') return false;
    var last = uri.split('/').pop();
    return !/\.[a-z0-9]+$/i.test(last);
}

function handler(event) {
    var request = event.request;
    var host = request.headers.host ? request.headers.host.value : '';
    var uri = request.uri;
    var target = MOVED[uri] || (isFolderWithoutSlash(uri) ? uri + '/' : null);

    if (host !== CANONICAL_HOST || target) {
        return {
            statusCode: 301,
            statusDescription: 'Moved Permanently',
            headers: {
                location: { value: 'https://' + CANONICAL_HOST + (target || uri) + queryString(request.querystring) },
                'cache-control': { value: 'max-age=3600' }
            }
        };
    }

    if (uri.slice(-1) === '/') {
        request.uri = uri + 'index.html';
    }
    return request;
}
