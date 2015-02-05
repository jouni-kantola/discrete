var component = require('./discrete-component'),
    dom = require('./dom-poker');

var keyUpProducer = (function() {
    var markup = "<div>onKeyUp: <input type='text' id='producerOnKeyUp' /></div>",
        c = component(markup),
        el = c.create();

    dom.add(el, function() {
        c.publish('producerOnKeyUp', 'keyup', 'producer/keyup');
    });
})();

var inputProducer = (function() {
    var markup = "<div>onInput: <input type='text' id='producerOnInput' /></div>",
        c = component(markup),
        el = c.create();
    dom.add(el, function() {
        c.publish('producerOnInput', 'input', 'producer/input');
    });
})();

var keyPressConsumer = (function() {
    var markup = "<label id='consumer'>{{=it.text || ''}}</label>",
        model = {
            text: 'Go ahead, try the textboxes...'
        },
        c = component(markup, model),
        el = c.create();

    dom.add(el, function() {
        c.subscribe('producer/keyup',
            function(msg) {
                c.update({
                    text: msg.data
                });
            });

        c.subscribe('producer/input',
            function(msg) {
                c.update({
                    text: msg.data
                });
            });
    });
})();
