/**
 * Test for PRNG
 */

// Import Mocha tool for tests
let chai = require('chai'),
    expect = chai.expect,
    {describe, it} = require('mocha'),
    prng = require('../lib/prng/prngProxy').default;

chai.should();

describe('PRNG', () =>  {
    it('should maintain seed', () =>  {
        prng.seed(123456);
        expect(prng._seed).to.be.equal(123456);
        prng.seed('sample seed');
        expect(prng._seed).to.be.equal('sample seed');
        prng.seed();
        expect(prng._seed).to.be.equal(undefined);
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
    it('should return same value every time with seed', () => {
        prng.seed('seed test');
        const first = prng.random();
        let temp;
        for (let i = 0; i < 10000; i += 1) {
            temp = prng.random();
            expect(temp).to.be.closeTo(first, 0.000001);
        }
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
            expect(values[v]).to.be.closeTo(100000, 1000);
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
            expect(values[v]).to.be.closeTo(100000, 1000);
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
        let temp = prng.random(30000000);
        for (let i = 0; i < 30000000; i += 1) {
            values[Math.floor(temp[i] * 100)] += 1;
        }

        for (let v = 0; v < values.length; v += 1) {
            expect(values[v]).to.be.closeTo(300000, 3000);
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
        for (let i = 0; i < 100; i += 1) {
            temp = prng.random(1000000);
            expect(check(temp)).to.be.equal(true);
        }
        done();
    });
    it('should return same seeded vector every time without seed', function(done) {
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
        const random = prng.random(10000000);
        let max_v = -1,
            min_v = 2;
        for (let i = 0; i < 10000000; i += 1) {
            max_v = Math.max(max_v, random[i]);
            min_v = Math.min(min_v, random[i]);
        }
        expect(max_v).to.be.at.most(1);
        expect(max_v).to.be.closeTo(1, 0.00001);
        expect(min_v).to.be.at.least(0);
        expect(min_v).to.be.closeTo(0, 0.00001);
        done();
    });
});
