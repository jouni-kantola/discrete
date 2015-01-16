function discrete() {
    return {
        bootstrap: (template, id, model) => {
            // find custom element
            // bind model
            // render html with dot
            // create and store html hash
            // create vdom element with html-to-vdom
            // inject into virtual-dom 
            // return promise
        },
        subscribe: (events) => {
            // for all subscribed events add subscriptions
        },
        act: (handler) => {
            handler()
        },
        patch: (template, model) => {
            // render html w/ dot
            // render and compare html hash
            // if needed:
            // create vdom element w/ html-to-vdom
            // inject into virtual-dom
            // return promise
        }
    }
}
