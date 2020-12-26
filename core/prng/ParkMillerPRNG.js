// @flow
/**
 * ParkMiller PRNG
 * Period: 2^31 - 1
 */

import BasicPRNG from './BasicPRNG';
import type { IPRNG } from '../interfaces';
import type { NumberString } from '../types';

class ParkMillerPRNG extends BasicPRNG implements IPRNG {

    _M: number;
    _A: number;
    _Q: number;
    _R: number;
    _no_seed: boolean;
    _state: {[prop: string]: number}; // state after setting seed
    _x: number;

    constructor() {
        super();
        this._no_seed = true;
        this._state = {};
        this._M = 0x7fffffff;
        this._A = 48271;
        this._Q = 44488;
        this._R = 3399;
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
     * @override
     */
    _get_from_state(): void {
        this._x = this._state._x;
    }

    /**
     * Creates random seed
     * @private
     * @override
     */
    _set_random_seed(): void {
        this._seed = BasicPRNG.random_seed();
        this._x = this._seed | 0;
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
            this._x = this._seed | 0;
            this._setState(this._x);
            this._no_seed = false;
        } else if (typeof seed_value === 'string') {
            this._seed = seed_value;
            for (let i = 0; i < this._seed.length + 20; i += 1) {
                this._x ^= this._seed.charCodeAt(i) | 0;
                this._nextInt();
            }
            this._setState(this._x);
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
        const div: number = Math.floor(this._x / this._Q);
        const rem: number = this._x % this._Q;
        let res: number = rem * this._A - div * this._R;

        if (res < 0) {
            res += this._M;
        }

        return this._x = res;
    }

    /**
     * @override
     * @returns {number}
     */
    next(): number {
        return (this._nextInt() >>> 0) / this._M;
    }
}

export default ParkMillerPRNG;
