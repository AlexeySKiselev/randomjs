// @flow
/**
 * Xorshift32 PRNG
 */

import BasicPRNG from './BasicPRNG';
import type { IPRNG } from '../interfaces';
import type {NumberString} from '../types';

class XorshiftPRNG extends BasicPRNG implements IPRNG {

    _x: number;
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
            throw new Error('You should point seed with types: "undefined", "number" or "string"');
        }
    }

    _nextInt(): number {
        let x = this._x;

        x ^= x << 13;
        x ^= x >> 17;
        x ^= x << 5;
        return this._x = x;
    }

    /**
     * @override
     * @returns {number}
     */
    next(): number {
        return (this._nextInt() >>> 0) / 0x100000000;
    }
}

export default XorshiftPRNG;
