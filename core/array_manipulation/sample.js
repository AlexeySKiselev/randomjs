// @flow
/**
 * Sample method
 * Get k random elements from array with N elements (0 < k <= N)
 * Created by Alexey S. Kiselev
 */

import ArrayManipulation from './base';
import Shuffle from './shuffle';

import type { RandomArray, RandomArrayNumberString, RandomArrayStringObject } from '../types';
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
            if((k / input.length) <= 0.2) {
                result = this._getHijenhuisWilfSampleForString(input, k);
            } else {
                result = this._getSampleForString(input, k);
            }
        } else if(Array.isArray(input)){
            if((k / input.length) <= 0.125) {
                result = this._getHijenhuisWilfSampleForArray(input, k);
            } else {
                result = this._getSampleForArray(input, k);
            }
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
     * Hijenhuis & Wilf algorithm for indexes
     * Improved sampling with O(k) time complexity
     * Does not mutate original array
     * @param n: number - number of elements in array or string
     * @param k: number
     * @returns {RandomArray} - array with random indexes shifted by one to the right
     * @private
     */
    _getHijenhuisWilfSampleIndexes(
        n: number,
        k: number): RandomArray {
        let c: number,
            a: RandomArray = [],
            x: number,
            l: number,
            i: number,
            p: number,
            s: number,
            temp: number,
            delta_s: number,
            r: number,
            m0: number,
            m: number;

        // 1 - O(k) complexity
        for(let idx = 0; idx < k; idx += 1) {
            a[idx] = Math.floor(idx * n / k);
        }
        c = k;

        // 2
        while(c > 0){
            x = 1 + Math.floor(Math.random() * n);
            l = 1 + Math.floor((x * k - 1)/ n);
            if(x > a[l - 1]) {
                a[l - 1] += 1;
                c -= 1;
            }
        }
        i = 0;
        p = 0;
        s = k;

        // 3 - O(k) complexity
        while(i < k) {
            i += 1;
            if(a[i - 1] === Math.floor(n * (i - 1) / k)) {
                a[i - 1] = 0;
                continue;
            }
            p += 1;
            temp = a[i - 1];
            a[i - 1] = 0;
            a[p - 1] = temp;
        }

        // 4
        while(p > 0) {
            l = 1 + Math.floor((a[p-1] * k - 1) / n);
            delta_s = a[p - 1] - Math.floor((l - 1) * n / k);
            a[p - 1] = 0;
            a[s - 1] = l;
            s -= delta_s;
            p -= 1;
        }
        l = k;

        // 5
        while(l > 0) {
            if(a[l - 1] > 0) {
                r = l;
                m0 = 1 + Math.floor((a[l - 1] - 1) * n / k);
                m = Math.floor(a[l - 1] * n / k) - m0 + 1;
            }
            // $FlowFixMe
            x = m0 + Math.floor(Math.random() * m);
            i = l;
            // eslint-disable-next-line no-constant-condition
            while(true){
                i += 1;
                // $FlowFixMe
                if(i > r || x < a[i - 1]) {
                    break;
                }
                a[i - 2] = a[i - 1];
                x += 1;
            }
            a[i - 2] = x;
            // $FlowFixMe
            m -= 1;
            l -= 1;
        }

        return a;
    }

    /**
     * Private getSample method (Hijenhuis & Wilf algorithm) for arrays
     * @param input: RandomArrayNumberString<number | string>
     * @param k: number
     * @private
     */
    _getHijenhuisWilfSampleForArray(
        input: RandomArrayNumberString<number | string>,
        k: number
    ): RandomArrayNumberString<number | string> {
        // for arrays
        let result: RandomArrayNumberString<number | string> = [],
            n: number = input.length,
            indexes: RandomArray = this._getHijenhuisWilfSampleIndexes(n, k);
        for(let idx = 0; idx < k; idx += 1) {
            result[idx] = input[indexes[idx] - 1];
        }
        return result;
    }

    /**
     * Private getSample method (Hijenhuis & Wilf algorithm) for strings
     * @param input: string
     * @param k: number
     * @private
     */
    _getHijenhuisWilfSampleForString(
        input: string,
        k: number
    ): string {
        // for strings
        let result: string = '',
            n: number = input.length,
            indexes: RandomArray = this._getHijenhuisWilfSampleIndexes(n, k);
        for(let idx = 0; idx < k; idx += 1) {
            result += input[indexes[idx] - 1];
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
        let result: RandomArrayNumberString<number | string> = [],
            n: number = input.length,
            t: number = 0, // total elements
            m: number = 0; // selected elements
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
        // for strings
        let result: string = '',
            n: number = input.length,
            t: number = 0, // total elements
            m: number = 0; // selected elements
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
        // for objects
        let result: Object = {},
            keys: Array<any> = Object.keys(input),
            n: number = keys.length,
            t: number = 0, // total elements
            m: number = 0; // selected elements
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
