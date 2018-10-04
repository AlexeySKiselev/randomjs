// @flow
/**
 * Created by Alexey S. Kiselev
 */

import fs from 'fs';
import DistributionFactory from './core/distributionFactory';
import AnalyzerFactory from './core/analyzerFactory';
import Sample from './core/array_manipulation/sample';
import Shuffle from './core/array_manipulation/shuffle';

const Bernoulli = require('./core/methods/bernoulli');

import type { RandomArray, RandomArrayString, SampleOptions } from './core/types';
import type { ISample, IShuffle } from './core/interfaces';

class RandomJS {
    analyze: any;
    utils: any;
    sample: any;
    _sample: ISample;
    shuffle: any;
    _shuffle: IShuffle;
    derange: any;
    chance: boolean;

    constructor(): void {
        this.analyze = null;
        this.utils = null;
        this._sample = new Sample();
        this._shuffle = new Shuffle();

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
    chance: randomjs.chance
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