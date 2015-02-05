var doT = require('dot');

module.exports = function(markup) {
    var compiledTemplate = doT.template(markup);

    return function(model) {
        return compiledTemplate(model);
    };
};
