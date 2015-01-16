(function() {
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
            subscriptions[message.msg]
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

    function template(markup) {
        var template = doT.template(markup)

        return function(model) {
            return template(model)
        }
    }

    function bootstrap() {
        var markup = "<div><input type='text' id='producer' /><label id='consumer'>{{=it.text || ''}}</label></div>"
        var render = template(markup)

        var component = render({
            text: 'Go ahead, use the textbox...'
        })
        var vtree = convertHTML(component)
        var rootNode = createElement(vtree)
        document.body.appendChild(rootNode)

        Bacon.fromEventTarget(document.getElementById('producer'), 'keyup')
            .onValue(function(event) {
                bus.publish(
                    'producer/textbox/value/changed',
                    event.target.value
                )
            })

        bus.subscribe('producer/textbox/value/changed', function(msg) {
            var newTree = convertHTML(render({
                text: msg.data
            }));
            var patches = diff(vtree, newTree);
            rootNode = patch(rootNode, patches);
            vtree = newTree;
        });
    }

    if (document.readyState != 'loading') {
        bootstrap();
    } else {
        document.addEventListener('DOMContentLoaded', bootstrap);
    }
})()
