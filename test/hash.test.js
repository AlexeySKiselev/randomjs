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
    it('should be uniformly distributed', function(done) {
        this.timeout(480000);
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
    it('should return different values for different seed', () => {
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
});
