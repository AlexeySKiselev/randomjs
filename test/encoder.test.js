/**
 * Test for encoders
 */

// Import Mocha tool for tests
let chai = require('chai'),
    expect = chai.expect,
    {describe, it} = require('mocha'),
    encoderProxy = require('../lib/utils/encoders/encoderProxy').default;

chai.should();

describe('Encoder', () => {
    const getRandomString = (length) => {
        let res = '';
        let letterIndex;
        for (let i = 0; i < length; i += 1) {
            letterIndex = 32 + Math.random() * 223;
            res += String.fromCharCode(letterIndex);
        }

        return res;
    };
    const checkLettersInAlphabet = (str, alphabet_indexes, first_letter, padding = '') => {
        for (let s of str) {
            // for padding
            if (padding !== '' && s === padding) {
                continue;
            }
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
    it('should throw error for wrong encoder', () => {
        let wrongEncoder = () => {
            encoderProxy.setEncoder('abc');
        };
        wrongEncoder.should.throw(Error);

        let goodEncoders = () => {
            const encoders = encoderProxy.encoders;
            for (let encoder of encoders) {
                encoderProxy.setEncoder(encoder);
                expect(encoderProxy.encoder_name).to.be.equal(encoder);
            }
        };
        goodEncoders.should.not.throw(Error);
    });
    it('should support methods: .encode, .decode, .encodeFromByteArray, .decodeToByteArray', () => {
        expect(encoderProxy).to.have.property('encode');
        expect(encoderProxy).to.respondsTo('encode');
        expect(encoderProxy).to.have.property('decode');
        expect(encoderProxy).to.respondsTo('decode');
        expect(encoderProxy).to.have.property('encodeFromByteArray');
        expect(encoderProxy).to.respondsTo('encodeFromByteArray');
        expect(encoderProxy).to.have.property('decodeToByteArray');
        expect(encoderProxy).to.respondsTo('decodeToByteArray');
    });
    describe('base62', () => {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const alphabet_indexes = alphabet.split('')
            .reduce((res, letter, index) => {res[letter] = index; return res;}, {});
        it('should encode and decode correctly', function(done) {
            this.timeout(960000);
            encoderProxy.setEncoder('base62');
            let stringSize;
            let randomString;
            let encoded;
            let decoded;
            for (let i = 0; i < 100000; i += 1) {
                stringSize = Math.floor(50 + Math.random() * 250);
                randomString = getRandomString(stringSize);
                encoded = encoderProxy.encode(randomString);
                expect(encoded).to.be.a('string');
                expect(encoded.length).to.be.at.least(stringSize);
                expect(checkLettersInAlphabet(encoded, alphabet_indexes, alphabet[0])).to.be.equal(true);
                decoded = encoderProxy.decode(encoded);
                expect(decoded).to.be.a('string');
                expect(decoded).to.be.equal(randomString);
            }
            done();
        });
    });
    describe('base64', () => {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        const alphabet_indexes = alphabet.split('')
            .reduce((res, letter, index) => {res[letter] = index; return res;}, {});
        it('should encode and decode correctly', function(done) {
            this.timeout(960000);
            encoderProxy.setEncoder('base64');
            let stringSize;
            let randomString;
            let encoded;
            let decoded;
            for (let i = 0; i < 100000; i += 1) {
                stringSize = Math.floor(50 + Math.random() * 250);
                randomString = getRandomString(stringSize);
                encoded = encoderProxy.encode(randomString);
                expect(encoded).to.be.a('string');
                expect(encoded.length).to.be.at.least(stringSize);
                expect(encoded.length % 4).to.be.equal(0);
                expect(checkLettersInAlphabet(encoded, alphabet_indexes, alphabet[0], '=')).to.be.equal(true);
                decoded = encoderProxy.decode(encoded);
                expect(decoded).to.be.a('string');
                expect(decoded).to.be.equal(randomString);
            }
            done();
        });
        it('should throw error for wrong input', () => {
            let wrongEncoderInput = () => {
                encoderProxy.setEncoder('base64');
                encoderProxy.decode('---');
            };
            wrongEncoderInput.should.throw(Error);
        });
    });
    describe('base32', () => {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        const alphabet_indexes = alphabet.split('')
            .reduce((res, letter, index) => {res[letter] = index; return res;}, {});
        it('should encode and decode correctly', function(done) {
            this.timeout(960000);
            encoderProxy.setEncoder('base32');
            let stringSize;
            let randomString;
            let encoded;
            let decoded;
            for (let i = 0; i < 100000; i += 1) {
                stringSize = Math.floor(50 + Math.random() * 250);
                randomString = getRandomString(stringSize);
                encoded = encoderProxy.encode(randomString);
                expect(encoded).to.be.a('string');
                expect(encoded.length).to.be.at.least(stringSize);
                expect(checkLettersInAlphabet(encoded, alphabet_indexes, alphabet[0], '=')).to.be.equal(true);
                decoded = encoderProxy.decode(encoded);
                expect(decoded).to.be.a('string');
                expect(decoded).to.be.equal(randomString);
            }
            done();
        });
        it('should throw error for wrong input', () => {
            let wrongEncoderInput = () => {
                encoderProxy.setEncoder('base32');
                encoderProxy.decode('---');
            };
            wrongEncoderInput.should.throw(Error);
        });
    });
    describe('base32Hex', () => {
        const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUV';
        const alphabet_indexes = alphabet.split('')
            .reduce((res, letter, index) => {res[letter] = index; return res;}, {});
        it('should encode and decode correctly', function(done) {
            this.timeout(960000);
            encoderProxy.setEncoder('base32Hex');
            let stringSize;
            let randomString;
            let encoded;
            let decoded;
            for (let i = 0; i < 100000; i += 1) {
                stringSize = Math.floor(50 + Math.random() * 250);
                randomString = getRandomString(stringSize);
                encoded = encoderProxy.encode(randomString);
                expect(encoded).to.be.a('string');
                expect(encoded.length).to.be.at.least(stringSize);
                expect(checkLettersInAlphabet(encoded, alphabet_indexes, alphabet[0], '=')).to.be.equal(true);
                decoded = encoderProxy.decode(encoded);
                expect(decoded).to.be.a('string');
                expect(decoded).to.be.equal(randomString);
            }
            done();
        });
        it('should throw error for wrong input', () => {
            let wrongEncoderInput = () => {
                encoderProxy.setEncoder('base32Hex');
                encoderProxy.decode('---');
            };
            wrongEncoderInput.should.throw(Error);
        });
    });
    describe('z-base-32', () => {
        const alphabet = 'ybndrfg8ejkmcpqxot1uwisza345h769';
        const alphabet_indexes = alphabet.split('')
            .reduce((res, letter, index) => {res[letter] = index; return res;}, {});
        it('should encode and decode correctly', function(done) {
            this.timeout(960000);
            encoderProxy.setEncoder('z-base-32');
            let stringSize;
            let randomString;
            let encoded;
            let decoded;
            for (let i = 0; i < 100000; i += 1) {
                stringSize = Math.floor(50 + Math.random() * 250);
                randomString = getRandomString(stringSize);
                encoded = encoderProxy.encode(randomString);
                expect(encoded).to.be.a('string');
                expect(encoded.length).to.be.at.least(stringSize);
                expect(checkLettersInAlphabet(encoded, alphabet_indexes, alphabet[0])).to.be.equal(true);
                decoded = encoderProxy.decode(encoded);
                expect(decoded).to.be.a('string');
                expect(decoded).to.be.equal(randomString);
            }
            done();
        });
        it('should throw error for wrong input', () => {
            let wrongEncoderInput = () => {
                encoderProxy.setEncoder('z-base-32');
                encoderProxy.decode('---');
            };
            wrongEncoderInput.should.throw(Error);
        });
    });
    describe('crockford-base32', () => {
        const alphabet = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
        const alphabet_indexes = alphabet.split('')
            .reduce((res, letter, index) => {res[letter] = index; return res;}, {});
        it('should encode and decode correctly', function(done) {
            this.timeout(960000);
            encoderProxy.setEncoder('crockford-base32');
            let stringSize;
            let randomString;
            let encoded;
            let decoded;
            for (let i = 0; i < 100000; i += 1) {
                stringSize = Math.floor(50 + Math.random() * 250);
                randomString = getRandomString(stringSize);
                encoded = encoderProxy.encode(randomString);
                expect(encoded).to.be.a('string');
                expect(encoded.length).to.be.at.least(stringSize);
                expect(checkLettersInAlphabet(encoded, alphabet_indexes, alphabet[0])).to.be.equal(true);
                decoded = encoderProxy.decode(encoded);
                expect(decoded).to.be.a('string');
                expect(decoded).to.be.equal(randomString);
            }
            done();
        });
        it('should throw error for wrong input', () => {
            let wrongEncoderInput = () => {
                encoderProxy.setEncoder('crockford-base32');
                encoderProxy.decode('---');
            };
            wrongEncoderInput.should.throw(Error);
        });
    });
    describe('base58', () => {
        const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        const alphabet_indexes = alphabet.split('')
            .reduce((res, letter, index) => {res[letter] = index; return res;}, {});
        it('should encode and decode correctly', function(done) {
            this.timeout(960000);
            encoderProxy.setEncoder('base58');
            let stringSize;
            let randomString;
            let encoded;
            let decoded;
            for (let i = 0; i < 50000; i += 1) {
                stringSize = Math.floor(50 + Math.random() * 250);
                randomString = getRandomString(stringSize);
                encoded = encoderProxy.encode(randomString);
                expect(encoded).to.be.a('string');
                expect(encoded.length).to.be.at.least(stringSize);
                expect(checkLettersInAlphabet(encoded, alphabet_indexes, alphabet[0])).to.be.equal(true);
                decoded = encoderProxy.decode(encoded);
                expect(decoded).to.be.a('string');
                expect(decoded).to.be.equal(randomString);
            }
            done();
        });
        it('should throw error for wrong input', () => {
            let wrongEncoderInput = () => {
                encoderProxy.setEncoder('base58');
                encoderProxy.decode('---');
            };
            wrongEncoderInput.should.throw(Error);
        });
    });
    describe('bitcoin-base58', () => {
        const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        const alphabet_indexes = alphabet.split('')
            .reduce((res, letter, index) => {res[letter] = index; return res;}, {});
        it('should encode and decode correctly', function(done) {
            this.timeout(960000);
            encoderProxy.setEncoder('bitcoin-base58');
            let stringSize;
            let randomString;
            let encoded;
            let decoded;
            for (let i = 0; i < 50000; i += 1) {
                stringSize = Math.floor(50 + Math.random() * 250);
                randomString = getRandomString(stringSize);
                encoded = encoderProxy.encode(randomString);
                expect(encoded).to.be.a('string');
                expect(encoded.length).to.be.at.least(stringSize);
                expect(checkLettersInAlphabet(encoded, alphabet_indexes, alphabet[0])).to.be.equal(true);
                decoded = encoderProxy.decode(encoded);
                expect(decoded).to.be.a('string');
                expect(decoded).to.be.equal(randomString);
            }
            done();
        });
        it('should throw error for wrong input', () => {
            let wrongEncoderInput = () => {
                encoderProxy.setEncoder('bitcoin-base58');
                encoderProxy.decode('---');
            };
            wrongEncoderInput.should.throw(Error);
        });
    });
    describe('flickr-base58', () => {
        const alphabet = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
        const alphabet_indexes = alphabet.split('')
            .reduce((res, letter, index) => {res[letter] = index; return res;}, {});
        it('should encode and decode correctly', function(done) {
            this.timeout(960000);
            encoderProxy.setEncoder('flickr-base58');
            let stringSize;
            let randomString;
            let encoded;
            let decoded;
            for (let i = 0; i < 50000; i += 1) {
                stringSize = Math.floor(50 + Math.random() * 250);
                randomString = getRandomString(stringSize);
                encoded = encoderProxy.encode(randomString);
                expect(encoded).to.be.a('string');
                expect(encoded.length).to.be.at.least(stringSize);
                expect(checkLettersInAlphabet(encoded, alphabet_indexes, alphabet[0])).to.be.equal(true);
                decoded = encoderProxy.decode(encoded);
                expect(decoded).to.be.a('string');
                expect(decoded).to.be.equal(randomString);
            }
            done();
        });
        it('should throw error for wrong input', () => {
            let wrongEncoderInput = () => {
                encoderProxy.setEncoder('flickr-base58');
                encoderProxy.decode('---');
            };
            wrongEncoderInput.should.throw(Error);
        });
    });
    describe('ripple-base58', () => {
        const alphabet = 'rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz';
        const alphabet_indexes = alphabet.split('')
            .reduce((res, letter, index) => {res[letter] = index; return res;}, {});
        it('should encode and decode correctly', function(done) {
            this.timeout(960000);
            encoderProxy.setEncoder('ripple-base58');
            let stringSize;
            let randomString;
            let encoded;
            let decoded;
            for (let i = 0; i < 50000; i += 1) {
                stringSize = Math.floor(50 + Math.random() * 250);
                randomString = getRandomString(stringSize);
                encoded = encoderProxy.encode(randomString);
                expect(encoded).to.be.a('string');
                expect(encoded.length).to.be.at.least(stringSize);
                expect(checkLettersInAlphabet(encoded, alphabet_indexes, alphabet[0])).to.be.equal(true);
                decoded = encoderProxy.decode(encoded);
                expect(decoded).to.be.a('string');
                expect(decoded).to.be.equal(randomString);
            }
            done();
        });
        it('should throw error for wrong input', () => {
            let wrongEncoderInput = () => {
                encoderProxy.setEncoder('ripple-base58');
                encoderProxy.decode('---');
            };
            wrongEncoderInput.should.throw(Error);
        });
    });
});
