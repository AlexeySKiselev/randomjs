// @flow
/**
 * gfsr4 PRNG
 * Robert M. Ziff, “Four-tap shift-register-sequence random-number generators”, Computers in Physics, 12(4), Jul/Aug 1998, pp 385–392.
 * r_n = r_{n-A} ^ r_{n-B} ^ r_{n-C} ^ r_{n-D}
 * A=471, B=1586, C=6988, D=9689
 * Period: 2^D - 1
 */

import BasicPRNG from './BasicPRNG';
import TucheiPRNG from './TucheiPRNG';
import type { IPRNG } from '../interfaces';
import type {NumberString} from '../types';

const WORD_A: number = 471;
const WORD_B: number = 1586;
const WORD_C: number = 6988;
const WORD_D: number = 9689;
const NEGATIVE_WORD_A: number = WORD_D - WORD_A; // need it for simplify calculation
const NEGATIVE_WORD_B: number = WORD_D - WORD_B; // need it for simplify calculation
const NEGATIVE_WORD_C: number = WORD_D - WORD_C; // need it for simplify calculation
const RECALCULATE_FREQ = 65536;

class Gfsr4PRNG extends BasicPRNG implements IPRNG {

    _localPrng: IPRNG;
    _words: Array<number>;
    _pointer: number; // track current pointer in words array
    _recalculate_counter: number;
    _no_seed: boolean;
    _state: {[prop: string]: number}; // state after setting seed
    _pointersA: Array<number>;
    _pointersB: Array<number>;
    _pointersC: Array<number>;

    constructor() {
        super();
        this._no_seed = true;
        this._state = {};
        this._localPrng = new TucheiPRNG();
        this._recalculate_counter = 0;
        this._pointersA = this._generate_shifted_pointers(NEGATIVE_WORD_A);
        this._pointersB = this._generate_shifted_pointers(NEGATIVE_WORD_B);
        this._pointersC = this._generate_shifted_pointers(NEGATIVE_WORD_C);
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
        this._words = (this._localPrng.randomInt(WORD_D): any);
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
        this._state._words = (words: any).slice();
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
            this._initialize(this._seed % WORD_D);
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
            this._pointer = this._seed % WORD_D;
            this._initialize(this._pointer);
            this._setState(this._pointer, this._words);
            this._no_seed = false;
        } else if (typeof seed_value === 'string') {
            this._seed = seed_value;
            for (let i = 0; i < this._seed.length; i += 1) {
                this._pointer = (this._pointer + this._seed.charCodeAt(i)) % WORD_D;
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

        this._words[this._pointer] =
            this._words[this._pointersA[this._pointer]]
            ^ this._words[this._pointersB[this._pointer]]
            ^ this._words[this._pointersC[this._pointer]]
            ^ this._words[this._pointer];
        res = this._words[this._pointer];
        this._pointer += 1;
        if (this._pointer >= WORD_D) {
            this._pointer = this._pointer % WORD_D;
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
        for (let i = 0; i < WORD_D; i += 1) {
            res[i] = (i + shift) % WORD_D;
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

export default Gfsr4PRNG;
