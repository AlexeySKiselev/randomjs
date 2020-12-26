// @flow
/**
 * Dx1597-f PRNG
 * http://www.personal.psu.edu/users/j/x/jxz203/lin/Lin_pub/2008_CompPhyComm.pdf
 * x{n}=B(x{n−3}+x{n−533}+x{n−1065}+x{n−1597}) mod m
 * B = 2^28 + 2^11 = 268437504
 * m = 2^31 - 1
 * Period: ~10^14903
 */

import BasicPRNG from './BasicPRNG';
import TucheiPRNG from './TucheiPRNG';
import type { IPRNG } from '../interfaces';
import type {NumberString, RandomArray} from '../types';

const WORD_4: number = 1597;
const WORD_3: number = 1065;
const WORD_2: number = 533;
const WORD_1: number = 3;
const NEGATIVE_WORD_3: number = WORD_4 - WORD_3; // need it for simplify calculation
const NEGATIVE_WORD_2: number = WORD_4 - WORD_2; // need it for simplify calculation
const NEGATIVE_WORD_1: number = WORD_4 - WORD_1; // need it for simplify calculation

const RECALCULATE_FREQ = 65536;

class Dx1597PRNG extends BasicPRNG implements IPRNG {

    _localPrng: IPRNG;
    _words: Array<number>;
    _M: number;
    _pointer: number; // track current pointer in words array
    _recalculate_counter: number;
    _no_seed: boolean;
    _state: {[prop: string]: number}; // state after setting seed
    _modulos: Array<number>;
    _xdata_modulos: RandomArray;

    constructor() {
        super();
        this._no_seed = true;
        this._state = {};
        this._localPrng = new TucheiPRNG();
        this._recalculate_counter = 0;
        this._words = [];
        this._M = 0x7FFFFFFF;
        this._modulos = [
            268437504, // B * 10^0 mod _M
            536891393, // B * 10^1 mod _M
            1073946636, // B * 10^2 mod _M
            2048125, // B * 10^3 mod _M
            20481250, // B * 10^4 mod _M
            204812500, // B * 10^5 mod _M
            2048125000, // B * 10^6 mod _M
            1153897177, // B * 10^7 mod _M
            801553535, // B * 10^8 mod _M
            1573084409 // B * 10^9 mod _M
        ];
        this._xdata_modulos = this._constructXDataModulos();
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
        for (let i = 0; i < WORD_4; i += 1) {
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
            this._initialize(this._seed % WORD_4);
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
            this._pointer = this._seed % WORD_4;
            this._initialize(this._pointer);
            this._setState(this._pointer, this._words);
            this._no_seed = false;
        } else if (typeof seed_value === 'string') {
            this._seed = seed_value;
            for (let i = 0; i < this._seed.length; i += 1) {
                this._pointer = (this._pointer + this._seed.charCodeAt(i)) % WORD_4;
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
    _multiplyByBWithModulo(x: number): number {
        // extract data from x
        let xData: number = 0;
        let _x: number = x;
        let i = 0;
        let res: number = 0;
        while (_x > 0) {
            xData = _x % 10;
            res += this._get_xdata_modulo(xData, i);
            _x = Math.floor(_x / 10);
            i += 1;
        }
        if (res >= this._M) {
            res = res % this._M;
        }

        return res;
    }

    /**
     * Constructs xData * this._modulos[j] hashmap
     * Keys will be i + j * 10 (i always [0..9])
     * Calculates data only in constructor
     * @private
     */
    _constructXDataModulos(): RandomArray {
        const res: RandomArray = [];
        // prefill res array
        for (let i = 0; i < (this._modulos.length + 1) * 10; i += 1) {
            res[i] = 0;
        }
        for (let xData = 0; xData < 10; xData += 1) {
            for (let j = 0; j < this._modulos.length; j += 1) {
                res[xData + j * 10] = (xData * this._modulos[j]) % this._M;
            }
        }
        return res;
    }

    /**
     * Get result from xdata_modulos
     * @private
     */
    _get_xdata_modulo(xData: number, j: number): number {
        return this._xdata_modulos[xData + j * 10];
    }

    /**
     * @override
     * @returns {number}
     * @private
     */
    _nextInt(): number {
        let res: number;

        this._words[this._pointer] = this._multiplyByBWithModulo(
            this._words[(this._pointer + NEGATIVE_WORD_1) % WORD_4]
            + this._words[(this._pointer + NEGATIVE_WORD_2) % WORD_4]
            + this._words[(this._pointer + NEGATIVE_WORD_3) % WORD_4]
            + this._words[this._pointer]);
        res = this._words[this._pointer];
        this._pointer += 1;
        if (this._pointer >= WORD_4) {
            this._pointer = this._pointer % WORD_4;
        }

        return res;
    }

    /**
     * @override
     * @returns {number}
     */
    next(): number {
        return ((this._nextInt() >>> 0) + 0.5) / this._M;
    }
}

export default Dx1597PRNG;
