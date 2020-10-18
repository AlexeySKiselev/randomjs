/**
 * Tests for String Utils
 * Created by Alexey S. Kiselev
 */

// Import Mocha tool for tests
let chai = require('chai'),
    expect = chai.expect,
    {describe, it} = require('mocha');

chai.should();

describe('String Utils', () => {
    const unirand = require('../lib');
    const StringUtils = unirand.stringutils;
    const methods = Object.getOwnPropertyNames(StringUtils);
    const checkLettersInAlphabet = (str, alphabet_indexes, first_letter) => {
        for (let s of str) {
            // for index 0
            if (s === first_letter) {
                continue;
            }
            if (!alphabet_indexes[s]) {
                return false;
            }
        }
        return true;
    };

    it('should has static method "random" and "next"', () => {
        expect(methods).to.include.members(['random', 'next']);
    });
    it('should has static method "randomAlphabetic" and "nextAlphabetic"', () => {
        expect(methods).to.include.members(['randomAlphabetic', 'nextAlphabetic']);
    });
    it('should has static method "randomAscii" and "nextAscii"', () => {
        expect(methods).to.include.members(['randomAscii', 'nextAscii']);
    });
    it('should has static method "randomAlphanumeric" and "nextAlphanumeric"', () => {
        expect(methods).to.include.members(['randomAlphanumeric', 'nextAlphanumeric']);
    });
    it('should has static method "randomNumeric" and "nextNumeric"', () => {
        expect(methods).to.include.members(['randomNumeric', 'nextNumeric']);
    });
    it('should has static method "randomBitString" and "nextBitString"', () => {
        expect(methods).to.include.members(['randomBitString', 'nextBitString']);
    });
    it('should has static method "randomUID" and "nextUID"', () => {
        expect(methods).to.include.members(['randomUID', 'nextUID']);
    });
    it('should has static method "randomHex" and "nextHex"', () => {
        expect(methods).to.include.members(['randomHex', 'nextHex']);
    });

    describe('.random and .next', () => {
        it('should generate random string for given length and alphabet', function(done) {
            this.timeout(480000);
            let stringLength;
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const alphabet_indexes = alphabet.split('')
                .reduce((res, letter, index) => {res[letter] = index; return res;}, {});
            let randomString;
            let letterOccurrence = alphabet.split('')
                .reduce((res, letter) => {res[letter] = 0; return res;}, {});
            for (let i = 0; i < 100000; i += 1) {
                stringLength = Math.floor(20 + 280 * Math.random());
                randomString = StringUtils.random(alphabet, stringLength);
                expect(randomString).to.be.a('string');
                expect(randomString.length).to.be.equal(stringLength);
                expect(checkLettersInAlphabet(randomString, alphabet_indexes, alphabet[0])).to.be.equal(true);
                for (let j = 0; j < stringLength; j += 1) {
                    letterOccurrence[randomString[j]] += 1;
                }
            }
            for (let i = 0; i < 100000; i += 1) {
                stringLength = Math.floor(20 + 280 * Math.random());
                randomString = StringUtils.next(alphabet, stringLength);
                expect(randomString).to.be.a('string');
                expect(randomString.length).to.be.equal(stringLength);
                expect(checkLettersInAlphabet(randomString, alphabet_indexes, alphabet[0])).to.be.equal(true);
                for (let j = 0; j < stringLength; j += 1) {
                    letterOccurrence[randomString[j]] += 1;
                }
            }
            for (let l of alphabet) {
                expect(letterOccurrence[l]).to.be.at.least(1);
            }
            done();
        });
        it('should generate random strings each time for unseeded prng', () => {
            unirand.seed();
            const randomStrings = {};
            let randomString;
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (let i = 0; i < 10000; i += 1) {
                randomString = StringUtils.random(alphabet, 50);
                randomStrings[randomString] = 1;
            }
            expect(Object.keys(randomStrings).length).to.be.equal(10000);
        });
        it('should generate random strings each time for seeded prng', () => {
            unirand.seed('unirand');
            const randomStrings = {};
            const nextStrings = {};
            let randomString;
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (let i = 0; i < 10000; i += 1) {
                randomString = StringUtils.random(alphabet, 50);
                randomStrings[randomString] = 1;
            }
            expect(Object.keys(randomStrings).length).to.be.equal(1);
            for (let i = 0; i < 10000; i += 1) {
                randomString = StringUtils.next(alphabet, 50);
                nextStrings[randomString] = 1;
            }
            expect(Object.keys(nextStrings).length).to.be.equal(10000);
        });
    });

    describe('.randomAlphabetic and .nextAlphabetic', () => {
        it('should generate random string for given length and alphabet', function(done) {
            this.timeout(480000);
            let stringLength;
            const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const alphabet_indexes = alphabet.split('')
                .reduce((res, letter, index) => {res[letter] = index; return res;}, {});
            let randomString;
            let letterOccurrence = alphabet.split('')
                .reduce((res, letter) => {res[letter] = 0; return res;}, {});
            for (let i = 0; i < 100000; i += 1) {
                stringLength = Math.floor(20 + 280 * Math.random());
                randomString = StringUtils.randomAlphabetic(stringLength);
                expect(randomString).to.be.a('string');
                expect(randomString.length).to.be.equal(stringLength);
                expect(checkLettersInAlphabet(randomString, alphabet_indexes, alphabet[0])).to.be.equal(true);
                for (let j = 0; j < stringLength; j += 1) {
                    letterOccurrence[randomString[j]] += 1;
                }
            }
            for (let i = 0; i < 100000; i += 1) {
                stringLength = Math.floor(20 + 280 * Math.random());
                randomString = StringUtils.nextAlphabetic(stringLength);
                expect(randomString).to.be.a('string');
                expect(randomString.length).to.be.equal(stringLength);
                expect(checkLettersInAlphabet(randomString, alphabet_indexes, alphabet[0])).to.be.equal(true);
                for (let j = 0; j < stringLength; j += 1) {
                    letterOccurrence[randomString[j]] += 1;
                }
            }
            for (let l of alphabet) {
                expect(letterOccurrence[l]).to.be.at.least(1);
            }
            done();
        });
        it('should generate random strings each time for unseeded prng', () => {
            unirand.seed();
            const randomStrings = {};
            let randomString;
            for (let i = 0; i < 10000; i += 1) {
                randomString = StringUtils.randomAlphabetic(50);
                randomStrings[randomString] = 1;
            }
            expect(Object.keys(randomStrings).length).to.be.equal(10000);
        });
        it('should generate random strings each time for seeded prng', () => {
            unirand.seed('unirand');
            const randomStrings = {};
            const nextStrings = {};
            let randomString;
            for (let i = 0; i < 10000; i += 1) {
                randomString = StringUtils.randomAlphabetic(50);
                randomStrings[randomString] = 1;
            }
            expect(Object.keys(randomStrings).length).to.be.equal(1);
            for (let i = 0; i < 10000; i += 1) {
                randomString = StringUtils.nextAlphabetic(50);
                nextStrings[randomString] = 1;
            }
            expect(Object.keys(nextStrings).length).to.be.equal(10000);
        });
    });

    describe('.randomAscii and .nextAscii', () => {
        it('should generate random string for given length and alphabet', function(done) {
            this.timeout(480000);
            let stringLength;
            const alphabet = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
            const alphabet_indexes = alphabet.split('')
                .reduce((res, letter, index) => {res[letter] = index; return res;}, {});
            let randomString;
            let letterOccurrence = alphabet.split('')
                .reduce((res, letter) => {res[letter] = 0; return res;}, {});
            for (let i = 0; i < 100000; i += 1) {
                stringLength = Math.floor(20 + 280 * Math.random());
                randomString = StringUtils.randomAscii(stringLength);
                expect(randomString).to.be.a('string');
                expect(randomString.length).to.be.equal(stringLength);
                expect(checkLettersInAlphabet(randomString, alphabet_indexes, alphabet[0])).to.be.equal(true);
                for (let j = 0; j < stringLength; j += 1) {
                    letterOccurrence[randomString[j]] += 1;
                }
            }
            for (let i = 0; i < 100000; i += 1) {
                stringLength = Math.floor(20 + 280 * Math.random());
                randomString = StringUtils.nextAscii(stringLength);
                expect(randomString).to.be.a('string');
                expect(randomString.length).to.be.equal(stringLength);
                expect(checkLettersInAlphabet(randomString, alphabet_indexes, alphabet[0])).to.be.equal(true);
                for (let j = 0; j < stringLength; j += 1) {
                    letterOccurrence[randomString[j]] += 1;
                }
            }
            for (let l of alphabet) {
                expect(letterOccurrence[l]).to.be.at.least(1);
            }
            done();
        });
        it('should generate random strings each time for unseeded prng', () => {
            unirand.seed();
            const randomStrings = {};
            let randomString;
            for (let i = 0; i < 10000; i += 1) {
                randomString = StringUtils.randomAscii(50);
                randomStrings[randomString] = 1;
            }
            expect(Object.keys(randomStrings).length).to.be.equal(10000);
        });
        it('should generate random strings each time for seeded prng', () => {
            unirand.seed('unirand');
            const randomStrings = {};
            const nextStrings = {};
            let randomString;
            for (let i = 0; i < 10000; i += 1) {
                randomString = StringUtils.randomAscii(50);
                randomStrings[randomString] = 1;
            }
            expect(Object.keys(randomStrings).length).to.be.equal(1);
            for (let i = 0; i < 10000; i += 1) {
                randomString = StringUtils.nextAscii(50);
                nextStrings[randomString] = 1;
            }
            expect(Object.keys(nextStrings).length).to.be.equal(10000);
        });
    });

    describe('.randomAlphanumeric and .nextAlphanumeric', () => {
        it('should generate random string for given length and alphabet', function(done) {
            this.timeout(480000);
            let stringLength;
            const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            const alphabet_indexes = alphabet.split('')
                .reduce((res, letter, index) => {res[letter] = index; return res;}, {});
            let randomString;
            let letterOccurrence = alphabet.split('')
                .reduce((res, letter) => {res[letter] = 0; return res;}, {});
            for (let i = 0; i < 100000; i += 1) {
                stringLength = Math.floor(20 + 280 * Math.random());
                randomString = StringUtils.randomAlphanumeric(stringLength);
                expect(randomString).to.be.a('string');
                expect(randomString.length).to.be.equal(stringLength);
                expect(checkLettersInAlphabet(randomString, alphabet_indexes, alphabet[0])).to.be.equal(true);
                for (let j = 0; j < stringLength; j += 1) {
                    letterOccurrence[randomString[j]] += 1;
                }
            }
            for (let i = 0; i < 100000; i += 1) {
                stringLength = Math.floor(20 + 280 * Math.random());
                randomString = StringUtils.nextAlphanumeric(stringLength);
                expect(randomString).to.be.a('string');
                expect(randomString.length).to.be.equal(stringLength);
                expect(checkLettersInAlphabet(randomString, alphabet_indexes, alphabet[0])).to.be.equal(true);
                for (let j = 0; j < stringLength; j += 1) {
                    letterOccurrence[randomString[j]] += 1;
                }
            }
            for (let l of alphabet) {
                expect(letterOccurrence[l]).to.be.at.least(1);
            }
            done();
        });
        it('should generate random strings each time for unseeded prng', () => {
            unirand.seed();
            const randomStrings = {};
            let randomString;
            for (let i = 0; i < 10000; i += 1) {
                randomString = StringUtils.randomAlphanumeric(50);
                randomStrings[randomString] = 1;
            }
            expect(Object.keys(randomStrings).length).to.be.equal(10000);
        });
        it('should generate random strings each time for seeded prng', () => {
            unirand.seed('unirand');
            const randomStrings = {};
            const nextStrings = {};
            let randomString;
            for (let i = 0; i < 10000; i += 1) {
                randomString = StringUtils.randomAlphanumeric(50);
                randomStrings[randomString] = 1;
            }
            expect(Object.keys(randomStrings).length).to.be.equal(1);
            for (let i = 0; i < 10000; i += 1) {
                randomString = StringUtils.nextAlphanumeric(50);
                nextStrings[randomString] = 1;
            }
            expect(Object.keys(nextStrings).length).to.be.equal(10000);
        });
    });

    describe('.randomNumeric and .nextNumeric', () => {
        it('should generate random string for given length and alphabet', function(done) {
            this.timeout(480000);
            let stringLength;
            const alphabet = '0123456789';
            const alphabet_indexes = alphabet.split('')
                .reduce((res, letter, index) => {res[letter] = index; return res;}, {});
            let randomString;
            let letterOccurrence = alphabet.split('')
                .reduce((res, letter) => {res[letter] = 0; return res;}, {});
            for (let i = 0; i < 100000; i += 1) {
                stringLength = Math.floor(20 + 280 * Math.random());
                randomString = StringUtils.randomNumeric(stringLength);
                expect(randomString).to.be.a('string');
                expect(randomString.length).to.be.equal(stringLength);
                expect(checkLettersInAlphabet(randomString, alphabet_indexes, alphabet[0])).to.be.equal(true);
                for (let j = 0; j < stringLength; j += 1) {
                    letterOccurrence[randomString[j]] += 1;
                }
            }
            for (let i = 0; i < 100000; i += 1) {
                stringLength = Math.floor(20 + 280 * Math.random());
                randomString = StringUtils.nextNumeric(stringLength);
                expect(randomString).to.be.a('string');
                expect(randomString.length).to.be.equal(stringLength);
                expect(checkLettersInAlphabet(randomString, alphabet_indexes, alphabet[0])).to.be.equal(true);
                for (let j = 0; j < stringLength; j += 1) {
                    letterOccurrence[randomString[j]] += 1;
                }
            }
            for (let l of alphabet) {
                expect(letterOccurrence[l]).to.be.at.least(1);
            }
            done();
        });
        it('should generate random strings each time for unseeded prng', () => {
            unirand.seed();
            const randomStrings = {};
            let randomString;
            for (let i = 0; i < 10000; i += 1) {
                randomString = StringUtils.randomNumeric(100);
                randomStrings[randomString] = 1;
            }
            expect(Object.keys(randomStrings).length).to.be.equal(10000);
        });
        it('should generate random strings each time for seeded prng', () => {
            unirand.seed('unirand');
            const randomStrings = {};
            const nextStrings = {};
            let randomString;
            for (let i = 0; i < 10000; i += 1) {
                randomString = StringUtils.randomNumeric(100);
                randomStrings[randomString] = 1;
            }
            expect(Object.keys(randomStrings).length).to.be.equal(1);
            for (let i = 0; i < 10000; i += 1) {
                randomString = StringUtils.nextNumeric(100);
                nextStrings[randomString] = 1;
            }
            expect(Object.keys(nextStrings).length).to.be.equal(10000);
        });
    });

    describe('.randomHex and .nextHex', () => {
        it('should generate random string for given length and alphabet', function(done) {
            this.timeout(480000);
            let stringLength;
            const alphabet = '0123456789abcdef';
            const alphabet_indexes = alphabet.split('')
                .reduce((res, letter, index) => {res[letter] = index; return res;}, {});
            let randomString;
            let letterOccurrence = alphabet.split('')
                .reduce((res, letter) => {res[letter] = 0; return res;}, {});
            for (let i = 0; i < 100000; i += 1) {
                stringLength = Math.floor(20 + 280 * Math.random());
                randomString = StringUtils.randomHex(stringLength);
                expect(randomString).to.be.a('string');
                expect(randomString.length).to.be.equal(stringLength);
                expect(checkLettersInAlphabet(randomString, alphabet_indexes, alphabet[0])).to.be.equal(true);
                for (let j = 0; j < stringLength; j += 1) {
                    letterOccurrence[randomString[j]] += 1;
                }
            }
            for (let i = 0; i < 100000; i += 1) {
                stringLength = Math.floor(20 + 280 * Math.random());
                randomString = StringUtils.nextHex(stringLength);
                expect(randomString).to.be.a('string');
                expect(randomString.length).to.be.equal(stringLength);
                expect(checkLettersInAlphabet(randomString, alphabet_indexes, alphabet[0])).to.be.equal(true);
                for (let j = 0; j < stringLength; j += 1) {
                    letterOccurrence[randomString[j]] += 1;
                }
            }
            for (let l of alphabet) {
                expect(letterOccurrence[l]).to.be.at.least(1);
            }
            done();
        });
        it('should generate random strings each time for unseeded prng', () => {
            unirand.seed();
            const randomStrings = {};
            let randomString;
            for (let i = 0; i < 10000; i += 1) {
                randomString = StringUtils.randomHex(100);
                randomStrings[randomString] = 1;
            }
            expect(Object.keys(randomStrings).length).to.be.equal(10000);
        });
        it('should generate random strings each time for seeded prng', () => {
            unirand.seed('unirand');
            const randomStrings = {};
            const nextStrings = {};
            let randomString;
            for (let i = 0; i < 10000; i += 1) {
                randomString = StringUtils.randomHex(100);
                randomStrings[randomString] = 1;
            }
            expect(Object.keys(randomStrings).length).to.be.equal(1);
            for (let i = 0; i < 10000; i += 1) {
                randomString = StringUtils.nextHex(100);
                nextStrings[randomString] = 1;
            }
            expect(Object.keys(nextStrings).length).to.be.equal(10000);
        });
    });

    describe('.randomBitString and .nextBitString', () => {
        it('should generate random string for given length and alphabet', function(done) {
            this.timeout(480000);
            let stringLength;
            const alphabet = '01';
            const alphabet_indexes = alphabet.split('')
                .reduce((res, letter, index) => {res[letter] = index; return res;}, {});
            let randomString;
            let letterOccurrence = alphabet.split('')
                .reduce((res, letter) => {res[letter] = 0; return res;}, {});
            for (let i = 0; i < 200000; i += 1) {
                stringLength = Math.floor(20 + 280 * Math.random());
                randomString = StringUtils.randomBitString(stringLength, 0.7);
                expect(randomString).to.be.a('string');
                expect(randomString.length).to.be.equal(stringLength);
                expect(checkLettersInAlphabet(randomString, alphabet_indexes, alphabet[0])).to.be.equal(true);
                for (let j = 0; j < stringLength; j += 1) {
                    letterOccurrence[randomString[j]] += 1;
                }
            }
            for (let i = 0; i < 200000; i += 1) {
                stringLength = Math.floor(20 + 280 * Math.random());
                randomString = StringUtils.nextBitString(stringLength, 0.7);
                expect(randomString).to.be.a('string');
                expect(randomString.length).to.be.equal(stringLength);
                expect(checkLettersInAlphabet(randomString, alphabet_indexes, alphabet[0])).to.be.equal(true);
                for (let j = 0; j < stringLength; j += 1) {
                    letterOccurrence[randomString[j]] += 1;
                }
            }
            for (let l of alphabet) {
                expect(letterOccurrence[l]).to.be.at.least(1);
            }
            expect(letterOccurrence['0'] / (letterOccurrence['0'] + letterOccurrence['1'])).to.be.closeTo(0.3, 0.02);
            expect(letterOccurrence['1'] / (letterOccurrence['0'] + letterOccurrence['1'])).to.be.closeTo(0.7, 0.02);
            done();
        });
        it('should generate string of "1" or "0" for given length and prob "p=1" or "p=0"', function(done) {
            this.timeout(480000);
            let stringLength;
            const alphabet1 = '1';
            const alphabet_indexes1 = alphabet1.split('')
                .reduce((res, letter, index) => {res[letter] = index; return res;}, {});
            let randomString;
            for (let i = 0; i < 100000; i += 1) {
                stringLength = 50;
                randomString = StringUtils.randomBitString(stringLength, 1.0);
                expect(randomString).to.be.a('string');
                expect(randomString.length).to.be.equal(stringLength);
                expect(checkLettersInAlphabet(randomString, alphabet_indexes1, alphabet1[0])).to.be.equal(true);
            }
            const alphabet0 = '0';
            const alphabet_indexes0 = alphabet0.split('')
                .reduce((res, letter, index) => {res[letter] = index; return res;}, {});
            for (let i = 0; i < 100000; i += 1) {
                stringLength = 50;
                randomString = StringUtils.nextBitString(stringLength, 0.0);
                expect(randomString).to.be.a('string');
                expect(randomString.length).to.be.equal(stringLength);
                expect(checkLettersInAlphabet(randomString, alphabet_indexes0, alphabet0[0])).to.be.equal(true);
            }
            done();
        });
        it('should throw error for wrong prob value', () => {
            const wrongProb1 = () => {
                StringUtils.randomBitString(10, 1.1);
            };
            wrongProb1.should.throw(Error);
            const wrongProb2 = () => {
                StringUtils.randomBitString(10, -0.1);
            };
            wrongProb2.should.throw(Error);
            const wrongProb3 = () => {
                StringUtils.randomBitString(10, 'abc');
            };
            wrongProb3.should.throw(Error);
            const wrongProb4 = () => {
                StringUtils.randomBitString(10, [1, 2]);
            };
            wrongProb4.should.throw(Error);
            const wrongProb5 = () => {
                StringUtils.randomBitString(10, {1: 1});
            };
            wrongProb5.should.throw(Error);
        });
        it('should generate random strings each time for unseeded prng', () => {
            unirand.seed();
            const randomStrings = {};
            let randomString;
            for (let i = 0; i < 10000; i += 1) {
                randomString = StringUtils.randomBitString(200);
                randomStrings[randomString] = 1;
            }
            expect(Object.keys(randomStrings).length).to.be.equal(10000);
        });
        it('should generate random strings each time for seeded prng', () => {
            unirand.seed('unirand');
            const randomStrings = {};
            const nextStrings = {};
            let randomString;
            for (let i = 0; i < 10000; i += 1) {
                randomString = StringUtils.randomBitString(200);
                randomStrings[randomString] = 1;
            }
            expect(Object.keys(randomStrings).length).to.be.equal(1);
            for (let i = 0; i < 10000; i += 1) {
                randomString = StringUtils.nextBitString(200);
                nextStrings[randomString] = 1;
            }
            expect(Object.keys(nextStrings).length).to.be.equal(10000);
        });
    });

    describe('.randomUID and .nextUID', () => {
        it('should throw error for wrong UID generator', () => {
            let wrongUIDGenerator = () => {
                StringUtils.randomUID('abc');
            };
            wrongUIDGenerator.should.throw(Error);
            let wrongUIDGenerator2 = () => {
                StringUtils.nextUID('abc');
            };
            wrongUIDGenerator2.should.throw(Error);
        });
        it('factory should support .random, .next and .setGenerator methods', () => {
            const UidFactory = require('../lib/uidFactory').default;
            const uidFactory = new UidFactory();
            expect(uidFactory).to.have.property('random');
            expect(uidFactory).to.respondsTo('random');
            expect(uidFactory).to.have.property('next');
            expect(uidFactory).to.respondsTo('next');
            expect(uidFactory).to.have.property('setGenerator');
            expect(uidFactory).to.respondsTo('setGenerator');
            let wrongUIDGenerator = () => {
                uidFactory.setGenerator('abc');
            };
            wrongUIDGenerator.should.throw(Error);
        });
        describe('betterguid generator', () => {
            it('should be the same length of size 17', function(done) {
                this.timeout(480000);
                unirand.seed();
                let randomUid;
                for (let i = 0; i < 200000; i += 1) {
                    randomUid = StringUtils.randomUID('betterguid');
                    expect(randomUid).to.be.a('string');
                    expect(randomUid.length).to.be.equal(17);
                }
                done();
            });
            it('should have random payload for unseeded prng', function(done) {
                this.timeout(480000);
                unirand.seed();
                let randomUid;
                const randomUids = {};
                for (let i = 0; i < 10000; i += 1) {
                    randomUid = StringUtils.randomUID('betterguid');
                    randomUids[randomUid.substr(8, 9)] = 1;
                }
                expect(Object.keys(randomUids).length).to.be.equal(10000);
                done();
            });
            it('should have same payload for seeded prng', function(done) {
                this.timeout(480000);
                unirand.seed('unirand');
                let randomUid;
                const randomUids = {};
                const nextUids = {};
                for (let i = 0; i < 10000; i += 1) {
                    randomUid = StringUtils.randomUID('betterguid');
                    randomUids[randomUid.substr(8, 9)] = 1;
                }
                expect(Object.keys(randomUids).length).to.be.equal(1);
                for (let i = 0; i < 10000; i += 1) {
                    randomUid = StringUtils.nextUID('betterguid');
                    nextUids[randomUid.substr(8, 9)] = 1;
                }
                expect(Object.keys(nextUids).length).to.be.equal(10000);
                done();
            });
        });
        describe('ksuid generator', () => {
            it('should be the same length of size 27', function(done) {
                this.timeout(480000);
                unirand.seed();
                let randomUid;
                for (let i = 0; i < 200000; i += 1) {
                    randomUid = StringUtils.randomUID('ksuid');
                    expect(randomUid).to.be.a('string');
                    expect(randomUid.length).to.be.equal(27);
                }
                done();
            });
            it('should have random payload for unseeded prng', function(done) {
                this.timeout(480000);
                unirand.seed();
                let randomUid;
                const randomUids = {};
                for (let i = 0; i < 10000; i += 1) {
                    randomUid = StringUtils.randomUID('ksuid');
                    randomUids[randomUid.substr(4, 23)] = 1;
                }
                expect(Object.keys(randomUids).length).to.be.equal(10000);
                done();
            });
            it('should have same payload for seeded prng', function(done) {
                this.timeout(480000);
                unirand.seed('unirand');
                let randomUid;
                const randomUids = {};
                const nextUids = {};
                for (let i = 0; i < 10000; i += 1) {
                    randomUid = StringUtils.randomUID('ksuid');
                    randomUids[randomUid.substr(4, 23)] = 1;
                }
                expect(Object.keys(randomUids).length).to.be.equal(1);
                for (let i = 0; i < 10000; i += 1) {
                    randomUid = StringUtils.nextUID('ksuid');
                    nextUids[randomUid.substr(4, 23)] = 1;
                }
                expect(Object.keys(nextUids).length).to.be.equal(10000);
                done();
            });
        });
        describe('shortuuid generator', () => {
            it('should be the same length of size 22', function(done) {
                this.timeout(480000);
                unirand.seed();
                let randomUid;
                for (let i = 0; i < 200000; i += 1) {
                    randomUid = StringUtils.randomUID('shortuuid');
                    expect(randomUid).to.be.a('string');
                    expect(randomUid.length).to.be.equal(22);
                }
                done();
            });
            it('should have random payload for unseeded prng', function(done) {
                this.timeout(480000);
                unirand.seed();
                let randomUid;
                const randomUids = {};
                for (let i = 0; i < 10000; i += 1) {
                    randomUid = StringUtils.randomUID('shortuuid');
                    randomUids[randomUid] = 1;
                }
                expect(Object.keys(randomUids).length).to.be.equal(10000);
                done();
            });
        });
        describe('sno generator', () => {
            it('should be the same length of size 16', function(done) {
                this.timeout(480000);
                unirand.seed();
                let randomUid;
                for (let i = 0; i < 200000; i += 1) {
                    randomUid = StringUtils.randomUID('sno');
                    expect(randomUid).to.be.a('string');
                    expect(randomUid.length).to.be.equal(16);
                }
                done();
            });
            it('should have increased sequence', () => {
                unirand.seed();
                let randomUid;
                randomUid = StringUtils.randomUID('sno');
                expect(randomUid[randomUid.length - 1]).to.be.equal('1');
                randomUid = StringUtils.randomUID('sno');
                expect(randomUid[randomUid.length - 1]).to.be.equal('2');
            });
        });
        describe('snowflake generator', () => {
            it('should be the same length of size 20', function(done) {
                this.timeout(480000);
                unirand.seed();
                let randomUid;
                for (let i = 0; i < 200000; i += 1) {
                    randomUid = StringUtils.randomUID('snowflake');
                    expect(randomUid).to.be.a('string');
                    expect(randomUid.length).to.be.equal(20);
                }
                done();
            });
            it('should consist only numbers', function(done) {
                this.timeout(480000);
                unirand.seed();
                const alphabet = '0123456789';
                const alphabet_indexes = alphabet.split('')
                    .reduce((res, letter, index) => {res[letter] = index; return res;}, {});
                let randomUid;
                for (let i = 0; i < 200000; i += 1) {
                    randomUid = StringUtils.randomUID('snowflake');
                    expect(randomUid).to.be.a('string');
                    expect(checkLettersInAlphabet(randomUid, alphabet_indexes, alphabet[0])).to.be.equal(true);
                }
                done();
            });
        });
        describe('sonyflake generator', () => {
            it('should be the same length of size 17', function(done) {
                this.timeout(480000);
                unirand.seed();
                let randomUid;
                for (let i = 0; i < 200000; i += 1) {
                    randomUid = StringUtils.randomUID('sonyflake');
                    expect(randomUid).to.be.a('string');
                    expect(randomUid.length).to.be.equal(17);
                }
                done();
            });
            it('should consist only hex numbers', function(done) {
                this.timeout(480000);
                unirand.seed();
                const alphabet = '0123456789abcdef';
                const alphabet_indexes = alphabet.split('')
                    .reduce((res, letter, index) => {res[letter] = index; return res;}, {});
                let randomUid;
                for (let i = 0; i < 200000; i += 1) {
                    randomUid = StringUtils.randomUID('sonyflake');
                    expect(randomUid).to.be.a('string');
                    expect(checkLettersInAlphabet(randomUid, alphabet_indexes, alphabet[0])).to.be.equal(true);
                }
                done();
            });
        });
        describe('ulid generator', () => {
            it('should be the same length of size 23', function(done) {
                this.timeout(480000);
                unirand.seed();
                let randomUid;
                for (let i = 0; i < 200000; i += 1) {
                    randomUid = StringUtils.randomUID('ulid');
                    expect(randomUid).to.be.a('string');
                    expect(randomUid.length).to.be.equal(23);
                }
                done();
            });
            it('should have random payload for unseeded prng', function(done) {
                this.timeout(480000);
                unirand.seed();
                let randomUid;
                const randomUids = {};
                for (let i = 0; i < 10000; i += 1) {
                    randomUid = StringUtils.randomUID('ulid');
                    randomUids[randomUid.substr(10, 13)] = 1;
                }
                expect(Object.keys(randomUids).length).to.be.equal(10000);
                done();
            });
            it('should have same payload for seeded prng', function(done) {
                this.timeout(480000);
                unirand.seed('unirand');
                let randomUid;
                const randomUids = {};
                const nextUids = {};
                for (let i = 0; i < 10000; i += 1) {
                    randomUid = StringUtils.randomUID('ulid');
                    randomUids[randomUid.substr(10, 13)] = 1;
                }
                expect(Object.keys(randomUids).length).to.be.equal(1);
                for (let i = 0; i < 10000; i += 1) {
                    randomUid = StringUtils.nextUID('ulid');
                    nextUids[randomUid.substr(10, 13)] = 1;
                }
                expect(Object.keys(nextUids).length).to.be.equal(10000);
                done();
            });
        });
        describe('uuid generator', () => {
            it('should be the same length of size 36', function(done) {
                this.timeout(480000);
                unirand.seed();
                let randomUid;
                for (let i = 0; i < 200000; i += 1) {
                    randomUid = StringUtils.randomUID('uuid');
                    expect(randomUid).to.be.a('string');
                    expect(randomUid.length).to.be.equal(36);
                    expect(randomUid.split('-').length).to.be.equal(5);
                }
                done();
            });
            it('should have random payload for unseeded prng', function(done) {
                this.timeout(480000);
                unirand.seed();
                let randomUid;
                const randomUids = {};
                for (let i = 0; i < 10000; i += 1) {
                    randomUid = StringUtils.randomUID('uuid');
                    randomUids[randomUid.substr(9, 27)] = 1;
                }
                expect(Object.keys(randomUids).length).to.be.equal(10000);
                done();
            });
            it('should have same payload for seeded prng', function(done) {
                this.timeout(480000);
                unirand.seed('unirand');
                let randomUid;
                const randomUids = {};
                const nextUids = {};
                for (let i = 0; i < 10000; i += 1) {
                    randomUid = StringUtils.randomUID('uuid');
                    randomUids[randomUid.substr(9, 27)] = 1;
                }
                expect(Object.keys(randomUids).length).to.be.equal(1);
                for (let i = 0; i < 10000; i += 1) {
                    randomUid = StringUtils.nextUID('uuid');
                    nextUids[randomUid.substr(9, 27)] = 1;
                }
                expect(Object.keys(nextUids).length).to.be.equal(10000);
                done();
            });
            it('should consist only hex numbers and "-"', function(done) {
                this.timeout(480000);
                unirand.seed();
                const alphabet = '0123456789abcdef-';
                const alphabet_indexes = alphabet.split('')
                    .reduce((res, letter, index) => {res[letter] = index; return res;}, {});
                let randomUid;
                for (let i = 0; i < 200000; i += 1) {
                    randomUid = StringUtils.randomUID('uuid');
                    expect(randomUid).to.be.a('string');
                    expect(checkLettersInAlphabet(randomUid, alphabet_indexes, alphabet[0])).to.be.equal(true);
                }
                done();
            });
        });
        describe('xid generator', () => {
            it('should be the same length of size 20', function(done) {
                this.timeout(480000);
                unirand.seed();
                let randomUid;
                for (let i = 0; i < 200000; i += 1) {
                    randomUid = StringUtils.randomUID('xid');
                    expect(randomUid).to.be.a('string');
                    expect(randomUid.length).to.be.equal(20);
                }
                done();
            });
            it('should have random payload for unseeded prng', function(done) {
                this.timeout(480000);
                unirand.seed();
                let randomUid;
                const randomUids = {};
                for (let i = 0; i < 10000; i += 1) {
                    randomUid = StringUtils.randomUID('xid');
                    randomUids[randomUid.substr(15, 5)] = 1;
                }
                // random payload is small and it can be repeated
                expect(Object.keys(randomUids).length).to.be.at.least(9900);
                done();
            });
            it('should have same payload for seeded prng', function(done) {
                this.timeout(480000);
                unirand.seed('unirand');
                let randomUid;
                const randomUids = {};
                const nextUids = {};
                for (let i = 0; i < 10000; i += 1) {
                    randomUid = StringUtils.randomUID('xid');
                    randomUids[randomUid.substr(15, 5)] = 1;
                }
                expect(Object.keys(randomUids).length).to.be.equal(1);
                for (let i = 0; i < 10000; i += 1) {
                    randomUid = StringUtils.nextUID('xid');
                    nextUids[randomUid.substr(15, 5)] = 1;
                }
                expect(Object.keys(nextUids).length).to.be.at.least(9900);
                done();
            });
        });
    });
});
