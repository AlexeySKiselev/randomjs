// @flow
/**
 * Created by Alexey S. Kiselev
 */

import fs from 'fs';
import DistributionFactory from './core/distributionFactory';
import AnalyzerFactory from './core/analyzerFactory';
import Sample from './core/array_manipulation/sample';
import Shuffle from './core/array_manipulation/shuffle';
import Winsorize from './core/array_manipulation/winsorize';
import murmur3 from './core/utils/hash';
import prngProxy from './core/prng/prngProxy';

const Bernoulli = require('./core/methods/bernoulli');

import type {
    NumberString, PercentileInput, RandomArray, RandomArrayNumber, RandomArrayString,
    SampleOptions
} from './core/types';
import type { IPRNGProxy, ISample, IShuffle } from './core/interfaces';

class RandomJS {
    analyze: any;
    utils: any;
    sample: any;
    _sample: ISample;
    shuffle: any;
    _shuffle: IShuffle;
    derange: any;
    chance: (trueProb: number) => boolean;
    winsorize: (input: RandomArray, limits: any) => RandomArray;
    hash: (data: NumberString, seed: ?number) => number;
    _prng: IPRNGProxy;
    seed: (seed_value: ?NumberString) => void;
    prng: IPRNGProxy;
    random: number;
    next: number;

    constructor(): void {
        this.analyze = null;
        this.utils = null;
        this._sample = new Sample();
        this._shuffle = new Shuffle();
        this._prng = prngProxy; // default PRNG with seed

        fs.readdirSync(__dirname + '/core/methods').forEach((file: string) => {
            /**
             *  Add a "random" method which contains different distribution methods
             *  Uses a factory pattern for creating instances of distributions classes
             *  @returns Object corresponds to distribution
             */
            Object.defineProperty(this, file.slice(0,-3),{
                __proto__: null,
                get: () => {
                    return (...params): DistributionFactory => {
                        return new DistributionFactory(file, ...params);
                    };
                }
            });
        });

        /**
         * Add random array analyser
         * This method is long in constructor and short in methods
         * TODO: implement method short in constructor and long in methods
         * Use Analyzer factory to create method
         */
        Object.defineProperty(this, 'analyze', ({
            __proto__: null,
            value: (randomArray: RandomArray, options?: { [string]: any }): AnalyzerFactory => {
                return new AnalyzerFactory(randomArray, options);
            }
        }: Object));

        /**
         * Utils
         * Contains implementation for Gamma, Digamma functions, etc.
         */
        Object.defineProperty(this, 'utils', ({
            __proto__: null,
            value: require(__dirname + '/core/utils/utils')
        }: Object));

        /**
         * Random sample (k random elements from array with N elements 0 < k <= N)
         */
        Object.defineProperty(this, 'sample', ({
            __proto__: null,
            value: (input: RandomArrayString<number | string>, k: any, options: ?SampleOptions): any => {
                const defaultOptions: SampleOptions = {
                    shuffle: false
                };
                if(typeof k === 'object' || typeof k === 'undefined') {
                    // assume that k is undefined, and the second parameter is options
                    return this._sample.getSample(input, undefined, Object.assign(defaultOptions, k));
                } else {
                    return this._sample.getSample(input, k, Object.assign(defaultOptions, options));
                }

            }
        }: Object));

        /**
         * Simple shuffle method
         */
        Object.defineProperty(this, 'shuffle', ({
            __proto__: null,
            value: (input: RandomArrayString<number | string>): any => {
                return this._shuffle.getPermutation(input);
            }
        }: Object));

        /**
         * Derange method
         */
        Object.defineProperty(this, 'derange', ({
            __proto__: null,
            value: (input: RandomArrayString<number | string>): any => {
                return this._shuffle.getDerangement(input);
            }
        }: Object));

        /**
         * Chance - returns true with given probability
         */
        Object.defineProperty(this, 'chance', ({
            __proto__: null,
            value: (trueProb: number): boolean => {
                let _chance = new Bernoulli(trueProb);
                if(_chance.isError().error) {
                    throw new Error(_chance.isError().error);
                }
                return !!_chance.random();
            }
        }: Object));

        /**
         * Winsorize method
         */
        Object.defineProperty(this, 'winsorize', ({
            __proto__: null,
            value: (input: RandomArray, limits: PercentileInput<number> = 0.05, mutate: boolean = true): RandomArray => {
                let _winsorize: Winsorize = new Winsorize();
                return _winsorize.winsorize(input, limits, mutate);
            }
        }: Object));

        /**
         * Hash function
         */
        Object.defineProperty(this, 'hash', ({
            __proto__: null,
            value: (data: NumberString, seed: ?number): number => {
                return murmur3(data, seed);
            }
        }: Object));

        /**
         * PRNG seed
         */
        Object.defineProperty(this, 'seed', ({
            __proto__: null,
            value: (seed_value: ?NumberString): void => {
                this._prng.seed(seed_value);
            }
        }: Object));

        /**
         * Sets PRNG
         */
        Object.defineProperty(this, 'prng', ({
            __proto__: null,
            get: (): IPRNGProxy => {
                return this._prng;
            }
        }: Object));

        /**
         * Returns seeded random value [0, 1) with uniform distribution
         */
        Object.defineProperty(this, 'random', ({
            value: (n: number = 1): RandomArrayNumber => {
                return this._prng.random(n);
            }
        }: Object));

        /**
         * Returns seeded next value [0, 1) with uniform distribution
         */
        Object.defineProperty(this, 'next', ({
            value: (): number => {
                return this._prng.next();
            }
        }: Object));
    }

    help(): void {
        let help = require('./core/help');
        console.log('Available Distribution methods:');
        Object.keys(help).forEach((method: string): void => {
            console.log(method + ': ' + help[method]);
        });
    }
}

// Add methods extractor
const randomjs = new RandomJS();
const methods = {
    analyze: randomjs.analyze,
    utils: randomjs.utils,
    sample: randomjs.sample,
    shuffle: randomjs.shuffle,
    derange: randomjs.derange,
    chance: randomjs.chance,
    winsorize: randomjs.winsorize,
    hash: randomjs.hash,
    seed: randomjs.seed,
    prng: randomjs.prng,
    random: randomjs.random,
    next: randomjs.next
};
fs.readdirSync(__dirname + '/core/methods').forEach((file: string) => {
    let rand_method = file.slice(0,-3);
    methods[rand_method] = Object.getOwnPropertyDescriptor(randomjs, rand_method).get();
});

module.exports = methods;

// TODO: Create a check-values external function
// TODO: Generators
// TODO: Regression
// TODO: Prediction
// TODO: Shuffle
// TODO: Games
// TODO: Pseudorandom generator
// TODO: add Proxy to random generators
// TODO: add F-distribution
// TODO: add zipf distribution
// TODO: add utils