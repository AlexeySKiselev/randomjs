// @flow
/**
 * swb2712 PRNG - Modified subtract with borrow generator
 * https://www.jstatsoft.org/article/view/v005i08
 * https://www.doornik.com/research/ziggurat.pdf
 * Period: ~2^1492
 */

import BasicPRNG from './BasicPRNG';
import TucheiPRNG from './TucheiPRNG';
import type { IPRNG } from '../interfaces';
import type {NumberString} from '../types';

const LAG_R: number = 27;
const LAG_S: number = 12;
const RECALCULATE_FREQ: number = 65536; // 2 ^ 16

class Swb2712PRNG extends BasicPRNG implements IPRNG {

    _M: number;
    _words: Array<number>;
    _localPrng: IPRNG;
    _state: {[prop: string]: number}; // state after setting seed
    _no_seed: boolean;
    _recalculate_counter: number;
    _pointer: number;
    _pointersS: Array<number>;
    _c: number;

    constructor() {
        super();
        this._no_seed = true;
        this._state = {};
        this._localPrng = new TucheiPRNG();
        this._words = [];
        this._M = 0xFFFFFFFF;
        this._recalculate_counter = 0;
        this._pointersS = this._generate_shifted_pointers(LAG_S);

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
    _initialize(pointer: number = 0): void {
        this._localPrng.seed(this._seed);
        for (let i = 0; i < LAG_R; i += 1) {
            this._words[i] = Math.floor(this._localPrng.next() * this._M);
        }
        this._pointer = pointer;
        this._c = 0;
    }

    /**
     * Sets state for random number generating
     * @param {number} pointer
     * @param {Array<number>} words
     * @private
     */
    _setState(pointer: number, words: Array<number>, c: number): void {
        this._state._pointer = pointer;
        this._state._words = (words: any).slice();
        this._state._c = c;
    }

    /**
     * Gets values from state
     * @private
     * @override
     */
    _get_from_state(): void {
        this._pointer = this._state._pointer;
        this._words = (this._state._words: any).slice();
        this._c = this._state._c;
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
            this._initialize(this._seed % LAG_R);
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
            this._pointer = this._seed % LAG_R;
            this._initialize(this._pointer);
            this._setState(this._pointer, this._words, this._c);
            this._no_seed = false;
        } else if (typeof seed_value === 'string') {
            this._seed = seed_value;
            this._pointer = 0;
            for (let i = 0; i < this._seed.length; i += 1) {
                this._pointer = (this._pointer + this._seed.charCodeAt(i)) % LAG_R;
            }
            this._initialize(this._pointer);
            this._setState(this._pointer, this._words, this._c);
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
        const res: number = (this._words[this._pointersS[this._pointer]] - this._words[this._pointer] - this._c) % this._M;

        this._words[this._pointer] = res;
        this._pointer += 1;
        if (this._pointer >= LAG_R) {
            this._pointer = this._pointer - LAG_R;
        }

        if (res < 0) {
            this._c = 1;
            return res + this._M;
        }

        this._c = 0;
        return res;
    }

    /**
     * @override
     * @returns {number}
     */
    next(): number {
        return ((this._nextInt() >>> 0)) / this._M;
    }

    /**
     * Pre-calculate shifted pointers for performance reasons
     * @returns {Array<number>}
     * @private
     */
    _generate_shifted_pointers(shift: number): Array<number> {
        const res: Array<number> = [];
        for (let i = 0; i < LAG_R; i += 1) {
            res[i] = i - shift;
            if (res[i] < 0) {
                res[i] += LAG_R;
            }
        }
        return res;
    }
}

export default Swb2712PRNG;
