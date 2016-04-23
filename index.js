'use strict';
var moment = require('moment');
var rp = require("request-promise");
var crypto = require('crypto');

const CONFIG = {
    realHost: 'http://waimaiopen.meituan.com',
    testHost: 'http://test.waimaiopen.meituan.com',
    debug: false
};

function Meituan(appId, secret, config) {
    this.appId = appId;
    this.secret = secret;
    this.configuration = Object.assign(CONFIG, config);
}

Meituan.prototype.config = function(config) {
    this.configuration = Object.assign(this.configuration, config);
}

Meituan.prototype.getHost = function() {
    return this.configuration.debug ? this.configuration.testHost : this.configuration.realHost;
}

Meituan.prototype.sign = function(url, params) {
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

Meituan.prototype.validateSign = function(url, params) {
    let copy_params = Object.assign({}, params);
    const sig = copy_params.sig;
    delete copy_params.sig;
    const rawString = [
        url,
        '?',
        Object.keys(copy_params).sort().map(key => key + '=' + params[key]).join('&'),
        this.secret
    ].join('');
    return crypto
        .createHash('md5')
        .update(rawString, 'utf8')
        .digest('hex')
        .toLowerCase() === sig;
}

Meituan.prototype.get = function(path, params) {
    let url = this.getHost() + path;
    this.sign(url, params);
    return rp({
        uri: url,
        qs: params,
        json: true
    });
}

Meituan.prototype.post = function(path, params) {
    let url = this.getHost() + path;
    this.sign(url, params);
    return rp({
        method: 'POST',
        uri: url,
        body: params,
        json: true
    });
}

module.exports = Meituan;