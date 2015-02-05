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
        el,
        vtree;

    return {
        create: function() {
            vtree = createVTree(compiledTemplate);
            el = createElement(vtree);
            return el;
        },
        update: function(model) {
            var updatedTemplate = template(markup)(model);
            if(compiledTemplate === updatedTemplate)
                return;
            var newTree = createVTree(updatedTemplate);
            var patches = diff(vtree, newTree);
            el = patch(el, patches);
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
