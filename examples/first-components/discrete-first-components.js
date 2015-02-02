var Bacon = require('baconjs'),
    doT = require('dot'),
    createElement = require('virtual-dom/create-element'),
    diff = require('virtual-dom/diff'),
    patch = require('virtual-dom/patch'),
    VNode = require('virtual-dom/vnode/vnode'),
    VText = require('virtual-dom/vnode/vtext'),
    rootNode;

function template(markup) {
    var compiledTemplate = doT.template(markup);

    return function(model) {
        return compiledTemplate(model);
    };
}

var convertHTML = require('html-to-vdom')({
    VNode: VNode,
    VText: VText
});

var bus = (function() {
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

var keyUpProducer = (function() {
    var markup = "<div>onKeyUp: <input type='text' id='producerOnKeyUp' /></div>",
        compiledTemplate = template(markup)({});

    //Bacon.fromEventTarget(document.getElementById('producerOnKeyUp'), 'keyup')
    //    .onValue(function(event) {
    //        bus.publish(
    //            'producer/keyup',
    //            event.target.value

    //        );

    //    });
    return {
        template: compiledTemplate
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
        node = patch(rootNode, patches);
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
            var node = createElement(vtree);
            document.body.appendChild(node);
        }
    };

})();

function addComponents() {
    inputProducer.render();
    document.body.appendChild(createElement(convertHTML(keyUpProducer.template)));
    keyPressConsumer.render();
    inputProducer.publish();
}

if (document.readyState != 'loading') {
    addComponents();

} else {
    document.addEventListener('DOMContentLoaded', addComponents);

}
