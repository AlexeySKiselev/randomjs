// @flow
/**
 * Sample method
 * Get k random elements from array with N elements (0 < k <= N)
 * Created by Alexey S. Kiselev
 */

import ArrayManipulation from './base';
import Shuffle from './shuffle';

import type { RandomArrayNumberString, RandomArrayStringObject } from '../types';
import type { ISample, IShuffle } from '../interfaces';

class Sample extends ArrayManipulation implements ISample {

    _shuffle: IShuffle;

    constructor() {
        super();
        this._shuffle = new Shuffle();
    }

    getSample(input: any, k: number, shuffle: boolean = false): RandomArrayStringObject<number | string> {
        let result: RandomArrayStringObject<number | string>;
        this._validateInput(input);

        if(typeof k !== 'number' || k <= 0) {
            throw new Error('Sample: "k" must be positive integer');
        }

        if(k >= input.length) {
            if(shuffle && !(typeof input === 'object' && !Array.isArray(input))) {
                return this._shuffle.getPermutation(input);
            }
            return input;
        }

        // For performance purposes I am going to separate sampling methods for different types
        if(typeof input === 'string') {
            result = this._getSampleForString(input, k);
        } else if(Array.isArray(input)){
            result = this._getSampleForArray(input, k);
        } else {
            result = this._getSampleForObject(input, k);
        }
        if(shuffle && !(typeof input === 'object' && !Array.isArray(input))) {
            return this._shuffle.getPermutation(result);
        }
        return result;
    }

    /**
     * Improved sampling with O(n + k) in memory and O(k) in time
     * It makes sense only for shuffled results
     * By statistics - it is faster then _getSampleForArray method only for k <= n / 2
     * @param inputArr: Array
     * @param k: number
     * @returns {RandomArrayNumberString<number|string>}
     * @private
     */
    _getSampleImprovedForArray(
        inputArr: RandomArrayNumberString<number | string>,
        k: number): RandomArrayNumberString<number | string>  {
        let input = inputArr.slice(),
            n: number = input.length,
            ni: number = n,
            r: number = -1,
            result: any = [],
            m: number = 0; // elements in result
        while(m < k) {
            r = Math.floor(Math.random() * ni);
            result[m] = [r, input[r]];
            m += 1;
            // swap chosen element and last element
            ni -= 1;
            // $FlowFixMe - Destructuring swap is faster
            [input[r], input[ni]] = [input[ni], input[r]];
        }
        return result;
    }

    /**
     * Private getSample method for arrays
     * O(k) in memory and O(n) in time
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
     * O(k) in memory, O(n) in time
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
     * O(k) in memory, O(n) in time
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
