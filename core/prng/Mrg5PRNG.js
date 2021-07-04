// @flow
/**
 * Fifth-order multiple recursive PRNG
 * P. L’Ecuyer, F. Blouin, and R. Coutre, “A search for good multiple recursive random number generators”, ACM Transactions on Modeling and Computer Simulation 3, 87–98 (1993).
 * x_n = (a_1 x_{n-1} + a_5 x_{n-5}) mod m
 * with a_1 = 107374182, a_5 = 104480 and m = 2^31 - 1.
 * Period: ~10^46
 */

import BasicPRNG from './BasicPRNG';
import TucheiPRNG from './TucheiPRNG';
import type { IPRNG } from '../interfaces';
import type {NumberString, RandomArray} from '../types';

const WORD_LEFT: number = 5;
const WORD_RIGHT: number = 1;
const NEGATIVE_WORD_RIGHT: number = WORD_LEFT - WORD_RIGHT; // need it for simplify calculation
const RECALCULATE_FREQ: number = 65536;

class Mrg5PRNG extends BasicPRNG implements IPRNG {

    _localPrng: IPRNG;
    _words: Array<number>;
    _pointer: number; // track current pointer in words array
    _recalculate_counter: number;
    _no_seed: boolean;
    _state: {[prop: string]: any}; // state after setting seed
    _M: number;
    _modulosA1: Array<number>; // pre calculated modulo of A1 * 10^x mod _M
    _modulosA5: Array<number>; // pre calculated modulo of A5 * 10^x mod _M
    _xdata_modulosA1: RandomArray;
    _xdata_modulosA5: RandomArray;
    _pointersRight: Array<number>;

    constructor() {
        super();
        this._no_seed = true;
        this._state = {};
        this._localPrng = new TucheiPRNG();
        this._recalculate_counter = 0;
        this._M = 0x7FFFFFFF;
        // to be recalculated since _M changed
        this._modulosA1 = [
            107374182, // A1 * 10^0 mod _M
            1073741820, // A1 * 10^1 mod _M
            2147483612, // A1 * 10^2 mod _M
            2147483297, // A1 * 10^3 mod _M
            2147480147, // A1 * 10^4 mod _M
            2147448647, // A1 * 10^5 mod _M
            2147133647, // A1 * 10^6 mod _M
            2143983647, // A1 * 10^7 mod _M
            2112483647, // A1 * 10^8 mod _M
            1797483647 // A1 * 10^9 mod _M
        ];
        this._modulosA5 = [
            104480, // A5 * 10^0 mod _M
            1044800, // A5 * 10^1 mod _M
            10448000, // A5 * 10^2 mod _M
            104480000, // A5 * 10^3 mod _M
            1044800000, // A5 * 10^4 mod _M
            1858065412, // A5 * 10^5 mod _M
            1400784944, // A5 * 10^6 mod _M
            1122947558, // A5 * 10^7 mod _M
            492057345, // A5 * 10^8 mod _M
            625606156 // A5 * 10^9 mod _M
        ];
        this._words = [];
        this._xdata_modulosA1 = this._constructXDataModulos(this._modulosA1);
        this._xdata_modulosA5 = this._constructXDataModulos(this._modulosA5);
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
        for (let i = 0; i < WORD_LEFT; i += 1) {
            this._words[i] = Math.floor(this._localPrng.next() * this._M);
        }
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
        this._state._words = words.slice();
    }

    /**
     * Gets values from state
     * @private
     * @override
     */
    _get_from_state(): void {
        this._pointer = this._state._pointer;
        this._words = this._state._words.slice();
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
     * Multiply value by A with modulo
     * Need it for more precise calculation
     * @private
     */
    _multiplyByAWithModulo(x: number, xdata_modulos: Array<number>): number {
        // extract data from x
        let xData: number = 0;
        let _x: number = x;
        let i = 0;
        let res: number = 0;
        while (_x > 0) {
            xData = _x % 10;
            res += xdata_modulos[xData + 10 * i];
            _x = Math.floor(_x / 10);
            i += 1;
        }

        return res;
    }

    /**
     * @override
     * @returns {number}
     * @private
     */
    _nextInt(): number {
        let res: number;

        res = this._multiplyByAWithModulo(this._words[this._pointer], this._xdata_modulosA5)
            + this._multiplyByAWithModulo(this._words[this._pointersRight[this._pointer]], this._xdata_modulosA1);
        if (res >= this._M) {
            res = res % this._M;
        }
        this._words[this._pointer] = res;
        this._pointer += 1;
        if (this._pointer >= WORD_LEFT) {
            this._pointer = this._pointer % WORD_LEFT;
        }

        return res;
    }

    /**
     * Constructs xData * this._modulos[j] hashmap
     * Keys will be i + j * 10 (i always [0..9])
     * Calculates data only in constructor
     * @private
     */
    _constructXDataModulos(modulos: Array<number>): RandomArray {
        const res: RandomArray = [];
        // prefill res array
        for (let i = 0; i < (modulos.length + 1) * 10; i += 1) {
            res[i] = 0;
        }
        for (let xData = 0; xData < 10; xData += 1) {
            for (let j = 0; j < modulos.length; j += 1) {
                res[xData + j * 10] = (xData * modulos[j]) % this._M;
            }
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
        return (this._nextInt() >>> 0) / this._M;
    }
}

export default Mrg5PRNG;
