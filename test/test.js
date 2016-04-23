'use strict';
var nock = require('nock');
var chai = require('chai');
var should = chai.should();
var chaiAsPromised = require('chai-as-promised');
var moment = require('moment');
var crypto = require('crypto');
var MEITUAN = require('../index');

chai.use(chaiAsPromised);

const MEITUAN_REAL_HOST = 'http://waimaiopen.meituan.com';
const MEITUAN_TEST_HOST = 'http://test.waimaiopen.meituan.com';
const YOUR_APP_ID = 'yourappid';
const YOUR_APP_SECRET = 'yourappsecret';

describe('MEITUAN', function() {

    describe('get resource from realHost', function() {
        it('should get expected response', function() {
            let path = '/api/v1/order/confirm';
            nock(MEITUAN_REAL_HOST + path)
                .log(console.log)
                .get('')
                .query(true)
                .reply(200, {
                    data: 'ok'
                });
            let mt = new MEITUAN(YOUR_APP_ID, YOUR_APP_SECRET);
            let params = {
                order_id: '123'
            };
            return mt.get(path, params).should.eventually.deep.equal({
                data: 'ok'
            });
        });
    });

    describe('post resource to realHost', function() {
        it('should get expected response', function() {
            let path = '/api/v1/poi/open';
            let params = {
                app_poi_code: '25381'
            };
            nock(MEITUAN_REAL_HOST)
                .log(console.log)
                .post(path, params)
                .reply(200, {
                    'data': 'ok'
                });
            let mt = new MEITUAN(YOUR_APP_ID, YOUR_APP_SECRET);
            return mt.post(path, params).should.eventually.deep.equal({
                'data': 'ok'
            });
        });
    });


    describe('get resource from testHost for initial config', function() {
        it('should get expected response', function() {
            let path = '/api/v1/order/confirm';
            nock(MEITUAN_TEST_HOST + path)
                .log(console.log)
                .get('')
                .query(true)
                .reply(200, {
                    data: 'ok'
                });
            let mt = new MEITUAN(YOUR_APP_ID, YOUR_APP_SECRET, {
                debug: true
            });
            let params = {
                order_id: '123'
            };
            return mt.get(path, params).should.eventually.deep.equal({
                data: 'ok'
            });
        });
    });

    describe('get resource from testHost for dynamic config', function() {
        it('should get expected response', function() {
            let path = '/api/v1/order/cancel';
            nock(MEITUAN_TEST_HOST + path)
                .log(console.log)
                .get('')
                .query(true)
                .reply(200, {
                    data: 'ok'
                });
            let mt = new MEITUAN(YOUR_APP_ID, YOUR_APP_SECRET);
            mt.config({
                debug: true
            });
            let params = {
                order_id: '123',
                reason: 'somereasons'
            };
            return mt.get(path, params).should.eventually.deep.equal({
                data: 'ok'
            });
        });
    });

    describe('validate signature', function() {
        it('should return true when signature is valid', function() {
            let url = 'http://yourAddress';
            let params = {
                app_id: YOUR_APP_ID,
                timestamp: moment.unix(),
                order_id: '123',
                reason_code: '1001',
                reason: 'somereasons'
            };
            const rawString = [
                url,
                '?',
                Object.keys(params).sort().map(key => key + '=' + params[key]).join('&'),
                YOUR_APP_SECRET
            ].join('');
            params.sig = crypto
                .createHash('md5')
                .update(rawString, 'utf8')
                .digest('hex')
                .toLowerCase();
            let mt = new MEITUAN(YOUR_APP_ID, YOUR_APP_SECRET);
            let isValid = mt.validateSign(url, params);
            return Promise.resolve(isValid).should.eventually.be.true;
        });
        it('should return true when signature is invalid', function() {
            let url = 'http://yourAddress';
            let params = {
                app_id: YOUR_APP_ID,
                timestamp: moment.unix(),
                order_id: '123',
                reason_code: '1001',
                reason: 'somereasons',
                sig: 'thefakesign'
            };
            let mt = new MEITUAN(YOUR_APP_ID, YOUR_APP_SECRET);
            let isValid = mt.validateSign(url, params);
            return Promise.resolve(isValid).should.eventually.be.false;
        });
    });
});