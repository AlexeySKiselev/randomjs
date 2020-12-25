/**
 * Tests for random color
 * Created by Alexey S. Kiselev
 */

// Import Mocha tool for tests
let chai = require('chai'),
    expect = chai.expect,
    {describe, it} = require('mocha'),
    prng = require('../lib/prng/prngProxy').default;

chai.should();

describe('RandomColor', () => {
    beforeEach(() => {
        prng.seed();
    });
    before(() => {
        prng.seed();
    });
    const RandomColor = require('../lib/utils/randomColor').default;
    const unirand = require('../lib');
    it('requires at least one input argument', () => {
        let zeroParams = () => {
            return new RandomColor();
        };
        zeroParams.should.throw(Error);

        let badParam = () => {
            return new RandomColor('abc');
        };
        badParam.should.throw(Error);

        let badParam2 = () => {
            return new RandomColor([1, 2]);
        };
        badParam2.should.throw(Error);

        let badParam3 = () => {
            return new RandomColor(-1);
        };
        badParam3.should.throw(Error);

        let badParam4 = () => {
            return new RandomColor(1.1);
        };
        badParam4.should.throw(Error);

        let goodParam = () => {
            return new RandomColor(1);
        };
        goodParam.should.not.throw(Error);

        let goodParam2 = () => {
            return new RandomColor(0);
        };
        goodParam2.should.not.throw(Error);

        let goodParam3 = () => {
            return new RandomColor(0.5);
        };
        goodParam3.should.not.throw(Error);
    });
    it('should has methods: .randomColor, .nextColor', () => {
        let randomColor = new RandomColor(0.5);
        expect(randomColor).to.have.property('randomColor');
        expect(randomColor).to.respondsTo('randomColor');
        expect(randomColor).to.have.property('nextColor');
        expect(randomColor).to.respondsTo('nextColor');
    });
    it('should support rgb and hex types', () => {
        let badParam = () => {
            return unirand.randomColor(0.7, 1);
        };
        badParam.should.throw(Error);

        let badParam2 = () => {
            return unirand.randomColor(0.7, 'abc');
        };
        badParam2.should.throw(Error);

        let goodParam = () => {
            return unirand.randomColor(0.7, 'rgb');
        };
        goodParam.should.not.throw(Error);

        let goodParam2 = () => {
            return unirand.randomColor(0.7, 'hex');
        };
        goodParam2.should.not.throw(Error);

        const rgb = unirand.randomColor(0.7, 'rgb');
        expect(rgb).to.be.an('array');
        expect(rgb.length).to.be.equal(3);
        for (let i = 0; i < 3; i += 1) {
            expect(rgb[i]).to.be.a('number');
        }

        const hex = unirand.randomColor(0.7, 'hex');
        expect(hex).to.be.a('string');
        expect(hex.length).to.be.equal(7);

        const rgb2 = unirand.nextColor(0.7, 'rgb');
        expect(rgb2).to.be.an('array');
        expect(rgb2.length).to.be.equal(3);
        for (let i = 0; i < 3; i += 1) {
            expect(rgb2[i]).to.be.a('number');
        }

        const hex2 = unirand.nextColor(0.7, 'hex');
        expect(hex2).to.be.a('string');
        expect(hex2.length).to.be.equal(7);
    });
    it('should supports seed', () => {
        unirand.seed('unirand');
        const rgb1 = unirand.randomColor(0.7, 'rgb');
        const rgb2 = unirand.randomColor(0.7, 'rgb');
        const rgb3 = unirand.randomColor(0.7, 'rgb');

        for (let i = 0; i < 3; i += 1) {
            expect(rgb1[i]).to.be.equal(rgb2[i]);
        }

        for (let i = 0; i < 3; i += 1) {
            expect(rgb2[i]).to.be.equal(rgb3[i]);
        }

        unirand.seed('another seed');

        const hex1 = unirand.randomColor(0.7, 'hex');
        const hex2 = unirand.randomColor(0.7, 'hex');
        const hex3 = unirand.randomColor(0.7, 'hex');

        expect(hex1).to.be.equal(hex2);
        expect(hex2).to.be.equal(hex3);
    });
    it('should return number by default and array with n', () => {
        const res1 = unirand.randomColor(0.7, 'hex');
        expect(res1).to.be.a('string');

        const res2 = unirand.randomColor(0.7, 'hex', 5);
        expect(res2).to.be.an('array');
        expect(res2.length).to.be.equal(5);
        for (let i = 0; i < 5; i += 1) {
            expect(res2[i]).to.be.a('string');
        }
    });
    it('should generate correct color', function(done) {
        this.timeout(480000);
        const isRGBValid = (rgb) => {
            for (let i = 0; i < rgb.length; i += 1) {
                if (typeof rgb[i] !== 'number') {
                    return false;
                }
                if (rgb[i] < 0 || rgb[i] > 255) {
                    return false;
                }
            }
            return true;
        };
        const isHexValid = (hex) => {
            if (typeof hex !== 'string') {
                return false;
            }
            if (hex.length !== 7) {
                return false;
            }
            if (hex[0] !== '#') {
                return false;
            }

            return true;
        };
        unirand.seed();
        for (let i = 0; i < 100000; i += 1) {
            expect(isRGBValid(unirand.randomColor(0.7, 'rgb'))).to.be.equal(true);
        }

        unirand.seed('unirand');
        unirand.randomColor(0.7, 'rgb');
        for (let i = 0; i < 100000; i += 1) {
            expect(isRGBValid(unirand.nextColor(0.7, 'rgb'))).to.be.equal(true);
        }

        unirand.seed();
        for (let i = 0; i < 100000; i += 1) {
            expect(isHexValid(unirand.randomColor(0.7, 'hex'))).to.be.equal(true);
        }

        unirand.seed('unirand');
        unirand.randomColor(0.7, 'hex');
        for (let i = 0; i < 100000; i += 1) {
            expect(isHexValid(unirand.nextColor(0.7, 'hex'))).to.be.equal(true);
        }
        done();
    });
});
