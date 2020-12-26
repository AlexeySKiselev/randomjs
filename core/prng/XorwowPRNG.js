// @flow
/**
 * xorwow PRNG
 * http://www.jstatsoft.org/v08/i14/paper
 * Period: ~10^38
 */

import BasicPRNG from './BasicPRNG';
import XorshiftPRNG from './XorshiftPRNG';
import type { IPRNG } from '../interfaces';
import type {NumberString} from '../types';

const WORDS_NUMBER: number = 6;
const RECALCULATE_FREQ: number = 65536;

class XorwowPRNG extends BasicPRNG implements IPRNG {

    _localPrng: IPRNG;
    _words: Array<number>; // [x, y, z, w, v, d]
    _recalculate_counter: number;
    _no_seed: boolean;
    _state: {[prop: string]: number}; // state after setting seed
    _M: number;

    constructor() {
        super();
        this._no_seed = true;
        this._state = {};
        this._localPrng = new XorshiftPRNG();
        this._recalculate_counter = 0;
        this._M = 0x100000000;
        this._initialize();
        this._set_random_seed();
    }

    /**
     * Indicate whether seed is set up
     * @private
     * @override
     */
    _has_no_seed(): boolean {
        return this._no_seed;
    }

    /**
     * Initializes initial values and sets state for calculating random number
     * @private
     * @override
     */
    _initialize(): void {
        this._localPrng.seed(this._seed);
        this._words = (this._localPrng.randomInt(WORDS_NUMBER): any);
    }

    /**
     * Sets state for random number generating
     * @param {Array<number>} words
     * @private
     */
    _setState(words: Array<number>): void {
        this._state._words = (words: any).slice();
    }

    /**
     * Gets values from state
     * @private
     * @override
     */
    _get_from_state(): void {
        this._words = (this._state._words: any).slice();
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
     * @override
     */
    _set_random_seed(): void {
        this._seed = BasicPRNG.random_seed();
        if (this._recalculate_counter === 0) {
            this._initialize();
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
            this._set_random_seed();
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
            this._set_random_seed();
            throw new Error('You should point seed with types: "undefined", "number" or "string"');
        }
    }

    /**
     * @override
     * @returns {number}
     * @private
     */
    _nextInt(): number {
        const t: number = this._words[0] ^ (this._words[0] >> 2);
        this._words[0] = this._words[1];
        this._words[1] = this._words[2];
        this._words[2] = this._words[3];
        this._words[3] = this._words[4];
        this._words[4] = (this._words[4] ^ (this._words[4] << 4)) ^ (t ^ (t << 1));
        this._words[5] = this._words[5] + 362437;
        if (this._words[5] >= this._M) {
            this._words[5] = this._words[5] % this._M;
        }

        let res: number = this._words[5] + this._words[4];
        if (res >= this._M) {
            res = res % this._M;
        }
        return res;
    }

    /**
     * @override
     * @returns {number}
     */
    next(): number {
        return (this._nextInt() >>> 0) / this._M;
    }
}

export default XorwowPRNG;
