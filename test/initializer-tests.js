var discrete = require('../lib/discrete'),
    expect = require('chai').expect

describe('discrete', function() {

    
    it('initializer should create vdom from layout', function() {
        return expect(discrete.init()).to.be.ok
    })

})
