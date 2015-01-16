/*var VNode = require('virtual-dom/vnode/vnode')
var VText = require('virtual-dom/vnode/vtext')
var convertHTML = require('html-to-vdom')({
        VNode: VNode,
        VText: VText
})*/
var createElement = require('virtual-dom/create-element')
var Q = require('q')
function discrete() {
    return {
        init: function(){
           var tree = document.body.inner 
        },
        bootstrap: function (template, id, model) {
            // find custom element
            // bind model
            // render html with dot
            // create and store html hash
            // create vdom element with html-to-vdom
            // inject into virtual-dom 
            // return promise
        },
        subscribe: function (events) {
            // for all subscribed events add subscriptions
        },
        act: function (handler) {
            handler()
        },
        patch: function (template, model) {
            // render html w/ dot
            // render and compare html hash
            // if needed:
            // create vdom element w/ html-to-vdom
            // inject into virtual-dom
            // return promise
        }
    }
}

module.exports = discrete();
