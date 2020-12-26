// @flow
/**
 * Marsenne Twister PRNG
 * https://en.wikipedia.org/wiki/Mersenne_Twister
 * Period: ~2^19937 - 1
 */

import BasicPRNG from './BasicPRNG';
import TucheiPRNG from './TucheiPRNG';
import type { IPRNG } from '../interfaces';
import type {NumberString} from '../types';

const WORD_LEFT: number = 624;
const WORD_RIGHT: number = 397;
const RECALCULATE_FREQ: number = 65536; // 2 ^ 16

class MarsenneTwisterPRNG extends BasicPRNG implements IPRNG {

    _localPrng: IPRNG;
    _words: Array<number>;
    _pointer: number; // track current pointer in words array
    _recalculate_counter: number;
    _no_seed: boolean;
    _state: {[prop: string]: number}; // state after setting seed
    _pointers1: Array<number>;
    _pointersRight: Array<number>;

    constructor() {
        super();
        this._no_seed = true;
        this._state = {};
        this._localPrng = new TucheiPRNG();
        this._recalculate_counter = 0;
        this._pointers1 = this._generate_shifted_pointers(1);
        this._pointersRight = this._generate_shifted_pointers(WORD_RIGHT);
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
     * @param {number} pointer
     * @private
     * @override
     */
    _initialize(pointer: number = 0): void {
        this._localPrng.seed(this._seed);
        this._words = (this._localPrng.randomInt(WORD_LEFT): any);
        this._pointer = pointer;
    }

    /**
     * Sets state for random number generating
     * @param {number} pointer
     * @param {Array<number>} words
     * @private
     */
    _setState(pointer: number, words: Array<number>): void {
        this._state._pointer = pointer;
        this._state._words = (words.slice(): any);
    }

    /**
     * Gets values from state
     * @private
     * @override
     */
    _get_from_state(): void {
        this._pointer = this._state._pointer;
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
            this._initialize(this._seed % WORD_LEFT);
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
            this._pointer = this._seed % WORD_LEFT;
            this._initialize(this._pointer);
            this._setState(this._pointer, this._words);
            this._no_seed = false;
        } else if (typeof seed_value === 'string') {
            this._seed = seed_value;
            for (let i = 0; i < this._seed.length; i += 1) {
                this._pointer = (this._pointer + this._seed.charCodeAt(i)) % WORD_LEFT;
            }
            this._initialize(this._pointer);
            this._setState(this._pointer, this._words);
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
        let res: number;
        const lsbY: number = (this._words[this._pointer] & 0x80000000) | (this._words[this._pointers1[this._pointer]] & 0x7fffffff);
        const lsb: number = ((lsbY & 0x1) === 0) ? 0 : 0x9908b0df;
        this._words[this._pointer] = this._words[this._pointersRight[this._pointer]] ^ (lsbY >> 1) ^ lsb;
        res = this._words[this._pointer];
        res = res ^ (res >>> 11);
        res = res ^ ((res << 7) & 0x9D2C5680);
        res = res ^ ((res << 15) & 0xefc60000);
        res = res ^ (res >>> 18);
        this._pointer += 1;
        if (this._pointer >= WORD_LEFT) {
            this._pointer = this._pointer % WORD_LEFT;
        }

        return res;
    }

    /**
     * Pre-calculate shifted pointers for performance reasons
     * @returns {Array<number>}
     * @private
     */
    _generate_shifted_pointers(shift: number): Array<number> {
        const res: Array<number> = [];
        for (let i = 0; i < WORD_LEFT; i += 1) {
            res[i] = (i + shift) % WORD_LEFT;
        }
        return res;
    }

    /**
     * @override
     * @returns {number}
     */
    next(): number {
        return (this._nextInt() >>> 0) / 0x100000000;
    }
}

export default MarsenneTwisterPRNG;
