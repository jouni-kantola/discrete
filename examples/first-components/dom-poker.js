var Bacon = require('baconjs');

function observe(elId, eventType, callback) {
    Bacon.fromEventTarget(document.getElementById(elId), eventType).onValue(callback);
}

function add(node) {
    document.body.appendChild(node);
}

module.exports = {
    observe: observe,
    add: add
};
