var bus = require('./bus'),
    component = require('./discrete-component'),
    dom = require('./dom-poker');

var keyUpProducer = (function() {
    var markup = "<div>onKeyUp: <input type='text' id='producerOnKeyUp' /></div>",
        c = component(markup);
    dom.add(c.create());
    c.publish('producerOnKeyUp', 'keyup', 'producer/keyup');
})();

var inputProducer = (function() {
    var markup = "<div>onInput: <input type='text' id='producerOnInput' /></div>",
        c = component(markup);
    dom.add(c.create());
    c.publish('producerOnInput', 'input', 'producer/input');
})();

var keyPressConsumer = (function() {
    var markup = "<label id='consumer'>{{=it.text || ''}}</label>",
        model = {
            text: 'Go ahead, try the textboxes...'
        },
        c = component(markup, model);

    dom.add(c.create());
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
})();
