var createElement = require('virtual-dom/create-element'),
    diff = require('virtual-dom/diff'),
    patch = require('virtual-dom/patch'),
    template = require('./template-compiler'),
    createVTree = require('./virtual-reality');

module.exports = function(markup, model, pub, sub) {
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
        pubSub: function() {
            if (pub) {
                pub.call(this);
            }
            if (sub) {
                sub.call(this);
            }
        }
    };
};
