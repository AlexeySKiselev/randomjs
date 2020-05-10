// @flow
/**
 * Kiss32 PRNG
 */

import BasicPRNG from './BasicPRNG';
import type { IPRNG } from '../interfaces';
import type {NumberString} from '../types';

class KissPRNG extends BasicPRNG implements IPRNG {

    _x: number;
    _y: number;
    _z: number;
    _w: number;
    _c: number;
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
        this._y = 0;
        this._z = 0;
        this._w = 0;
        this._c = 0;
    }

    /**
     * Initializes initial values with seed and sets state for calculating random number
     * @private
     */
    _initialize_with_seed() {
        this._x = this._seed | 0;
        this._y = this._seed << 5 | 0;
        this._z = this._seed >> 7 | 0;
        this._w = this._seed << 22 | 0;
        this._c = 0;
    }

    /**
     * Sets state for random number generating
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {number} w
     * @param {number} c
     * @private
     */
    _setState(x: number, y: number, z: number, w: number, c: number): void {
        this._state._x = x;
        this._state._y = y;
        this._state._z = z;
        this._state._w = w;
        this._state._c = c;
    }

    /**
     * Gets values from state
     * @private
     */
    _get_from_state(): void {
        this._x = this._state._x;
        this._y = this._state._y;
        this._z = this._state._z;
        this._w = this._state._w;
        this._c = this._state._c;
    }

    /**
     * Creates random seed
     * @private
     */
    _set_random_seed(): void {
        this._seed = BasicPRNG.random_seed();
        this._initialize_with_seed();
    }

    /**
     * @override
     * @param {?NumberString} seed_value
     */
    seed(seed_value: ?NumberString): void {
        let _tempSeed;
        this._initialize();
        if (seed_value === undefined || seed_value === null) {
            this._no_seed = true;
        } else if (typeof seed_value === 'number') {
            this._seed = Math.floor(seed_value);
            this._initialize_with_seed();
            this._setState(this._x, this._y, this._z, this._w, this._c);
            this._no_seed = false;
        } else if (typeof seed_value === 'string') {
            this._seed = seed_value;
            for (let i = 0; i < this._seed.length + 20; i += 1) {
                _tempSeed = this._seed.charCodeAt(i);
                this._x ^= _tempSeed | 0;
                this._y ^= _tempSeed << 5 | 0;
                this._z ^= _tempSeed >> 7 | 0;
                this._w ^= _tempSeed << 22 | 0;
                this._nextInt();
            }
            this._setState(this._x, this._y, this._z, this._w, this._c);
            this._no_seed = false;
        } else {
            this._no_seed = true;
            throw new Error('You should point seed with types: "undefined", "number" or "string"');
        }
    }

    _nextInt(): number {
        let t: number;
        this._y ^= (this._y << 5);
        this._y ^= (this._y >> 7);
        this._y ^= (this._y << 22);
        t = this._z + this._w + this._c;
        this._z = this._w;
        this._c = t < 0;
        this._w = t & 0x7FFFFFFF;
        this._x += 0x542023AB;

        return this._x + this._y + this._w;
    }

    /**
     * @override
     * @returns {number}
     */
    next(): number {
        return (this._nextInt() >>> 0) / 0x100000000;
    }
}

export default KissPRNG;
