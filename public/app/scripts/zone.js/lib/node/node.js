"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
require("../zone");
require("./events");
require("./fs");
const timers_1 = require("../common/timers");
const set = 'set';
const clear = 'clear';
const _global = typeof window === 'object' && window || typeof self === 'object' && self || global;
// Timers
const timers = require('timers');
timers_1.patchTimer(timers, set, clear, 'Timeout');
timers_1.patchTimer(timers, set, clear, 'Interval');
timers_1.patchTimer(timers, set, clear, 'Immediate');
const shouldPatchGlobalTimers = global.setTimeout !== timers.setTimeout;
if (shouldPatchGlobalTimers) {
    timers_1.patchTimer(_global, set, clear, 'Timeout');
    timers_1.patchTimer(_global, set, clear, 'Interval');
    timers_1.patchTimer(_global, set, clear, 'Immediate');
}
// Crypto
let crypto;
try {
    crypto = require('crypto');
}
catch (err) {
}
// TODO(gdi2290): implement a better way to patch these methods
if (crypto) {
    let nativeRandomBytes = crypto.randomBytes;
    crypto.randomBytes = function randomBytesZone(size, callback) {
        if (!callback) {
            return nativeRandomBytes(size);
        }
        else {
            let zone = Zone.current;
            var source = crypto.constructor.name + '.randomBytes';
            return nativeRandomBytes(size, zone.wrap(callback, source));
        }
    }.bind(crypto);
    let nativePbkdf2 = crypto.pbkdf2;
    crypto.pbkdf2 = function pbkdf2Zone(...args) {
        let fn = args[args.length - 1];
        if (typeof fn === 'function') {
            let zone = Zone.current;
            var source = crypto.constructor.name + '.pbkdf2';
            args[args.length - 1] = zone.wrap(fn, source);
            return nativePbkdf2(...args);
        }
        else {
            return nativePbkdf2(...args);
        }
    }.bind(crypto);
}
// HTTP Client
let httpClient;
try {
    httpClient = require('_http_client');
}
catch (err) {
}
if (httpClient && httpClient.ClientRequest) {
    let ClientRequest = httpClient.ClientRequest.bind(httpClient);
    httpClient.ClientRequest = function (options, callback) {
        if (!callback) {
            return new ClientRequest(options);
        }
        else {
            let zone = Zone.current;
            return new ClientRequest(options, zone.wrap(callback, 'http.ClientRequest'));
        }
    };
}
//# sourceMappingURL=node.js.map