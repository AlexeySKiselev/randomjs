// @flow
/**
 * r250 PRNG
 * S. Kirkpatrick and E. Stoll, “A very fast shift-register sequence random number generator”, Journal of Computational Physics, 40, 517–526 (1981)
 * x_n = x_{n-103} ^ x_{n-250}
 * Period: ~2^250
 */

import BasicPRNG from './BasicPRNG';
import TucheiPRNG from './TucheiPRNG';
import type { IPRNG } from '../interfaces';
import type {NumberString} from '../types';

const WORD_LEFT: number = 250;
const WORD_RIGHT: number = 103;
const NEGATIVE_WORD_RIGHT: number = WORD_LEFT - WORD_RIGHT; // need it for simplify calculation
const RECALCULATE_FREQ: number = 65536;

class R250PRNG extends BasicPRNG implements IPRNG {

    _localPrng: IPRNG;
    _words: Array<number>;
    _pointer: number; // track current pointer in words array
    _recalculate_counter: number;
    _no_seed: boolean;
    _state: {[prop: string]: number}; // state after setting seed
    _pointersRight: Array<number>;

    constructor() {
        super();
        this._no_seed = true;
        this._state = {};
        this._localPrng = new TucheiPRNG();
        this._recalculate_counter = 0;
        this._pointersRight = this._generate_shifted_pointers(NEGATIVE_WORD_RIGHT);
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

        this._words[this._pointer] = this._words[this._pointersRight[this._pointer]] ^ this._words[this._pointer];
        res = this._words[this._pointer];
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

export default R250PRNG;
