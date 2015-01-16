var Bacon = require('baconjs');
var bus = new Bacon.Bus();
var doT = require('dot');
var VNode = require('virtual-dom/vnode/vnode');
var VText = require('virtual-dom/vnode/vtext');

var convertHTML = require('html-to-vdom')
    ({
        VNode: VNode,
        VText: VText
    })

var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');




var createElement = require('virtual-dom/create-element');
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

var subscriptions = {};

bus.onValue(function(message) {
    subscriptions[message.msg.msg]
        .forEach(function(eventHandler) {
            eventHandler(message);
        });
});

function publish(msg, data) {
    bus.push({
        msg: msg,
        data: data
    });
}

function subscribe(msg, eventHandler) {
    if (!subscriptions.hasOwnProperty(msg)) {
        subscriptions[msg] = [];
    }
    subscriptions[msg].push(eventHandler);
}

function fn() {
    var component = render(template());
    var vtree = convertHTML(component);
    var rootNode = createElement(vtree);
    document.body.appendChild(rootNode);

    Bacon.fromEventTarget(document.getElementById('producer'), 'keyup')
        .onValue(function(event) {
            if (event.target.value !== model.text) {
                publish({
                    msg: 'producer/textbox/value/changed',
                    value: event.target.value
                })

            }
        })

    subscribe('producer/textbox/value/changed', function(msg) {
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
