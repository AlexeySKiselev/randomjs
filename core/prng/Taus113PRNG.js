// @flow
/**
 * Tausworthe PRNG
 * Period: 2^113
 * P. L'Ecuyer, "Maximally Equidistributed Combined Tausworthe Generators", Mathematics of Computation, 65, 213 (1996), 203--213
 */

import BasicPRNG from './BasicPRNG';
import type { IPRNG } from '../interfaces';
import type {NumberString} from '../types';

class Taus113PRNG extends BasicPRNG implements IPRNG {

    _s1: number;
    _s2: number;
    _s3: number;
    _s4: number;
    _no_seed: boolean;
    _state: {[prop: string]: number}; // state after setting seed

    constructor() {
        super();
        this._no_seed = true;
        this._state = {};
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
        this._s1 = 0;
        this._s2 = 0;
        this._s3 = 0;
        this._s4 = 0;
    }

    /**
     * Initializes initial values with seed and sets state for calculating random number
     * @private
     */
    _initialize_with_seed(): void {
        const seed: number = ((this._seed: any) << 10) ^ (this._seed: any);
        this._s1 = this._minSeed(seed, 2);
        this._s2 = this._minSeed(seed, 8);
        this._s3 = this._minSeed(seed, 16);
        this._s4 = this._minSeed(seed, 128);
    }

    /**
     * Sets state for random number generating
     * @param {number} s1
     * @param {number} s2
     * @param {number} s3
     * @param {number} s4
     * @private
     */
    _setState(s1: number, s2: number, s3: number, s4: number): void {
        this._state._s1 = s1;
        this._state._s2 = s2;
        this._state._s3 = s3;
        this._state._s4 = s4;
    }

    /**
     * Gets values from state
     * @private
     * @override
     */
    _get_from_state(): void {
        this._s1 = this._state._s1;
        this._s2 = this._state._s2;
        this._s3 = this._state._s3;
        this._s4 = this._state._s4;
    }

    /**
     * Creates random seed
     * @private
     * @override
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
            this._set_random_seed();
        } else if (typeof seed_value === 'number') {
            this._seed = Math.floor(seed_value);
            this._initialize_with_seed();
            this._setState(this._s1, this._s2, this._s3, this._s4);
            this._no_seed = false;
        } else if (typeof seed_value === 'string') {
            this._seed = seed_value;
            for (let i = 0; i < this._seed.length + 20; i += 1) {
                _tempSeed = this._seed.charCodeAt(i);
                _tempSeed = (_tempSeed << 10) ^ _tempSeed;
                this._s1 ^= this._minSeed(_tempSeed, 2);
                this._s2 ^= this._minSeed(_tempSeed, 8);
                this._s3 ^= this._minSeed(_tempSeed, 16);
                this._s4 ^= this._minSeed(_tempSeed, 128);
                this._nextInt();
            }

            this._setState(this._s1, this._s2, this._s3, this._s4);
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
        let b: number = ((this._s1 << 6) ^ this._s1) >> 13;
        this._s1 = ((this._s1 & 4294967294) << 18) ^ b;
        b = ((this._s2 << 2) ^ this._s2) >> 27;
        this._s2 = ((this._s2 & 4294967288) << 2) ^ b;
        b = ((this._s3 << 13) ^ this._s3) >> 21;
        this._s3 = ((this._s3 & 4294967280) << 7) ^ b;
        b = ((this._s4 << 3) ^ this._s4) >> 12;
        this._s4 = ((this._s4 & 4294967168) << 13) ^ b;

        return this._s1 ^ this._s2 ^ this._s3 ^ this._s4;
    }

    /**
     * @override
     * @returns {number}
     */
    next(): number {
        return (this._nextInt() >>> 0) / 0x100000000;
    }

    /**
     * Defines minimum value for seed
     */
    _minSeed(seed: number, minValue: number): number {
        return (seed < minValue) ? seed + minValue : seed;
    }

}

export default Taus113PRNG;
