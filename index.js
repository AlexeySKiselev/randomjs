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
import smoothProxy from './core/array_manipulation/smooth';
import prngProxy, { PRNGProxy } from './core/prng/prngProxy';
import encoderProxy from './core/utils/encoders/encoderProxy';
import UidFactory from './core/uidFactory';
import {DEFAULT_GENERATOR} from './core/prng/prngProxy';
import RouletteWheel from './core/array_manipulation/rouletteWheel';
import RandomColor from './core/utils/randomColor';

const distributionMethods = require('./core/methods');
const Bernoulli = distributionMethods.bernoulli;
const Uniform = distributionMethods.uniform;

import type {
    NumberString, PercentileInput, RandomArray, RandomArrayNumber, RandomArrayString,
    SampleOptions, RandomArrayNumberString, KFoldOptions, RandomArrayStringObject, HashOptions, SmoothData
} from './core/types';
import type { IPRNGProxy, ISample, IShuffle, IKFold, ISmooth,
    IRouletteWheel, IRandomColor, IEncoderProxy, IUIDGeneratorFactory } from './core/interfaces';

class RandomJS {
    analyze: any;
    utils: any;
    stringutils: any;
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
    _encoder: IEncoderProxy;
    encoder: IEncoderProxy;
    random: RandomArrayNumber;
    next: number;
    randomInt: RandomArrayNumber;
    nextInt: number;
    randomInRange: RandomArrayNumber;
    nextInRange: number;
    _distribution_factory: DistributionFactory;
    _uidFactory: IUIDGeneratorFactory;
    uid: IUIDGeneratorFactory;
    smooth: ISmooth;
    smoothSync: ISmooth;
    newRouletteWheel: IRouletteWheel;
    newPrng: IPRNGProxy;
    _randomColorFabric: IRandomColor;
    randomColor: any;
    nextColor: any;

    constructor(): void {
        this.analyze = null;
        this.utils = null;
        this._sample = new Sample();
        this._shuffle = new Shuffle();
        this._kfold = new KFold();
        this._prng = prngProxy; // default PRNG with seed
        this._encoder = encoderProxy;
        this._distribution_factory = new DistributionFactory();
        this._randomColorFabric = (RandomColor: any).getInstance(1);
        this._uidFactory = new UidFactory();

        Object.keys(distributionMethods).forEach((method: string) => {
            /**
             *  Add a "random" method which contains different distribution methods
             *  Uses a factory pattern for creating instances of distributions classes
             *  @returns Object corresponds to distribution
             */
            Object.defineProperty(this, method, ({
                __proto__: null,
                get: () => {
                    return (...params): DistributionFactory => {
                        this._distribution_factory.set_current_generator(method, ...params);
                        return this._distribution_factory;
                    };
                }
            }: Object));
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
         * Different string utils
         */
        Object.defineProperty(this, 'stringutils', ({
            __proto__: null,
            value: require(__dirname + '/core/utils/string_utils')
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
                }
                return this._sample.getSample(input, k, Object.assign(defaultOptions, options));
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
                const _chance = new Bernoulli(trueProb);
                if (_chance.isError().error) {
                    throw new Error(_chance.isError().error);
                }
                return !!_chance.random();
            }
        }: Object));

        /**
         * RandomInRange- return uniformly distributed value in range
         */
        Object.defineProperty(this, 'randomInRange', ({
            __proto__: null,
            value: (from: number, to: number, n: number = -1): RandomArrayNumber => {
                const _uniform = new Uniform(Math.min(from, to), Math.max(from, to));
                if (_uniform.isError().error) {
                    throw new Error(_uniform.isError().error);
                }

                if (n <= 0) {
                    return _uniform.random();
                }

                return _uniform.distribution(n);
            }
        }: Object));

        /**
         * NextInRange- return uniformly distributed value in range
         */
        Object.defineProperty(this, 'nextInRange', ({
            __proto__: null,
            value: (from: number, to: number): number => {
                const _uniform = new Uniform(Math.min(from, to), Math.max(from, to));
                if (_uniform.isError().error) {
                    throw new Error(_uniform.isError().error);
                }

                return _uniform.next();
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
         * Async Smooth
         */
        Object.defineProperty(this, 'smooth', ({
            __proto__: null,
            value: (data: RandomArray, options: ?{[string]: any}): Promise<SmoothData> => {
                return smoothProxy.smooth(data, options);
            }
        }: Object));

        /**
         * Sync Smooth
         */
        Object.defineProperty(this, 'smoothSync', ({
            __proto__: null,
            value: (data: RandomArray, options: ?{[string]: any}): SmoothData => {
                return smoothProxy.smoothSync(data, options);
            }
        }: Object));

        /**
         * RouletteWheel
         */
        Object.defineProperty(this, 'newRouletteWheel', ({
            __proto__: null,
            value: (weights: Array<number>, options: ?{[string]: any}): IRouletteWheel => {
                return new RouletteWheel(weights, Object.assign({
                    prng: DEFAULT_GENERATOR
                }, options));
            }
        }: Object));

        /**
         * Factory produces new PRNGs
         */
        Object.defineProperty(this, 'newPrng', ({
            __proto__: null,
            value: (name: string, seed: any = undefined): IPRNGProxy => {
                const _prngProxy: IPRNGProxy = new PRNGProxy();
                _prngProxy.seed(seed);
                _prngProxy.set_prng(name);
                return _prngProxy;
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
         * Sets Encoder
         */
        Object.defineProperty(this, 'encoder', ({
            __proto__: null,
            value: (encoder: string): IEncoderProxy => {
                this._encoder.setEncoder(encoder);
                return this._encoder;
            }
        }: Object));

        /**
         * Sets random uid generator
         */
        Object.defineProperty(this, 'uid', ({
            __proto__: null,
            value: (generator: string): IUIDGeneratorFactory => {
                this._uidFactory.setGenerator(generator);
                return this._uidFactory;
            }
        }: Object));

        /**
         * Returns seeded random value [0, 1) with uniform distribution
         */
        Object.defineProperty(this, 'random', ({
            value: (n: number = 0): RandomArrayNumber => {
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
            value: (n: number = 0): RandomArrayNumber => {
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

        /**
         * Returns random color
         */
        Object.defineProperty(this, 'randomColor', ({
            value: (saturation: number, type: string = 'hex', n: number = -1): any => {
                if (!RandomColor.getTypes()[type]) {
                    throw new Error(`Type ${type} is not allowed`);
                }
                this._randomColorFabric.setSaturation(saturation);
                return this._randomColorFabric.randomColor(type, n);
            }
        }: Object));

        /**
         * Returns next random color
         */
        Object.defineProperty(this, 'nextColor', ({
            value: (saturation: number, type: string = 'hex'): any => {
                if (!RandomColor.getTypes()[type]) {
                    throw new Error(`Type ${type} is not allowed`);
                }
                this._randomColorFabric.setSaturation(saturation);
                return this._randomColorFabric.nextColor(type);
            }
        }: Object));
    }
}

// Add methods extractor
const randomjs: RandomJS = new RandomJS();
const methods = {
    analyze: randomjs.analyze,
    utils: randomjs.utils,
    stringutils: randomjs.stringutils,
    sample: randomjs.sample,
    kfold: randomjs.kfold,
    shuffle: randomjs.shuffle,
    derange: randomjs.derange,
    chance: randomjs.chance,
    winsorize: randomjs.winsorize,
    hash: randomjs.hash,
    smooth: randomjs.smooth,
    smoothSync: randomjs.smoothSync,
    seed: randomjs.seed,
    prng: randomjs.prng,
    encoder: randomjs.encoder,
    uid: randomjs.uid,
    random: randomjs.random,
    next: randomjs.next,
    randomInt: randomjs.randomInt,
    nextInt: randomjs.nextInt,
    randomInRange: randomjs.randomInRange,
    nextInRange: randomjs.nextInRange,
    newRouletteWheel: randomjs.newRouletteWheel,
    newPrng: randomjs.newPrng,
    randomColor: randomjs.randomColor,
    nextColor: randomjs.nextColor
};
Object.keys(distributionMethods).forEach((rand_method: string) => {
    methods[rand_method] = (Object.getOwnPropertyDescriptor(randomjs, rand_method): any).get();
});

module.exports = methods;
