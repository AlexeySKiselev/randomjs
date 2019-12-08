/**
 * Test for hash
 */

// Import Mocha tool for tests
let chai = require('chai'),
    expect = chai.expect,
    {describe, it} = require('mocha'),
    hashProxy = require('../lib/utils/hash').default;

chai.should();

describe('Hash', () => {
    it('should accept only number or string', () => {
        let zeroParams = () => {
            return hashProxy.hash();
        };
        zeroParams.should.throw(Error);

        let badParam = () => {
            return hashProxy.hash([1, 2, 3]);
        };
        badParam.should.throw(Error);

        let numberParam = () => {
            return hashProxy.hash(123);
        };
        numberParam.should.not.throw(Error);

        let stringParam = () => {
            return hashProxy.hash('unirand');
        };
        stringParam.should.not.throw(Error);
    });
    it('should be a number', () => {
        expect(hashProxy.hash('unirand')).to.be.a('number');
        expect(hashProxy.hash(1234567)).to.be.a('number');
    });
});
