// @flow
/**
 * Sample method
 * Get k random elements from array with N elements (0 < k <= N)
 * Created by Alexey S. Kiselev
 */

import ArrayManipulation from './base';

import type { RandomArrayNumberString, RandomArrayStringObject } from '../types';
import type { ISample } from '../interfaces';

class Sample extends ArrayManipulation implements ISample {

    constructor() {
        super();
    }

    getSample(input: any, k: number): RandomArrayStringObject<number | string> {
        this._validateInput(input);

        if(k >= input.length) {
            return 'shuffle';
        }
        // For performance purposes I am going to separate sampling methods for different types
        if(typeof input === 'string') {
            return this._getSampleForString(input, k);
        } else if(typeof input === 'object'){
            return this._getSampleForObject(input, k);
        }
        return this._getSampleForArray(input, k);
    }

    /**
     * Private getSample method for arrays
     * @param input: RandomArrayNumberString<number | string>
     * @param k: number
     * @private
     */
    _getSampleForArray(
        input: RandomArrayNumberString<number | string>,
        k: number
    ): RandomArrayNumberString<number | string> {
        // for arrays
        let result = [],
            n = input.length,
            t = 0, // total elements
            m = 0; // selected elements
        while(m < k) {
            if((n - t) * Math.random() < (k - m)) {
                result[m] = input[t];
                m += 1;
            }
            t += 1;
        }
        return result;
    }

    /**
     * Private getSample method for arrays
     * @param input: string
     * @param k: number
     * @private
     */
    _getSampleForString(
        input: string,
        k: number
    ): string {
        // for arrays
        let result = '',
            n = input.length,
            t = 0, // total elements
            m = 0; // selected elements
        while(m < k) {
            if((n - t) * Math.random() < (k - m)) {
                result += input[t];
                m += 1;
            }
            t += 1;
        }
        return result;
    }

    /**
     * Private getSample method for objects
     * @param input: RandomArrayNumberString<number | string>
     * @param k: number
     * @private
     */
    _getSampleForObject(
        input: {[any]: any},
        k: number
    ): {[any]: any} {
        // for arrays
        let result = {},
            keys = Object.keys(input),
            n = keys.length,
            t = 0, // total elements
            m = 0; // selected elements
        while(m < k) {
            if((n - t) * Math.random() < (k - m)) {
                result[keys[t]] = input[keys[t]];
                m += 1;
            }
            t += 1;
        }
        return result;
    }
}

export default Sample;
