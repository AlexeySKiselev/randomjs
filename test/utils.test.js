/**
 * Tests for Utils
 * Created by Alexey S. Kiselev
 */

// Import Mocha tool for tests
let chai = require('chai'),
    expect = chai.expect,
    {describe, it} = require('mocha');

chai.should();

describe('Utils', () => {
    let Utils = require('../lib/utils/utils'),
        methods = Object.getOwnPropertyNames(Utils);

    it('should has static method "gamma"', () => {
        expect(methods).to.include.members(['gamma']);
    });
    it('should has static method "digamma"', () => {
        expect(methods).to.include.members(['digamma']);
    });

    // Gamma function
    describe('Gamma function', () => {
        it('should return 1 for Gamma(1)', () => {
            expect(Utils.gamma(1)).to.be.a('number');
            expect(Utils.gamma(1)).to.be.closeTo(1, 0.00001);
        });
        it('should be "n-1" times bigger then previous Gamma(n-1)', () => {
            for(let i = 1; i < 10; i += 1) {
                expect(Utils.gamma(i)).to.be.a('number');
                expect(Utils.gamma(i+1)).to.be.closeTo(i * Utils.gamma(i), 0.00001);
            }
        });
        it('should return sqrt(PI)+-0.00001 for non-integer 0.5 value', () => {
            expect(Utils.gamma(0.5)).to.be.a('number');
            expect(Utils.gamma(0.5)).to.be.closeTo(Math.sqrt(Math.PI), 0.00001);
        });
        it('should return 0.886227+-0.00001 for Gamma(1.5)', () => {
            expect(Utils.gamma(1.5)).to.be.a('number');
            expect(Utils.gamma(1.5)).to.be.closeTo(0.886227, 0.00001);
        });
        it('should return 3.323351+-0.00001 for Gamma(3.5)', () => {
            expect(Utils.gamma(3.5)).to.be.a('number');
            expect(Utils.gamma(3.5)).to.be.closeTo(3.323351, 0.00001);
        });
        it('should return 0.902745+-0.00001 for Gamma(5/3)', () => {
            expect(Utils.gamma(5 / 3)).to.be.a('number');
            expect(Utils.gamma(5 / 3)).to.be.closeTo(0.902745, 0.00001);
        });
        it('should return 2.678939+-0.00001 for Gamma(1/3)', () => {
            expect(Utils.gamma(1 / 3)).to.be.a('number');
            expect(Utils.gamma(1 / 3)).to.be.closeTo(2.678939, 0.00001);
        });
        it('should return 2593.566177+-0.00001 for Gamma(23/3)', () => {
            expect(Utils.gamma(23 / 3)).to.be.a('number');
            expect(Utils.gamma(23 / 3)).to.be.closeTo(2593.566177, 0.00001);
        });
        it('should satisfy Euler reflection formula for z = 0.4 and z = 0.6', () => {
            expect(Utils.gamma(0.4)).to.be.a('number');
            expect(Utils.gamma(0.6)).to.be.a('number');
            expect(Utils.gamma(0.4) * Utils.gamma(0.6)).to.be.closeTo(Math.PI / Math.sin(Math.PI * 0.4), 0.00001);
            expect(Utils.gamma(0.4) * Utils.gamma(0.6)).to.be.closeTo(Math.PI / Math.sin(Math.PI * 0.6), 0.00001);
        });
        it('should satisfy duplication formula', () => {
            let z = 0.4;
            expect(Utils.gamma(z)).to.be.a('number');
            expect(Utils.gamma(z) * Utils.gamma(z + 0.5)).to.be.closeTo(Math.pow(2, 1 - 2 * z) * Math.sqrt(Math.PI) * Utils.gamma(2 * z), 0.00001);
            z = 0.9;
            expect(Utils.gamma(z)).to.be.a('number');
            expect(Utils.gamma(z) * Utils.gamma(z + 0.5)).to.be.closeTo(Math.pow(2, 1 - 2 * z) * Math.sqrt(Math.PI) * Utils.gamma(2 * z), 0.00001);
            z = 1.1;
            expect(Utils.gamma(z)).to.be.a('number');
            expect(Utils.gamma(z) * Utils.gamma(z + 0.5)).to.be.closeTo(Math.pow(2, 1 - 2 * z) * Math.sqrt(Math.PI) * Utils.gamma(2 * z), 0.00001);
            z = 2;
            expect(Utils.gamma(z)).to.be.a('number');
            expect(Utils.gamma(z) * Utils.gamma(z + 0.5)).to.be.closeTo(Math.pow(2, 1 - 2 * z) * Math.sqrt(Math.PI) * Utils.gamma(2 * z), 0.00001);
        });
        it('should satisfy log equation', () => {
            let z = 0.4;
            expect(Utils.gamma(z)).to.be.a('number');
            expect(Math.log(Utils.gamma(z))).to.be.closeTo(Math.log(Utils.gamma(z + 1)) - Math.log(z), 0.0001);
            z = 0.8;
            expect(Utils.gamma(z)).to.be.a('number');
            expect(Math.log(Utils.gamma(z))).to.be.closeTo(Math.log(Utils.gamma(z + 1)) - Math.log(z), 0.0001);
            z = 1;
            expect(Utils.gamma(z)).to.be.a('number');
            expect(Math.log(Utils.gamma(z))).to.be.closeTo(Math.log(Utils.gamma(z + 1)) - Math.log(z), 0.0001);
            z = 1.5;
            expect(Utils.gamma(z)).to.be.a('number');
            expect(Math.log(Utils.gamma(z))).to.be.closeTo(Math.log(Utils.gamma(z + 1)) - Math.log(z), 0.0001);
        });
        it('should receive only positive values', () => {
            let badParam = () => {
                let gamma = Utils.gamma(-1);
                return gamma;
            };
            badParam.should.throw(Error);
        });
    });

    // Digamma function
    describe('Digamma function', () => {
        it('should be equal minus Euler\'s constant +-0.002 for argument 1', () => {
            expect(Utils.digamma(1)).to.be.a('number');
            expect(Utils.digamma(1)).to.be.closeTo(-0.5772156649, 0.002);
        });
        it('should be equal -1.96351002602+-0.002 for argument 1/2', () => {
            expect(Utils.digamma(1/2)).to.be.a('number');
            expect(Utils.digamma(1/2)).to.be.closeTo(-1.96351002602, 0.002);
        });
        it('should be equal -3.132033780019273+-0.002 for argument 1/3', () => {
            expect(Utils.digamma(1/3)).to.be.a('number');
            expect(Utils.digamma(1/3)).to.be.closeTo(-3.132033780019273, 0.002);
        });
        it('should be equal -6.332127505373381+-0.002 for argument 1/6', () => {
            expect(Utils.digamma(1/6)).to.be.a('number');
            expect(Utils.digamma(1/6)).to.be.closeTo(-6.332127505373381, 0.002);
        });
        it('should be on "1 / (n-1)" bigger then previous Digamma(n-1)', () => {
            for(let i = 1; i < 10; i += 1) {
                expect(Utils.digamma(i)).to.be.a('number');
                expect(Utils.digamma(i+1)).to.be.closeTo(Utils.digamma(i) + 1/i, 0.01);
            }
        });
        it('for sum of Digamma of values < 1 from 1/m to 1 should returns -m(<Euler constant> + ln(m))', () => {
            let digammaSum = 0,
                m = 10;
            for(let i = 1; i <= m; i += 1 ) {
                digammaSum += Utils.digamma(i / m);
            }
            expect(digammaSum).to.be.a('number');
            expect(digammaSum).to.be.closeTo(-m * (0.5772156649 + Math.log(m)), 0.01);
        });
        it('for sum of (Digamma of values < 1 from 1/(m-1) to 1)*sin(2Pirk)/n should returns Pi(2k - m)/ 2 for every k from 1 to m-1', () => {
            let m = 10,
                digammaSum;
            for(let k = 1; k <= m-1; k+= 1) {
                digammaSum = 0;
                for(let i = 1; i <= m-1; i += 1) {
                    digammaSum += Utils.digamma(i / m) * Math.sin(2 * Math.PI * i * k / m);
                }

                expect(digammaSum).to.be.a('number');
                expect(digammaSum).to.be.closeTo(Math.PI * (2 * k - m) / 2, 0.01);
            }
        });
        it('should receive only positive values', () => {
            let badParam = () => {
                let digamma = Utils.digamma(-1);
                return digamma;
            };
            badParam.should.throw(Error);
        });
    });
});
