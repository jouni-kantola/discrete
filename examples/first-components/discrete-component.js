var createElement = require('virtual-dom/create-element'),
    diff = require('virtual-dom/diff'),
    patch = require('virtual-dom/patch'),
    template = require('./template-compiler'),
    createVTree = require('./virtual-reality'),
    bus = require('./bus'),
    dom = require('./dom-poker');

module.exports = function(markup, model) {
    var m = model || {},
        compiledTemplate = template(markup)(m),
        node,
        vtree;

    return {
        create: function() {
            vtree = createVTree(compiledTemplate);
            node = createElement(vtree);
            return node;
        },
        update: function(model) {
            var newTree = createVTree(template(markup)(model));
            var patches = diff(vtree, newTree);
            node = patch(node, patches);
            vtree = newTree;
        },
        publish: function(elId, onEventType, eventStreamType) {
            dom.observe(elId, onEventType, function(event) {
                bus.publish(eventStreamType, event.target.value);
            });
        },
        subscribe: function(eventType, callback) {
            bus.subscribe(eventType, callback);
        }
    };
};
