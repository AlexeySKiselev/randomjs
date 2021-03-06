// @flow
/**
 * Knuthran2 PRNG
 * Described by Knuth in Seminumerical Algorithms, 3rd Ed., page 108
 * Period: ~10^18
 */

import BasicPRNG from './BasicPRNG';
import type { IPRNG } from '../interfaces';
import type {NumberString, RandomArray} from '../types';

class Knuthran2PRNG extends BasicPRNG implements IPRNG {

    _M: number;
    _A1: number;
    _A2: number;
    _xm1: number;
    _xm2: number;
    _modulosA1: Array<number>; // pre calculated modulo of A1 * 10^x mod _M
    _modulosA2: Array<number>; // pre calculated modulo of A2 * 10^x mod _M
    _no_seed: boolean;
    _xdata_modulosA1: RandomArray;
    _xdata_modulosA2: RandomArray;
    _state: {[prop: string]: number}; // state after setting seed

    constructor() {
        super();
        this._no_seed = true;
        this._state = {};
        this._M = 0x7FFFFFFF;
        this._A1 = 0x1033C4D7;
        this._A2 = 0x12B9B0A5;
        // to be recalculated since _M changed
        this._modulosA1 = [
            271828183, // A1 * 10^0 mod _M
            570798183, // A1 * 10^1 mod _M
            1413014536, // A1 * 10^2 mod _M
            1245243478, // A1 * 10^3 mod _M
            1715016545, // A1 * 10^4 mod _M
            2117779921, // A1 * 10^5 mod _M
            1850446387, // A1 * 10^6 mod _M
            1324594694, // A1 * 10^7 mod _M
            361045058, // A1 * 10^8 mod _M
            1462966933 // A1 * 10^9 mod _M
        ];
        this._modulosA2 = [
            314159269, // A2 * 10^0 mod _M
            994109043, // A2 * 10^1 mod _M
            1351155842, // A2 * 10^2 mod _M
            626656538, // A2 * 10^3 mod _M
            1971598086, // A2 * 10^4 mod _M
            388628037, // A2 * 10^5 mod _M
            1738796723, // A2 * 10^6 mod _M
            208098054, // A2 * 10^7 mod _M
            2080980540, // A2 * 10^8 mod _M
            1482452577 // A2 * 10^9 mod _M
        ];
        this._xdata_modulosA1 = this._constructXDataModulos(this._modulosA1);
        this._xdata_modulosA2 = this._constructXDataModulos(this._modulosA2);
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
        this._xm1 = 0;
        this._xm2 = 0;
    }

    /**
     * Sets state for random number generating
     * @param {number} xm1
     * @param {number} xm2
     * @private
     */
    _setState(xm1: number, xm2: number): void {
        this._state._xm1 = xm1;
        this._state._xm2 = xm2;
    }

    /**
     * Gets values from state
     * @private
     * @override
     */
    _get_from_state(): void {
        this._xm1 = this._state._xm1;
        this._xm2 = this._state._xm2;
    }

    /**
     * Creates random seed
     * @private
     * @override
     */
    _set_random_seed(): void {
        this._seed = BasicPRNG.random_seed();
        this._xm2 = this._seed % this._M;
        this._xm1 = this._xm2 << 13;
    }

    /**
     * @override
     * @param {?NumberString} seed_value
     */
    seed(seed_value: ?NumberString): void {
        this._initialize();
        if (seed_value === undefined || seed_value === null) {
            this._no_seed = true;
            this._set_random_seed();
        } else if (typeof seed_value === 'number') {
            this._seed = Math.floor(seed_value);
            this._xm2 = this._seed % this._M;
            this._xm1 = this._xm2 << 13;
            this._setState(this._xm1, this._xm2);
            this._no_seed = false;
        } else if (typeof seed_value === 'string') {
            this._seed = seed_value;
            for (let i = 0; i < this._seed.length; i += 1) {
                this._xm2 = (this._xm2 + this._seed.charCodeAt(i)) % this._M;
                this._nextInt();
            }
            this._setState(this._xm1, this._xm2);
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
        let res: number = this._multiplyByAWithModulo(this._xm1, this._xdata_modulosA1)
            + this._multiplyByAWithModulo(this._xm2, this._xdata_modulosA2);
        this._xm2 = this._xm1;
        if (res >= this._M) {
            res = res % this._M;
        }
        this._xm1 = res;
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
     * @override
     * @returns {number}
     */
    next(): number {
        return (this._nextInt() >>> 0) / this._M;
    }
}

export default Knuthran2PRNG;
