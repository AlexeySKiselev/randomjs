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
    it('should be uniformly distributed, Murmur3 algorithm', function(done) {
        this.timeout(480000);
        hashProxy.setHashFunction('murmur');
        const generateRandomString = (size) => {
            let res = '';
            const input_str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            for (let i = 0; i < size; i += 1) {
                res += input_str[Math.floor(Math.random() * input_str.length)];
            }
            return res;
        };
        // generate hashes dict
        const hashes = {};

        // generate hashes
        let tempRandomStr;
        let tempHash;
        let tempIndex;
        for(let i = 0; i < 5000000; i += 1) {
            tempRandomStr = generateRandomString(50 + Math.floor(Math.random() * 250));
            tempHash = hashProxy.hash(tempRandomStr);

            tempIndex = Math.floor(tempHash / 10000000);
            if (!hashes[tempIndex]) {
                hashes[tempIndex] = 1;
            } else {
                hashes[tempIndex] += 1;
            }
        }
        let hashKeys = Object.keys(hashes);
        let valueToCompare = hashes[hashKeys[0]];
        for(let key of hashKeys) {
            expect(hashes[key]).to.be.closeTo(valueToCompare, 0.333 * valueToCompare);
        }
        done();
    });
    it('should be uniformly distributed, Jenkins algorithm', function(done) {
        this.timeout(480000);
        hashProxy.setHashFunction('jenkins');
        const generateRandomString = (size) => {
            let res = '';
            const input_str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            for (let i = 0; i < size; i += 1) {
                res += input_str[Math.floor(Math.random() * input_str.length)];
            }
            return res;
        };
        // generate hashes dict
        const hashes = {};

        // generate hashes
        let tempRandomStr;
        let tempHash;
        let tempIndex;
        for(let i = 0; i < 5000000; i += 1) {
            tempRandomStr = generateRandomString(50 + Math.floor(Math.random() * 250));
            tempHash = hashProxy.hash(tempRandomStr);

            tempIndex = Math.floor(tempHash / 10000000);
            if (!hashes[tempIndex]) {
                hashes[tempIndex] = 1;
            } else {
                hashes[tempIndex] += 1;
            }
        }
        let hashKeys = Object.keys(hashes);
        let valueToCompare = hashes[hashKeys[0]];
        for(let key of hashKeys) {
            expect(hashes[key]).to.be.closeTo(valueToCompare, 0.333 * valueToCompare);
        }
        done();
    });
    it('should return different values for different seed, Murmur3 algorithm', () => {
        hashProxy.setHashFunction('murmur');
        const hashes = {};
        const input_str = 'unirandtesting';
        let tempSeed;
        for (let i = 0; i < 10000; i += 1) {
            tempSeed = Math.floor(Math.random() * 10000000);
            hashes[hashProxy.hash(input_str, tempSeed)] = 1;
        }

        expect(Object.keys(hashes).length).to.be.at.least(9500);
    });
    it('should return different values for different seed, Jenkins algorithm', () => {
        hashProxy.setHashFunction('jenkins');
        const hashes = {};
        const input_str = 'unirandtesting';
        let tempSeed;
        for (let i = 0; i < 10000; i += 1) {
            tempSeed = Math.floor(Math.random() * 10000000);
            hashes[hashProxy.hash(input_str, tempSeed)] = 1;
        }

        expect(Object.keys(hashes).length).to.be.at.least(9500);
    });
    it('should return array of hashes', () => {
        const hash = hashProxy.hash('unirand', [1, 2, 3, 4, 5, 6]);
        expect(Array.isArray(hash)).to.be.equal(true);
        expect(hash.length).to.be.equal(6);
        for (let i = 0; i < hash.length; i += 1) {
            expect(hash[i]).to.be.a('number');
        }
    });
    it('should be bounded, Murmur3 algorithm', function(done) {
        this.timeout(480000);
        hashProxy.setHashFunction('murmur');
        let tempSeed, tempHash;
        for (let i = 0; i < 100000; i += 1) {
            tempSeed = Math.floor(Math.random() * 100000000);
            tempHash = hashProxy.hash('unirand_bounded_test_murmur3_algorithm', tempSeed);
            expect(tempHash).to.be.at.most(2147483647); // 2 ^ 31 - 1
            expect(tempHash).to.be.at.least(-2147483647); // -2 ^ 31 + 1
        }
        done();
    });
    it('should be bounded, Jenkins algorithm', function(done) {
        this.timeout(480000);
        hashProxy.setHashFunction('jenkins');
        let tempSeed, tempHash;
        for (let i = 0; i < 100000; i += 1) {
            tempSeed = Math.floor(Math.random() * 100000000);
            tempHash = hashProxy.hash('unirand_bounded_test_jenkins_algorithm', tempSeed);
            expect(tempHash).to.be.at.most(2147483647); // 2 ^ 31 - 1
            expect(tempHash).to.be.at.least(-2147483647); // -2 ^ 31 + 1
        }
        done();
    });
    it('should be bounded by modulo, Murmur3 algorithm', function(done) {
        this.timeout(480000);
        hashProxy.setHashFunction('murmur');
        let tempSeed, tempHash, tempModulo;
        for (let m = 0; m < 1000; m += 1) {
            tempModulo = Math.floor(Math.random() * 1000000);
            for (let i = 0; i < 10000; i += 1) {
                tempSeed = Math.floor(Math.random() * 100000000);
                tempHash = hashProxy.hash('unirand_bounded_test_murmur3_algorithm', tempSeed, tempModulo);
                expect(tempHash).to.be.at.most(tempModulo); // 2 ^ 31 - 1
            }
        }

        done();
    });
    it('should be bounded by modulo, Jenkins algorithm', function(done) {
        this.timeout(480000);
        hashProxy.setHashFunction('jenkins');
        let tempSeed, tempHash, tempModulo;
        for (let m = 0; m < 1000; m += 1) {
            tempModulo = Math.floor(Math.random() * 1000000);
            for (let i = 0; i < 10000; i += 1) {
                tempSeed = Math.floor(Math.random() * 100000000);
                tempHash = hashProxy.hash('unirand_bounded_test_murmur3_algorithm', tempSeed, tempModulo);
                expect(tempHash).to.be.at.most(tempModulo); // 2 ^ 31 - 1
            }
        }

        done();
    });
});
