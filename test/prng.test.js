/**
 * Test for PRNG
 */

// Import Mocha tool for tests
let chai = require('chai'),
    expect = chai.expect,
    {describe, it} = require('mocha'),
    prng = require('../lib/prng/prngProxy').default,
    newPrng = require('../lib').newPrng;

chai.should();

const prngTest = (prngName) => {
    beforeEach(() => {
        prng.set_prng(prngName);
    });

    it('should cold started with .next() method', function(done) {
        this.timeout(480000);
        const values = [];
        for (let i = 0; i < 100; i += 1) {
            values[i] = 0;
        }
        let temp;
        for (let i = 0; i < 10000000; i += 1) {
            temp = prng.next();
            values[Math.floor(temp * 100)] += 1;
        }
        for (let v = 0; v < values.length; v += 1) {
            expect(values[v]).to.be.closeTo(100000, 2000); // 2%
        }
        done();
    });
    it('should maintain seed', () =>  {
        prng.seed(123456);
        expect(prng._seed).to.be.equal(123456);
        prng.seed('sample seed');
        expect(prng._seed).to.be.equal('sample seed');
        prng.seed();
        expect(prng._seed).to.be.equal(undefined);
    });
    it('should return single value for .random() method and array for .random(1) method', () => {
        expect(prng.random()).to.be.a('number');
        expect(prng.random(0)).to.be.an('number');
        expect(prng.random(-1)).to.be.an('number');
        expect(prng.random('abc')).to.be.an('number');
        expect(prng.random(1)).to.be.an('array');
        expect(prng.random(1).length).to.be.equal(1);
    });
    it('should return different values with different seed', () => {
        prng.seed(123456);
        const first = prng.random();
        prng.seed('sample seed');
        const second = prng.random();
        expect(second === first).to.be.equal(false);
        prng.seed('another seed');
        const third = prng.random();
        expect(third === second || third === first).to.be.equal(false);
    });
    it('should return same value every time with seed', function(done) {
        this.timeout(480000);
        prng.seed('seed test');
        const first = prng.random();
        let temp;
        for (let i = 0; i < 10000; i += 1) {
            temp = prng.random();
            expect(temp).to.be.closeTo(first, 0.000001);
        }
        done();
    });
    it('should return different value (uniformly distributed) every time without seed', function(done) {
        this.timeout(480000);
        prng.seed();
        const values = [];
        for (let i = 0; i < 100; i += 1) {
            values[i] = 0;
        }
        let temp;
        for (let i = 0; i < 10000000; i += 1) {
            temp = prng.random();
            values[Math.floor(temp * 100)] += 1;
        }
        for (let v = 0; v < values.length; v += 1) {
            expect(values[v]).to.be.closeTo(100000, 2000); // 2%
        }
        done();
    });
    it('should return uniformly distributed vector with seed', function(done) {
        this.timeout(480000);
        prng.seed('unirand');
        const values = [];
        for (let i = 0; i < 100; i += 1) {
            values[i] = 0;
        }
        let temp = prng.random(10000000);
        for (let i = 0; i < 10000000; i += 1) {
            values[Math.floor(temp[i] * 100)] += 1;
        }
        for (let v = 0; v < values.length; v += 1) {
            expect(values[v]).to.be.closeTo(100000, 2000); // 2%
        }
        done();
    });
    it('should return uniformly distributed vector without seed', function(done) {
        this.timeout(480000);
        prng.seed();
        const values = [];
        for (let i = 0; i < 100; i += 1) {
            values[i] = 0;
        }
        let temp = prng.random(4000000);
        for (let i = 0; i < 4000000; i += 1) {
            values[Math.floor(temp[i] * 100)] += 1;
        }

        for (let v = 0; v < values.length; v += 1) {
            expect(values[v]).to.be.closeTo(40000, 800); // 2%
        }
        done();
    });
    it('should return same seeded vector every time with seed', function(done) {
        this.timeout(480000);
        prng.seed('unirand');
        const first = prng.random(1000000);
        const check = (arr) => {
            const epsilon = 0.00001;
            if (arr.length !== first.length) {
                return false;
            }

            for (let i = 0; i < arr.length; i += 1) {
                if ((arr[i] > first[i] + epsilon) || (arr[i] < first[i] - epsilon)) {
                    return false;
                }
            }

            return true;
        };
        let temp;
        for (let i = 0; i < 20; i += 1) {
            temp = prng.random(1000000);
            expect(check(temp)).to.be.equal(true);
        }
        done();
    });
    it('should return different vector every time without seed', function(done) {
        this.timeout(480000);
        prng.seed();
        const first = prng.random(10);
        const check = (arr) => {
            const epsilon = 0.00001;
            if (arr.length !== first.length) {
                return false;
            }

            for (let i = 0; i < arr.length; i += 1) {
                if ((arr[i] > first[i] + epsilon) || (arr[i] < first[i] - epsilon)) {
                    return false;
                }
            }

            return true;
        };
        let temp,
            count = 0;
        for (let i = 0; i < 100000; i += 1) {
            temp = prng.random(10);
            if (check(temp)) {
                count += 1;
            }
        }
        expect(count).to.be.at.most(10);
        done();
    });
    it('should return different value with .next() method', () => {
        prng.seed(123456);
        const first = prng.random();
        const second = prng.next();
        expect(second === first).to.be.equal(false);
        const third = prng.next();
        expect(first === third || second === third).to.be.equal(false);
    });
    it('should have max value close to 1 and min close to 0', function(done) {
        this.timeout(480000);
        prng.seed('seed test');
        const random = prng.random(2000000);
        let max_v = -Infinity,
            min_v = +Infinity;
        for (let i = 0; i < 2000000; i += 1) {
            max_v = Math.max(max_v, random[i]);
            min_v = Math.min(min_v, random[i]);
        }
        expect(max_v).to.be.at.most(1);
        expect(max_v < 1).to.be.equal(true);
        expect(max_v).to.be.closeTo(1, 0.0001);
        expect(min_v).to.be.at.least(0);
        expect(min_v >= 0).to.be.equal(true);
        expect(min_v).to.be.closeTo(0, 0.0001);
        done();
    });
};

describe('PRNGProxy', () => {
    it('should throw an error for wrong PRNG', () => {
        let badPRNG = () => {
            prng.set_prng('abc');
        };
        badPRNG.should.throw(Error);

        let goodPRNG = () => {
            for (let p of prng.generators) {
                prng.set_prng(p);
            }
        };
        goodPRNG.should.not.throw(Error);
    });
});

describe('newPrng', () => {
    it('should support .random(), .randomInt(), .next(), .nextInt(), .seed() methods', () => {
        const prng = newPrng('tt800', 12345);
        expect(prng).to.have.property('random');
        expect(prng).to.respondsTo('random');

        expect(prng).to.have.property('randomInt');
        expect(prng).to.respondsTo('randomInt');

        expect(prng).to.have.property('next');
        expect(prng).to.respondsTo('next');

        expect(prng).to.have.property('nextInt');
        expect(prng).to.respondsTo('nextInt');

        expect(prng).to.have.property('seed');
        expect(prng).to.respondsTo('seed');
    });
    it('should support all allowed generators', () => {
        const prng = newPrng('default');
        const generators = prng.generators;

        for (let generator of generators) {
            let goodPrng = () => {
                return newPrng(generator);
            };
            goodPrng.should.not.throw(Error);
        }
    });
    it('should throw an error for unsupported generator', () => {
        let badPrng = () => {
            return newPrng('abc');
        };
        badPrng.should.throw(Error);
    });
    it('should support seed', () => {
        const prng = newPrng('tt800', 'unirand');
        expect(prng.random()).to.be.closeTo(prng.random(), 0.00001);

        const prngNoSeed = newPrng('tt800');
        expect(Math.abs(prngNoSeed.random() - prngNoSeed.random()) > 0.00001).to.be.equal(true);
    });
    it('should be independent', () => {
        const prng1 = newPrng('tt800', 'unirand');
        const prng2 = newPrng('tt800', 'random seed');
        const prng3 = newPrng('r250', 'unirand');

        expect(Math.abs(prng1.random() - prng2.random()) > 0.00001).to.be.equal(true);
        expect(Math.abs(prng2.random() - prng3.random()) > 0.00001).to.be.equal(true);
        expect(Math.abs(prng1.random() - prng3.random()) > 0.00001).to.be.equal(true);
    });
});

describe('tuchei PRNG', () =>  {
    prngTest('tuchei');
});

describe('xorshift PRNG', () =>  {
    prngTest('xorshift');
});

describe('kiss PRNG', () => {
    prngTest('kiss');
});

describe('parkMiller PRNG', () => {
    prngTest('parkmiller');
});

describe('coveyou PRNG', () => {
    prngTest('coveyou');
});

describe('knuthran2 PRNG', () => {
    prngTest('knuthran2');
});

describe('r250 PRNG', () => {
    prngTest('r250');
});

describe('mrg5 PRNG', () => {
    prngTest('mrg5');
});

describe('gfsr4 PRNG', () => {
    prngTest('gfsr4');
});

describe('dx1597 PRNG', () => {
    prngTest('dx1597');
});

describe('tt800 PRNG', () => {
    prngTest('tt800');
});

describe('xorwow PRNG', () => {
    prngTest('xorwow');
});

describe('mt19937 PRNG', () => {
    prngTest('mt19937');
});

describe('philox PRNG', () => {
    prngTest('philox');
});

describe('taus113 PRNG', () => {
    prngTest('taus113');
});

describe('swb2712 PRNG', () => {
    prngTest('swb2712');
});
