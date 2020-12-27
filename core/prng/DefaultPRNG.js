// @flow
/**
 * Default PRNG
 */
import BasicPRNG from './BasicPRNG';
import type { IPRNG } from '../interfaces';
import type { RandomArrayNumber } from '../types';

class DefaultPRNG extends BasicPRNG implements IPRNG {
    constructor() {
        super();
    }

    _random(): number {
        return Math.random();
    }

    _randomInt(): number {
        return Math.floor(this._random() * 0x100000000);
    }

    /**
     * @override
     * @returns {Array<number>|number}
     */
    random(n: ?number = 0): RandomArrayNumber {
        if (typeof n !== 'number') {
            return this._random();
        }

        if (n < 1) {
            return this._random();
        }

        const random_array: Array<number> = [];
        for (let i = 0; i < n; i += 1) {
            random_array[i] = this._random();
        }
        return random_array;
    }

    /**
     * @override
     * @returns {Array<number>|number}
     */
    // eslint-disable-next-line
    randomInt(n: ?number = 0): RandomArrayNumber {
        if (typeof n !== 'number') {
            return this._randomInt();
        }

        if (n < 1) {
            return this._randomInt();
        }

        const random_array: Array<number> = [];
        for (let i = 0; i < n; i += 1) {
            random_array[i] = this._randomInt();
        }
        return random_array;
    }

    /**
     * @override
     * @returns {number}
     */
    next(): number {
        return this._random();
    }

    /**
     * @override
     * @returns {number}
     */
    nextInt(): number {
        return this._randomInt();
    }
}

export default DefaultPRNG;
