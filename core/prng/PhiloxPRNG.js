// @flow
/**
 * Philox 4x32 PRNG
 * http://www.thesalmons.org/john/random123/papers/random123sc11.pdf
 * Period: ~2^193
 */

import BasicPRNG from './BasicPRNG';
import TucheiPRNG from './TucheiPRNG';
import type { IPRNG } from '../interfaces';
import type {NumberString, RandomArray} from '../types';

const KEY_CONSTANT_1: number = 0xCD9E8D57;
const KEY_CONSTANT_2: number = 0xD2511F53;
const M_CONSTANT: number = 0xFFFFFFFF;
const KEY_CONSTANT_1_MULHI: number = (KEY_CONSTANT_1 >>> 0) / M_CONSTANT;
const KEY_CONSTANT_2_MULHI: number = (KEY_CONSTANT_2 >>> 0) / M_CONSTANT;
const KEY_CONSTANT_3: number = 0x9E3779B9;
const KEY_CONSTANT_4: number = 0xBB67AE85;
const RECALCULATE_FREQ: number = 65536;

class PhiloxPRNG extends BasicPRNG implements IPRNG {

    _localPrng: IPRNG;
    _recalculate_counter: number;
    _no_seed: boolean;
    _state: {[prop: string]: Array<number>}; // state after setting seed
    _counter: Array<number>;
    _key: Array<number>;
    _M: number;
    _modulos1: Array<number>;
    _modulos2: Array<number>;
    _xdata_modulos1: RandomArray;
    _xdata_modulos2: RandomArray;
    _chunk_pointer: number;

    constructor() {
        super();
        this._localPrng = new TucheiPRNG();
        this._no_seed = true;
        this._state = {};
        this._M = M_CONSTANT;
        this._recalculate_counter = 0;
        this._modulos1 = [
            3449720151, // KEY_CONSTANT_1 * 10^0 mod _M
            137463150, // KEY_CONSTANT_1 * 10^1 mod _M
            1374631500, // KEY_CONSTANT_1 * 10^2 mod _M
            861413115, // KEY_CONSTANT_1 * 10^3 mod _M
            24196560, // KEY_CONSTANT_1 * 10^4 mod _M
            241965600, // KEY_CONSTANT_1 * 10^5 mod _M
            2419656000, // KEY_CONSTANT_1 * 10^6 mod _M
            2721723525, // KEY_CONSTANT_1 * 10^7 mod _M
            1447431480, // KEY_CONSTANT_1 * 10^8 mod _M
            1589412915 // KEY_CONSTANT_1 * 10^9 mod _M
        ];
        this._modulos2= [
            3528531795, // KEY_CONSTANT_2 * 10^0 mod _M
            925579590, // KEY_CONSTANT_2 * 10^1 mod _M
            665861310, // KEY_CONSTANT_2 * 10^2 mod _M
            2363645805, // KEY_CONSTANT_2 * 10^3 mod _M
            2161621575, // KEY_CONSTANT_2 * 10^4 mod _M
            141379275, // KEY_CONSTANT_2 * 10^5 mod _M
            1413792750, // KEY_CONSTANT_2 * 10^6 mod _M
            1253025615, // KEY_CONSTANT_2 * 10^7 mod _M
            3940321560, // KEY_CONSTANT_2 * 10^8 mod _M
            748509945 // KEY_CONSTANT_2 * 10^9 mod _M
        ];
        this._xdata_modulos1 = this._constructXDataModulos(this._modulos1);
        this._xdata_modulos2 = this._constructXDataModulos(this._modulos2);
        this._chunk_pointer = 0;
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
    _initialize(seed: number = 0): void {
        const vector_seed: Array<number> = this._construct_vector_seed(seed);
        this._key = [vector_seed[0], vector_seed[1]];
        this._counter = [vector_seed[0], vector_seed[1], vector_seed[2], vector_seed[3]];
    }

    _construct_number_seed(seed: ?NumberString): number {
        if (typeof seed === 'number') {
            return Math.floor(seed) % this._M;
        } else if (typeof seed === 'string') {
            let res: number = 0;
            for (let i = 0; i < seed.length; i += 1) {
                res = (res + seed.charCodeAt(i)) % this._M;
            }
            return res;
        }
        return 0;
    }

    /**
     * Constructs vector (of size 4) seed from single seed
     * @param {NumberString} seed
     * @private
     */
    _construct_vector_seed(seed: number): Array<number> {
        const res: Array<number> = [];
        res[0] = seed;
        res[1] = (seed & 0xFFFF);
        res[2] = seed;
        res[3] = (seed >> 16);

        return res;
    }

    /**
     * Sets state for random number generating
     * @private
     */
    _setState(_counter: Array<number>, _key: Array<number>): void {
        this._state._counter = (_counter: any).slice();
        this._state._key = (_key: any).slice();
    }

    /**
     * Gets values from state
     * @private
     * @override
     */
    _get_from_state(): void {
        this._counter = (this._state._counter: any).slice();
        this._key = (this._state._key: any).slice();
    }

    /**
     * Creates random seed
     * @private
     * @override
     */
    _set_random_seed(): void {
        if (this._recalculate_counter === 0) {
            this._seed = Math.floor(this._M * (this._localPrng.random(): any));
            this._initialize(this._seed);
        }
        this._recalculate_counter += 1;
        if (this._recalculate_counter === RECALCULATE_FREQ) {
            this._recalculate_counter = 0;
        }
    }

    /**
     * Prepare initial values for calculating random value
     * @private
     * @override
     */
    _prepare_initial(): void {
        if (this._has_no_seed()) {
            this._set_random_seed();
        } else {
            this._get_from_state();
        }
    }

    /**
     * @override
     * @param {?NumberString} seed_value
     */
    seed(seed_value: ?NumberString): void {
        if (seed_value === undefined || seed_value === null) {
            this._no_seed = true;
            this._localPrng.seed(null);
            this._set_random_seed();
        } else if (typeof seed_value === 'number') {
            this._seed = Math.floor(seed_value);
            this._localPrng.seed(this._seed);
            this._initialize((this._seed: any));
            this._setState(this._counter, this._key);
            this._no_seed = false;
        } else if (typeof seed_value === 'string') {
            this._seed = this._construct_number_seed(seed_value);
            this._localPrng.seed(this._seed);
            this._initialize((this._seed: any));
            this._setState(this._counter, this._key);
            this._no_seed = false;
        } else {
            this._no_seed = true;
            this._localPrng.seed(null);
            this._set_random_seed();
            throw new Error('You should point seed with types: "undefined", "number" or "string"');
        }
    }

    /**
     * Generates next 4 random numbers
     * @private
     */
    _updateNextChunk(): void {
        const low0: number = this._multiplyByConstantWithModulo(this._counter[0], this._xdata_modulos2);
        const high0: number = this._mulhi(this._counter[0], KEY_CONSTANT_2_MULHI);
        const low1: number = this._multiplyByConstantWithModulo(this._counter[2], this._xdata_modulos1);
        const high1: number = this._mulhi(this._counter[2], KEY_CONSTANT_1_MULHI);

        this._counter = [
            ((high1 ^ this._counter[1] ^ this._key[0]) >>> 0),
            low1,
            ((high0 ^ this._counter[3] ^ this._key[1]) >>> 0),
            low0
        ];
        this._updateNextKeys();
    }

    _updateNextKeys(): void {
        this._key[0] = this._key[0] + KEY_CONSTANT_3;
        if (this._key[0] >= this._M) {
            this._key[0] = this._key[0] % this._M;
        }

        this._key[1] = this._key[1] + KEY_CONSTANT_4;
        if (this._key[1] >= this._M) {
            this._key[1] = this._key[1] % this._M;
        }
    }

    /**
     * @override
     * @returns {number}
     * @private
     */
    _nextInt(): number {
        if (this._chunk_pointer === 0) {
            this._updateNextChunk();
        }
        const res: number = this._counter[this._chunk_pointer];
        this._chunk_pointer += 1;
        if (this._chunk_pointer === 4) {
            this._chunk_pointer = 0;
        }
        return res;
    }

    /**
     * Multiply value by CONSTANT with modulo
     * Need it for more precise calculation
     * @private
     */
    _multiplyByConstantWithModulo(x: number, xDataModulo: RandomArray): number {
        // extract data from x
        let xData: number = 0;
        let _x: number = x;
        let i = 0;
        let res: number = 0;
        while (_x > 0) {
            xData = _x % 10;
            res += xDataModulo[xData + 10 * i];
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

    _mulhi(x: number, multiplier: number): number {
        return Math.floor(x * multiplier);
    }

    /**
     * @override
     * @returns {number}
     */
    next(): number {
        return (this._nextInt() >>> 0) / this._M;
    }
}

export default PhiloxPRNG;
