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

    _derangeBranches: Array<number>;

    constructor() {
        super();

        // Calculate derange branches
        this._derangeBranches = this._calculateDerangeBranches();
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
     * Derange method
     * https://en.wikipedia.org/wiki/Derangement
     * @param input: any
     */
    getDerangement(input: any): RandomArrayString<number | string> {
        let result: RandomArrayString<number | string> = [];
        this._validateInput(input, false);

        // Check input length
        if(input.length === 1) {
            return input;
        }

        // For performance purposes I am going to separate permutation methods for different types
        if(typeof input === 'string') {
            result = this._getDerangementForString(input);
        } else if(Array.isArray(input)){
            result = this._getDerangementForArray(input);
        }

        return result;
    }

    /**
     * Get simple permutation for arrays
     * Fisher-Yates Shuffle algorithm
     * @param input: RandomArrayNumberString<number | string>
     * @returns RandomArrayNumberString
     * @private
     */
    _getSimplePermutationForArray<T>(input: RandomArrayNumberString<T>): RandomArrayNumberString<T> {
        let currentIndex: number = input.length,
            randomIndex: number;
        while(currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // $FlowFixMe - Destructuring swap is faster
            [input[currentIndex], input[randomIndex]] = [input[randomIndex], input[currentIndex]];
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

    /**
     * Get derangement for arrays
     * @param input: RandomArrayNumberString<T>
     * @returns RandomArrayNumberString<T>
     * @private
     */
    _getDerangementForArray<T>(input: RandomArrayNumberString<T>): RandomArrayNumberString<T> {
        let indexes: Array<number> = [],
            n = input.length, // input length
            ni: number = n, // number of elements in indexes array
            r1: number,
            x2: number,
            r2: number,
            rat: number,
            t: number;

        // Initialize indexes array
        for(let i = 0; i < input.length; i += 1) {
            indexes[i] = i;
        }

        while(ni >= 2) {
            r1 = indexes[ni - 1];
            x2 = Math.floor(Math.random() * (ni - 1));
            r2 = indexes[x2];

            // $FlowFixMe - Destructuring swap is faster
            [input[r1], input[r2]] = [input[r2], input[r1]];
            ni -= 1;
            rat = (ni <= 32) ? this._derangeBranches[ni] : (1 / ni);
            t = Math.random();

            if(t < rat) {
                ni -= 1;
                // $FlowFixMe - Destructuring swap is faster
                [indexes[x2], indexes[ni]] = [indexes[ni], indexes[x2]];
            }
        }
        return input;
    }

    /**
     * Get derangement for strings
     * @param input: string
     * @returns string
     * @private
     */
    _getDerangementForString(input: string): string {
        return this._getDerangementForArray(input.split('')).join('');
    }

    /**
     * Calculate derange branches probabilities for small n for derangement
     * @returns {Array<number>}
     * @private
     */
    _calculateDerangeBranches(): Array<number> {
        let result: Array<number> = [0, 1],
            Dn0: number = 1,
            Dn1: number = 0,
            n1: number = 1,
            Dn2: number;
        for(let i = 3; i <= 32; i += 1) {
            Dn2 = Dn1;
            Dn1 = 1;
            n1 += 1;
            Dn0 = n1 * (Dn1 + Dn2);
            Dn1 /= Dn0;
            Dn2 /= Dn0;
            result[i - 1] = n1 * Dn2;
        }
        return result;
    }
}

export default Shuffle;
