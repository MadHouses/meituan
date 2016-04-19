'use strict';
var moment = require('moment');
var rp = require("request-promise");
var crypto = require('crypto');

const CONFIG = {
    realHost: 'http://waimaiopen.meituan.com/api',
    testHost: 'http://test.waimaiopen.meituan.com/api',
    debug: false
};

function MEITUAN(appId, secret, config) {
    this.appId = appId;
    this.secret = secret;
    this.config = Object.assign(CONFIG, config);
    this.host = this.config.debug ? this.config.testHost : this.config.realHost;
}

MEITUAN.prototype.sign = function (url, params) {
    params.timestamp = moment().unix();
    params.app_id = this.appId;
    const rawString = [
        url,
        '?',
        Object.keys(params).sort().map(key => key + '=' + params[key]).join('&'),
        this.secret
    ].join('');
    params.sig = crypto
        .createHash('md5')
        .update(rawString, 'utf8')
        .digest('hex')
        .toLowerCase();
    return params;
}

MEITUAN.prototype.get = function (path, params) {
    let url = this.host + path;
    this.sign(url, params);
    return rp({
        uri: url,
        qa: params,
        json: true
    });
}

MEITUAN.prototype.post = function (path, params) {
    let url = this.host + path;
    this.sign(url, params);
    return rp({
        method: 'POST',
        uri: url,
        body: params,
        json: true
    });
}

module.exports = MEITUAN;