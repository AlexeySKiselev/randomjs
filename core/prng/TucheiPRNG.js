// @flow
/**
 * Tuchei PRNG
 * Period: ~2^32
 */
import BasicPRNG from './BasicPRNG';
import type { IPRNG } from '../interfaces';
import type { NumberString } from '../types';

class TucheiPRNG extends BasicPRNG implements IPRNG {

    _a: number;
    _b: number;
    _c: number;
    _d: number;
    _no_seed: boolean;
    _state: {[prop: string]: number}; // state after setting seed

    constructor() {
        super();
        this._no_seed = true;
        this._state = {};
        this._initialize();
    }

    /**
     * Initializes initial values and sets state for calculating random number
     * @private
     */
    _initialize(): void {
        this._a = 0;
        this._b = 0;
        this._c = 0x7FFFFFFF | 0;
        this._d = 0x517CC1B7;
    }

    /**
     * Sets state for random number generating
     * @param {number} a
     * @param {number} b
     * @param {number} c
     * @param {number} d
     * @private
     */
    _setState(a: number, b: number, c: number, d: number): void {
        this._state._a = a;
        this._state._b = b;
        this._state._c = c;
        this._state._d = d;
    }

    /**
     * Gets values from state
     * @private
     */
    _get_from_state(): void {
        this._a = this._state._a;
        this._b = this._state._b;
        this._c = this._state._c;
        this._d = this._state._d;
    }

    /**
     * Creates random seed
     * @private
     */
    _set_random_seed(): void {
        this._seed = BasicPRNG.random_seed();
        this._a = (this._seed / 0x100000000) | 0;
        this._b = this._seed | 0;
    }

    /**
     * @override
     * @returns {number}
     */
    next(): number {
        return (this._nextInt() >>> 0) / 0x100000000;
    }

    seed(seed_value: ?NumberString): void {
        this._initialize();
        if (seed_value === undefined || seed_value === null) {
            this._no_seed = true;
        } else if (typeof seed_value === 'number') {
            this._seed = Math.floor(seed_value);
            this._a = (this._seed / 0x100000000) | 0;
            this._b = this._seed | 0;
            this._setState(this._a, this._b, this._c, this._d);
            this._no_seed = false;
        } else if (typeof seed_value === 'string') {
            this._seed = seed_value;
            for (let i = 0; i < this._seed.length + 20; i += 1) {
                this._b ^= this._seed.charCodeAt(i) | 0;
                this._nextInt();
            }
            this._setState(this._a, this._b, this._c, this._d);
            this._no_seed = false;
        } else {
            this._no_seed = true;
            throw new Error('You should point seed with types: "undefined", "number" or "string"');
        }
    }

    _nextInt(): number {
        let a = this._a,
            b = this._b,
            c = this._c,
            d = this._d;

        b = (b << 25) ^ (b >>> 7) ^ c;
        c = (c - d) | 0;
        d = (d << 24) ^ (d >>> 8) ^ a;
        a = (a - b) | 0;
        this._b = b = (b << 20) ^ (b >>> 12) ^ c;
        this._c = c = (c - d) | 0;
        this._d = (d << 16) ^ (c >>> 16) ^ a;
        return this._a = (a - b) | 0;
    }
}

export default TucheiPRNG;
