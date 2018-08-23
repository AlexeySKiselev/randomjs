// @flow
/**
 * Arrays and strings shuffle method
 * Get random permutation of array
 * Simple permutation by default
 * Created by Alexey S. Kiselev
 */

import ArrayManipulation from './base';

import type { IShuffle } from '../interfaces';
import type { RandomArrayString, RandomArrayNumberString } from '../types';

class Shuffle extends ArrayManipulation implements IShuffle {

    constructor() {
        super();
    }

    getPermutation(input: any): RandomArrayString<number | string> {
        let result: RandomArrayString<number | string> = [];
        this._validateInput(input, false);

        // Check input length
        if(input.length === 1) {
            return input;
        }

        // For performance purposes I am going to separate permutation methods for different types
        if(typeof input === 'string') {
            result = this._getSimplePermutationForString(input);
        } else if(Array.isArray(input)){
            result = this._getSimplePermutationForArray(input);
        }

        return result;
    }

    /**
     * Get simple permutation for arrays
     * Fisher-Yates Shuffle algorithm
     * @param input: RandomArrayNumberString<number | string>
     * @returns RandomArrayNumberString<number | string>
     * @private
     */
    _getSimplePermutationForArray<T>(input: RandomArrayNumberString<T>): RandomArrayNumberString<T> {
        let currentIndex: number = input.length,
            randomIndex: number,
            temp: any;
        while(currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // swap
            temp = input[currentIndex];
            input[currentIndex] = input[randomIndex];
            input[randomIndex] = temp;
        }

        return input;
    }

    /**
     * Get simple permutation for strings
     * @param input: string
     * @returns string
     * @private
     */
    _getSimplePermutationForString(input: string): string {
        return this._getSimplePermutationForArray(input.split('')).join('');
    }
}

export default Shuffle;
