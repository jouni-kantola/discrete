var Bacon = require('baconjs');

function runOnLoad(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function observe(elId, eventType, callback) {
    runOnLoad(function() {
        Bacon.fromEventTarget(document.getElementById(elId), eventType).onValue(callback);
    });
}

function add(el, callback) {
    runOnLoad(function() {
        document.body.appendChild(el);
        if (callback) {
            callback();
        }
    });
}

module.exports = {
    observe: observe,
    add: add
};
