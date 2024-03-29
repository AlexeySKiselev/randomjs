// @flow
/**
 *  Basic PRNG
 *  Generates random numbers with seed
 */
import type { IPRNG } from '../interfaces';
import type {NumberString, RandomArray, RandomArrayNumber} from '../types';
import hashProxy from '../utils/hash';

class BasicPRNG implements IPRNG {

    _seed: ?NumberString;

    constructor() {
        this._seed = undefined;
    }

    /**
     * Random number generator with seed
     * @public
     * @returns {number} random number
     */
    random(n: ?number = 0): RandomArrayNumber {
        this._prepare_initial();

        if (typeof n !== 'number') {
            return this.next();
        }

        if (n < 1) {
            return this.next();
        }

        const random_array: RandomArray = [];
        for (let i = 0; i < n; i += 1) {
            random_array[i] = this.next();
        }

        return random_array;
    }

    /**
     * Next random value
     * Returns only single random value
     * Does not support seed
     * @abstract
     * @returns {number}
     */
    next(): number {
        throw new Error('Unassigned method');
    }

    /**
     * Next integer random value
     * Returns only single random value
     * Does not support seed
     * @public
     * @returns {number}
     */
    nextInt(): number {
        return this._nextInt() >>> 0; // returns only unsigned integers
    }

    /**
     * @abstract
     * @protected
     */
    _nextInt(): number {
        throw new Error('Unassigned method');
    }

    /**
     * Generates random integer [0, 2^32)
     * @public
     * @returns {number}
     */
    randomInt(n: ?number = 0): RandomArrayNumber {
        this._prepare_initial();

        if (typeof n !== 'number') {
            return this.nextInt();
        }

        if (n < 1) {
            return this.nextInt();
        }

        const random_array: RandomArray = [];
        for (let i = 0; i < n; i += 1) {
            random_array[i] = this.nextInt();
        }

        return random_array;
    }

    /**
     * Sets seed value for PRNG
     * @public
     */
    seed(seed_value: ?NumberString): void {
        this._seed = seed_value;
    }

    /**
     * Modulo for seed
     * @returns {number}
     */
    static get modulo(): number {
        return 2147483647;
    }

    /**
     * Sets random seed
     */
    static random_seed(): number {
        let _seed: number = hashProxy.hash(Date.now() + Math.floor(Math.random() * BasicPRNG.modulo));
        if (_seed >= BasicPRNG.modulo) {
            _seed = _seed % BasicPRNG.modulo;
        }

        if (_seed < 0) {
            _seed += BasicPRNG.modulo - 1;
        }
        return _seed;
    }

    /**
     * Prepare initial values for calculating random value
     * @private
     */
    _prepare_initial(): void {
        if (this._has_no_seed()) {
            this._initialize();
            this._set_random_seed();
        } else {
            this._get_from_state();
        }
    }

    /**
     * @abstract
     * @protected
     */
    _has_no_seed(): boolean {
        throw new Error('Unassigned method');
    }

    /**
     * @protected
     * @abstract
     */
    _initialize(): void {
        throw new Error('Unassigned method');
    }

    /**
     * @protected
     * @abstract
     */
    _get_from_state(): void {
        throw new Error('Unassigned method');
    }

    /**
     * @protected
     * @abstract
     */
    _set_random_seed(): void {
        throw new Error('Unassigned method');
    }
}

export default BasicPRNG;
