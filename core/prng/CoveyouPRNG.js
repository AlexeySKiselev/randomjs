// @flow
/**
 * Coveyou PRNG
 * It is taken from Knuth’s Seminumerical Algorithms, 3rd Ed., Section 3.2.2.
 */

import BasicPRNG from './BasicPRNG';
import type { IPRNG } from '../interfaces';
import type {NumberString} from '../types';

class CoveyouPRNG extends BasicPRNG implements IPRNG {

    _M: number;
    _x: number;
    _modulos: Array<number>; // pre calculated modulo of 10^x mod _M
    _no_seed: boolean;
    _state: {[prop: string]: number}; // state after setting seed

    constructor() {
        super();
        this._no_seed = true;
        this._state = {};
        this._M = 0x100000000;
        // to be recalculated since _M changed
        this._modulos = [
            1, // 10^0 mod _M
            10, // 10^1 mod _M
            100, // 10^2 mod _M
            1000, // 10^3 mod _M
            10000, // 10^4 mod _M
            100000, // 10^5 mod _M
            1000000, // 10^6 mod _M
            10000000, // 10^7 mod _M
            100000000, // 10^8 mod _M
            1000000000, // 10^9 mod _M
            1410065408, // 10^10 mod _M
            1215752192, // 10^11 mod _M
            3567587328, // 10^12 mod _M
            1316134912, // 10^13 mod _M
            276447232, // 10^14 mod _M
            2764472320, // 10^15 mod _M
            1874919424, // 10^16 mod _M
            1569325056, // 10^17 mod _M
            2808348672 // 10^18 mod _M
        ];
        this._initialize();
    }

    /**
     * Initializes initial values and sets state for calculating random number
     * @private
     */
    _initialize(): void {
        this._x = 0;
    }

    /**
     * Sets state for random number generating
     * @param {number} x
     * @private
     */
    _setState(x: number): void {
        this._state._x = x;
    }

    /**
     * Gets values from state
     * @private
     */
    _get_from_state(): void {
        this._x = this._state._x;
    }

    /**
     * Creates random seed
     * @private
     */
    _set_random_seed(): void {
        this._seed = BasicPRNG.random_seed();
        this._x = this._seed % this._M;
    }

    /**
     * @override
     * @param {?NumberString} seed_value
     */
    seed(seed_value: ?NumberString): void {
        this._initialize();
        if (seed_value === undefined || seed_value === null) {
            this._no_seed = true;
        } else if (typeof seed_value === 'number') {
            this._seed = Math.floor(seed_value);
            this._x = this._seed % this._M;
            this._setState(this._x);
            this._no_seed = false;
        } else if (typeof seed_value === 'string') {
            this._seed = seed_value;
            for (let i = 0; i < this._seed.length; i += 1) {
                this._x = (this._x + this._seed.charCodeAt(i)) % this._M;
                this._nextInt();
            }
            this._setState(this._x);
            this._no_seed = false;
        } else {
            this._no_seed = true;
            throw new Error('You should point seed with types: "undefined", "number" or "string"');
        }
    }

    /**
     * Squares value with modulo
     * Need it for more precise calculation
     * @private
     */
    _squareWithModulo(x: number): number {
        // extract data from x
        const xData: Array<number> = [0];
        let _x: number = x;
        let i: number = 0;
        while (_x > 0) {
            xData[i] = _x % 10;
            _x = Math.floor(_x / 10);
            i += 1;
        }

        let res: number = 0;
        for (let i = 0; i < xData.length; i += 1) {
            // add squares
            res = (res + xData[i] * ((xData[i] * this._modulos[2 * i]) % this._M)) % this._M;

            // add other parts
            for (let j = i + 1; j < xData.length; j += 1) {
                res = (res + 2 * xData[i] * ((xData[j] * this._modulos[i + j]) % this._M)) % this._M;
            }
        }

        return res;
    }

    _nextInt(): number {
        let x: number = this._x;
        x = (this._squareWithModulo(x) + x) % this._M;
        return this._x = x;
    }

    /**
     * @override
     * @returns {number}
     */
    next(): number {
        return (this._nextInt() >>> 0) / this._M;
    }
}

export default CoveyouPRNG;
