var Bacon = require('baconjs'),
    createElement = require('virtual-dom/create-element'),
    diff = require('virtual-dom/diff'),
    patch = require('virtual-dom/patch'),
    VNode = require('virtual-dom/vnode/vnode'),
    VText = require('virtual-dom/vnode/vtext'),
    bus = require('./bus'),
    template = require('./template-compiler');

var convertHTML = require('html-to-vdom')({
    VNode: VNode,
    VText: VText
});

var keyUpProducer = (function() {
    var markup = "<div>onKeyUp: <input type='text' id='producerOnKeyUp' /></div>",
        compiledTemplate = template(markup)({});
    return {
        template: compiledTemplate,
        render: function() {

            var html = convertHTML(compiledTemplate);
            var node = createElement(html);
            document.body.appendChild(node);
        },
        publish: function() {

            observe('producerOnKeyUp', 'input', function(event) {
                bus.publish('producer/keyup', event.target.value);
            });
        }

    };
})();

var inputProducer = (function() {
    var markup = "<div>onInput: <input type='text' id='producerOnInput' /></div>",
        compiledTemplate = template(markup)({});
    return {
        template: compiledTemplate,
        render: function() {

            var html = convertHTML(compiledTemplate);
            var node = createElement(html);
            document.body.appendChild(node);
        },
        publish: function() {

            observe('producerOnInput', 'input', function(event) {
                bus.publish('producer/input', event.target.value);
            });
        }

    };

})();

function observe(elId, eventType, callback) {
    Bacon.fromEventTarget(document.getElementById(elId), eventType).onValue(callback);
}
var keyPressConsumer = (function() {
    var markup = "<label id='consumer'>{{=it.text || ''}}</label>",
        initValue = {
            text: 'Go ahead, try the textboxes...'
        },
        compiledTemplate = template(markup)(initValue),
        node, vtree;

    function dumDaDOM(model) {
        var newTree = convertHTML(template(markup)(model));
        var patches = diff(vtree, newTree);
        node = patch(node, patches);
        vtree = newTree;
    }

    bus.subscribe('producer/keyup', function(msg) {
        dumDaDOM({
            text: msg.data
        });

    });

    bus.subscribe('producer/input', function(msg) {
        dumDaDOM({
            text: msg.data
        });

    });

    return {
        template: compiledTemplate,
        render: function() {
            vtree = convertHTML(compiledTemplate);
            node = createElement(vtree);
            document.body.appendChild(node);
        }
    };

})();

function addComponents() {
    inputProducer.render();
    keyUpProducer.render();
    keyPressConsumer.render();
    inputProducer.publish();
    keyUpProducer.publish();
}

if (document.readyState != 'loading') {
    addComponents();

} else {
    document.addEventListener('DOMContentLoaded', addComponents);

}
