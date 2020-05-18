// @flow
/**
 * tt800 PRNG
 * Makoto Matsumoto and Yoshiharu Kurita, “Twisted GFSR Generators II”, ACM Transactions on Modelling and Computer Simulation, Vol. 4, No. 3, 1994, pages 254–266.
 * https://dl.acm.org/doi/pdf/10.1145/189443.189445
 * Period: 10^240
 */

import BasicPRNG from './BasicPRNG';
import TucheiPRNG from './TucheiPRNG';
import type { IPRNG } from '../interfaces';
import type {NumberString} from '../types';

const NUMBER_WORDS: number = 25;
const M_VALUE: number = 7;
const RECALCULATE_FREQ: number = 65536;

class Tt800PRNG extends BasicPRNG implements IPRNG {

    _localPrng: IPRNG;
    _words: Array<number>;
    _recalculate_counter: number;
    _no_seed: boolean;
    _state: {[prop: string]: number}; // state after setting seed
    _M: number;
    _k: number;

    constructor() {
        super();
        this._no_seed = true;
        this._state = {};
        this._localPrng = new TucheiPRNG();
        this._recalculate_counter = 0;
        this._M = 0xffffffff;
        this._words = [];
        this._k = 0;
        this._initialize();
    }

    /**
     * Initializes initial values and sets state for calculating random number
     * @param {number} k
     * @private
     */
    _initialize(k: number = 0): void {
        this._localPrng.seed(this._seed);
        for (let i = 0; i < NUMBER_WORDS; i += 1) {
            this._words[i] = Math.floor(this._localPrng.next() * this._M);
        }
        this._k = k;
    }

    /**
     * Sets state for random number generating
     * @param {Array<number>} words
     * @private
     */
    _setState(words: Array<number>): void {
        this._state._words = words.slice();
    }

    /**
     * Gets values from state
     * @private
     */
    _get_from_state(): void {
        this._words = this._state._words.slice();
        this._k = 0;
    }

    /**
     * Prepare initial values for calculating random value
     * @private
     * @override
     */
    _prepare_initial(): void {
        if (this._no_seed === true) {
            this._set_random_seed();
        } else {
            this._get_from_state();
        }
    }

    /**
     * Creates random seed
     * @private
     */
    _set_random_seed(): void {
        this._seed = BasicPRNG.random_seed();
        if (this._recalculate_counter === 0) {
            this._initialize(this._k);
        }
        this._recalculate_counter += 1;
        if (this._recalculate_counter === RECALCULATE_FREQ) {
            this._recalculate_counter = 0;
        }
    }

    /**
     * @override
     * @param {?NumberString} seed_value
     */
    seed(seed_value: ?NumberString): void {
        if (seed_value === undefined || seed_value === null) {
            this._no_seed = true;
        } else if (typeof seed_value === 'number') {
            this._seed = Math.floor(seed_value);
            this._initialize();
            this._setState(this._words);
            this._no_seed = false;
        } else if (typeof seed_value === 'string') {
            this._seed = seed_value;
            this._initialize();
            this._setState(this._words);
            this._no_seed = false;
        } else {
            this._no_seed = true;
            throw new Error('You should point seed with types: "undefined", "number" or "string"');
        }
    }

    _nextInt(): number {
        let kk: number;
        if (this._k === NUMBER_WORDS) {
            for (kk = 0; kk < NUMBER_WORDS - M_VALUE; kk += 1) {
                if (this._words[kk] % 2 === 0) {
                    this._words[kk] = this._words[kk + M_VALUE] ^ (this._words[kk] >> 1);
                } else {
                    this._words[kk] = this._words[kk + M_VALUE] ^ (this._words[kk] >> 1) ^ 0x8ebfd028;
                }
            }
            for (; kk < NUMBER_WORDS; kk += 1) {
                if (this._words[kk] % 2 === 0) {
                    this._words[kk] = this._words[kk + M_VALUE - NUMBER_WORDS] ^ (this._words[kk] >> 1);
                } else {
                    this._words[kk] = this._words[kk + M_VALUE - NUMBER_WORDS] ^ (this._words[kk] >> 1) ^ 0x8ebfd028;
                }
            }

            this._k = 0;
        }

        let y: number = this._words[this._k];
        y ^= (y << 7) & 0x2b5b2500;
        y ^= (y << 15) & 0xdb8b0000;
        this._k += 1;
        return y;
    }

    /**
     * @override
     * @returns {number}
     */
    next(): number {
        return (this._nextInt() >>> 0) / this._M;
    }
}

export default Tt800PRNG;
