var bus = require('./bus'),
    component = require('./discrete-component'),
    dom = require('./dom-poker');

var keyUpProducer = (function() {
    var markup = "<div>onKeyUp: <input type='text' id='producerOnKeyUp' /></div>",
        c = component(markup, null, function() {
            dom.observe('producerOnKeyUp', 'keyup', function(event) {
                bus.publish('producer/keyup', event.target.value);
            });
        });
    dom.add(c.create());
    c.pubSub();
})();

var inputProducer = (function() {
    var markup = "<div>onInput: <input type='text' id='producerOnInput' /></div>",
        c = component(markup, null, function() {
            dom.observe('producerOnInput', 'input', function(event) {
                bus.publish('producer/input', event.target.value);
            });
        });
    dom.add(c.create());
    c.pubSub();
})();

var keyPressConsumer = (function() {
    var markup = "<label id='consumer'>{{=it.text || ''}}</label>",
        model = {
            text: 'Go ahead, try the textboxes...'
        },
        c = component(markup, model, null, function() {
            bus.subscribe('producer/keyup', function(msg) {
                c.update({
                    text: msg.data
                });
            });
            bus.subscribe('producer/input', function(msg) {
                c.update({
                    text: msg.data
                });
            });
        });
    dom.add(c.create());
    c.pubSub();
})();
