var discrete = require('discrete'),
    bacon = require('bacon')

var id = "first-producer",
    model = {
        text: '',
        value: ''
    },
    template = 'producer-textbox'

discrete.bootstrap(template, id, model);

discrete.subscribe([]);

discrete.act((target) => {
    target.asEventStream("keyup")
        .debounce(100) // don't call me more often than every 100ms
        .onValue((event, args) => {
            if (event.target.value !== model.value) {
                console.log(event.target.value)
                model.value = event.target.value
                discrete.publish({
                    msg: 'producer/textbox/value/changed',
                    value: event.target.value
                })

            }
        })
})
