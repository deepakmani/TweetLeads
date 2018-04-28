"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../common/utils");
// For EventEmitter
const EE_ADD_LISTENER = 'addListener';
const EE_PREPEND_LISTENER = 'prependListener';
const EE_REMOVE_LISTENER = 'removeListener';
const EE_LISTENERS = 'listeners';
const EE_ON = 'on';
const zoneAwareAddListener = utils_1.makeZoneAwareAddListener(EE_ADD_LISTENER, EE_REMOVE_LISTENER, false, true);
const zoneAwarePrependListener = utils_1.makeZoneAwareAddListener(EE_PREPEND_LISTENER, EE_REMOVE_LISTENER, false, true);
const zoneAwareRemoveListener = utils_1.makeZoneAwareRemoveListener(EE_REMOVE_LISTENER, false);
const zoneAwareListeners = utils_1.makeZoneAwareListeners(EE_LISTENERS);
function patchEventEmitterMethods(obj) {
    if (obj && obj.addListener) {
        utils_1.patchMethod(obj, EE_ADD_LISTENER, () => zoneAwareAddListener);
        utils_1.patchMethod(obj, EE_PREPEND_LISTENER, () => zoneAwarePrependListener);
        utils_1.patchMethod(obj, EE_REMOVE_LISTENER, () => zoneAwareRemoveListener);
        utils_1.patchMethod(obj, EE_LISTENERS, () => zoneAwareListeners);
        obj[EE_ON] = obj[EE_ADD_LISTENER];
        return true;
    }
    else {
        return false;
    }
}
exports.patchEventEmitterMethods = patchEventEmitterMethods;
// EventEmitter
let events;
try {
    events = require('events');
}
catch (err) {
}
if (events && events.EventEmitter) {
    patchEventEmitterMethods(events.EventEmitter.prototype);
}
//# sourceMappingURL=events.js.map