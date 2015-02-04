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

function add(node) {
    runOnLoad(function() {
        document.body.appendChild(node);
    });
}

module.exports = {
    observe: observe,
    add: add
};
