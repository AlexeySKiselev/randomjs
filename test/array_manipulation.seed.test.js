/**
 * Tests for array manipulation methods
 * Created by Alexey S. Kiselev
 */

// Import Mocha tool for tests
let chai = require('chai'),
    expect = chai.expect,
    {describe, it} = require('mocha'),
    prng = require('../lib/prng/prngProxy').default;

chai.should();

const compareStrings = (arrA, arrB) => {
    expect(arrA.length).to.be.equal(arrB.length);
    for(let i = 0; i < arrA.length; i += 1) {
        expect(arrA[i]).to.be.equal(arrB[i]);
    }
};

describe('Array manipulation methods with seed', () => {
    describe('Sample', () => {
        const Sample = require('../lib/array_manipulation/sample').default;
        it('should generate same results each time for k/n < 0.2 with seed', () => {
            let sample = new Sample(),
                input_str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
                firstSample;
            prng.seed('seeded sample test');
            firstSample = sample.getSample(input_str, 4);
            for(let i = 0; i < 1000; i += 1) {
                compareStrings(firstSample, sample.getSample(input_str, 4));
            }
        });
        it('should generate same results each time for k/n > 0.2 with seed', () => {
            let sample = new Sample(),
                input_str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
                firstSample;
            prng.seed('another seeded sample test');
            firstSample = sample.getSample(input_str, 16);
            for(let i = 0; i < 1000; i += 1) {
                compareStrings(firstSample, sample.getSample(input_str, 16));
            }
        });
    });
    describe('Shuffle', () => {
        const Shuffle = require('../lib/array_manipulation/shuffle').default;
        it('should generate same results each time with seed', function (done) {
            this.timeout(480000);
            let shuffle = new Shuffle(),
                input_str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
                first_shuffle;
            prng.seed('Shuffle test');
            first_shuffle = shuffle.getPermutation(input_str);
            for(let i = 0; i < 1000; i += 1) {
                compareStrings(first_shuffle, shuffle.getPermutation(input_str));
            }
            done();
        });
    });
    describe('Derange', () => {
        const Derange = require('../lib/array_manipulation/shuffle').default;
        it('should generate same results each time with seed', function(done) {
            this.timeout(480000);
            let shuffle = new Derange(),
                input_str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
                first_derangement;
            prng.seed('Derangement test');
            first_derangement = shuffle.getDerangement(input_str);
            for(let i = 0; i < 1000; i += 1) {
                compareStrings(first_derangement, shuffle.getDerangement(input_str));
            }
            done();
        });
    });
    describe('RouletteWheel', () => {
        const RouletteWheel = require('../lib/array_manipulation/rouletteWheel').default;
        it('should generate same results each time with seed', function (done) {
            this.timeout(480000);
            const weights = [];
            for (let i = 0; i < 20; i += 1) {
                weights[i] = Math.floor(Math.random() * 90 + 10);
            }
            const rouletteWheel1 = new RouletteWheel(weights, {
                seed: 'unirand'
            });
            const rouletteWheel2 = new RouletteWheel(weights, {
                seed: 'unirand'
            });
            const rouletteWheel3 = new RouletteWheel(weights, {
                seed: 'unirand'
            });

            let selected1, selected2, selected3;
            for (let i = 0; i < 10000; i += 1) {
                selected1 = rouletteWheel1.select();
                selected2 = rouletteWheel2.select();
                selected3 = rouletteWheel3.select();

                expect(selected1).to.be.a('number');
                expect(selected2).to.be.a('number');
                expect(selected3).to.be.a('number');
                expect(selected1).to.be.equal(selected2);
                expect(selected2).to.be.equal(selected3);
            }

            done();
        });
        it('should support .reset() and reproduce selections', function (done) {
            this.timeout(480000);
            const weights = [];
            const selected = [];
            const selected2 = [];
            const selectedCount = 100000;
            for (let i = 0; i < 20; i += 1) {
                weights[i] = Math.floor(Math.random() * 90 + 10);
            }
            const rouletteWheel = new RouletteWheel(weights, {
                seed: 'unirand'
            });

            for (let i = 0; i < selectedCount; i += 1) {
                selected[i] = rouletteWheel.select();
            }

            rouletteWheel.reset();
            for (let i = 0; i < selectedCount; i += 1) {
                selected2[i] = rouletteWheel.select();
            }

            for (let i = 0; i < selectedCount; i += 1) {
                expect(selected[i]).to.be.a('number');
                expect(selected2[i]).to.be.a('number');
                expect(selected[i]).to.be.equal(selected2[i]);
            }

            done();
        });
    });
});
