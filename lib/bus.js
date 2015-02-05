var Bacon = require('baconjs');

module.exports = (function() {
    var eventBus = new Bacon.Bus(),
        subscriptions = {};

    eventBus.onValue(function(message) {
        subscriptions[message.msg]
            .forEach(function(eventHandler) {
                eventHandler(message);
            });
    });

    return {
        publish: function(msg, data) {
            eventBus.push({
                msg: msg,
                data: data
            });
        },
        subscribe: function(msg, eventHandler) {
            if (!subscriptions.hasOwnProperty(msg)) {
                subscriptions[msg] = [];
            }
            subscriptions[msg].push(eventHandler);
        }
    };
})();
