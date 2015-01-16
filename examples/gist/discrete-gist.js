var Bacon = require('baconjs'),
    doT = require('dot'),
    createElement = require('virtual-dom/create-element'),
    diff = require('virtual-dom/diff'),
    patch = require('virtual-dom/patch'),
    VNode = require('virtual-dom/vnode/vnode'),
    VText = require('virtual-dom/vnode/vtext')

var convertHTML = require('html-to-vdom')
    ({
        VNode: VNode,
        VText: VText
    })

var bus = (function() {
    
  var eventBus = new Bacon.Bus(),
        subscriptions = {}

    eventBus.onValue(function(message) {
        console.dir(subscriptions)

        subscriptions[message.msg.msg]
            .forEach(function(eventHandler) {
                eventHandler(message)
            })
    })

    return {
        publish: function(msg, data) {
            eventBus.push({
                msg: msg,
                data: data
            })
        },
        subscribe: function(msg, eventHandler) {
            if (!subscriptions.hasOwnProperty(msg)) {
                subscriptions[msg] = []
            }
            subscriptions[msg].push(eventHandler)
        }
    }
})()

var model = {
    text: 'monkey'
}

function template() {
    var markup = "<div><input type='text' id='producer' /><label id='consumer'>{{=it.text || ''}}</label></div>";
    return doT.template(markup);
}

function render(template) {
    return template(model);
}

function fn() {
    var component = render(template());
    var vtree = convertHTML(component);
    var rootNode = createElement(vtree);
    document.body.appendChild(rootNode);

    Bacon.fromEventTarget(document.getElementById('producer'), 'keyup')
        .onValue(function(event) {
            if (event.target.value !== model.text) {
                bus.publish({
                    msg: 'producer/textbox/value/changed',
                    value: event.target.value
                })

            }
        })

    bus.subscribe('producer/textbox/value/changed', function(msg) {
        model.text = msg.value;
        var newTree = convertHTML(render(template()));
        var patches = diff(vtree, newTree);
        rootNode = patch(rootNode, patches);
        vtree = newTree;
    });
}

if (document.readyState != 'loading') {
    fn();
} else {
    document.addEventListener('DOMContentLoaded', fn);
}
