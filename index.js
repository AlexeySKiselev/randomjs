// @flow
/**
 * Created by Alexey S. Kiselev
 */

import DistributionFactory from './core/distributionFactory';
import AnalyzerFactory from './core/analyzerFactory';
import Sample from './core/array_manipulation/sample';
import Shuffle from './core/array_manipulation/shuffle';
import Winsorize from './core/array_manipulation/winsorize';
import KFold from './core/array_manipulation/kfold';
import hashProxy from './core/utils/hash';
import prngProxy from './core/prng/prngProxy';

const distributionMethods = require('./core/methods');
const Bernoulli = distributionMethods.bernoulli;

import type {
    NumberString, PercentileInput, RandomArray, RandomArrayNumber, RandomArrayString,
    SampleOptions, RandomArrayNumberString, KFoldOptions, RandomArrayStringObject, HashOptions
} from './core/types';
import type { IPRNGProxy, ISample, IShuffle, IKFold } from './core/interfaces';

class RandomJS {
    analyze: any;
    utils: any;
    sample: any;
    _sample: ISample;
    kfold: any;
    _kfold: IKFold;
    shuffle: any;
    _shuffle: IShuffle;
    derange: any;
    chance: (trueProb: number) => boolean;
    winsorize: (input: RandomArray, limits: any) => RandomArray;
    hash: (data: NumberString, seed: ?RandomArrayNumber) => RandomArrayNumber;
    _prng: IPRNGProxy;
    seed: (seed_value: ?NumberString) => void;
    prng: IPRNGProxy;
    random: RandomArrayNumber;
    next: number;
    randomInt: RandomArrayNumber;
    nextInt: number;
    _distribution_factory: DistributionFactory;

    constructor(): void {
        this.analyze = null;
        this.utils = null;
        this._sample = new Sample();
        this._shuffle = new Shuffle();
        this._kfold = new KFold();
        this._prng = prngProxy; // default PRNG with seed
        this._distribution_factory = new DistributionFactory();

        Object.keys(distributionMethods).forEach((method: string) => {
            /**
             *  Add a "random" method which contains different distribution methods
             *  Uses a factory pattern for creating instances of distributions classes
             *  @returns Object corresponds to distribution
             */
            Object.defineProperty(this, method, {
                __proto__: null,
                get: () => {
                    return (...params): DistributionFactory => {
                        this._distribution_factory.set_current_generator(method, ...params);
                        return this._distribution_factory;
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
         * k-fold method
         */
        Object.defineProperty(this, 'kfold', ({
            __proto__: null,
            value: (input: RandomArrayNumberString<any>, k: number, options: KFoldOptions): RandomArrayStringObject<any> => {
                const defaultOptions: KFoldOptions = {
                    type: 'list',
                    derange: false
                };
                return this._kfold.getKFold(input, k, Object.assign(defaultOptions, options));
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
            value: (data: NumberString, seed: ?RandomArrayNumber, options: ?HashOptions): RandomArrayNumber => {
                let opts;
                if (typeof seed === 'object' && !Array.isArray(seed)) { // seed is option
                    opts = Object.assign({
                        algorithm: 'murmur',
                        modulo: undefined
                    }, seed);
                    hashProxy.setHashFunction(opts.algorithm);
                    return hashProxy.hash(data, 0, opts.modulo);
                }
                opts = Object.assign({
                    algorithm: 'murmur',
                    modulo: undefined
                }, options);
                hashProxy.setHashFunction(opts.algorithm);
                return hashProxy.hash(data, seed, opts.modulo);
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

        /**
         * Returns seeded random integer value [0, 2^32) with uniform distribution
         */
        Object.defineProperty(this, 'randomInt', ({
            value: (n: number = 1): RandomArrayNumber => {
                return this._prng.randomInt(n);
            }
        }: Object));

        /**
         * Returns seeded next integer value [0, 2^32) with uniform distribution
         */
        Object.defineProperty(this, 'nextInt', ({
            value: (): number => {
                return this._prng.nextInt();
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
    kfold: randomjs.kfold,
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
Object.keys(distributionMethods).forEach((rand_method: string) => {
    methods[rand_method] = Object.getOwnPropertyDescriptor(randomjs, rand_method).get();
});

module.exports = methods;

// TODO: Generators
// TODO: Regression
// TODO: Prediction
// TODO: Games
// TODO: add F-distribution
// TODO: add utils
// TODO: precise float computing