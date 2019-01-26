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

    random(n: ?number = 1): RandomArrayNumber {
        if (typeof n !== 'number') {
            return Math.random();
        }

        if (n <= 1) {
            return Math.random();
        }

        const random_array: Array<number> = [];
        for (let i = 0; i < n; i += 1) {
            random_array[i] = Math.random();
        }
        return random_array;
    }

    // eslint-disable-next-line
    randomInt(n: ?number = 1): RandomArrayNumber {
        throw new Error('Default RPNG does not have .randomInt method');
    }

    next(): number {
        return Math.random();
    }

    nextInt(): number {
        throw new Error('Default RPNG does not have .nextInt method');
    }
}

export default DefaultPRNG;
