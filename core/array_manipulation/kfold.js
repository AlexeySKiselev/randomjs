// @flow
/**
 * k-fold method
 * Get k sets with random elements
 * Does not mutate original array
 * Created by Alexey S. Kiselev
 */

import ArrayManipulation from './base';
import Shuffle from './shuffle';

import type { KFoldOptions, RandomArrayNumberString, RandomArrayStringObject, RandomArrayString } from '../types';
import type { IKFold, IShuffle } from '../interfaces';

class KFold extends ArrayManipulation implements IKFold {

    _shuffle: IShuffle;

    constructor() {
        super();
        this._shuffle = new Shuffle();
    }

    /**
     * Get k-fold sets
     * @public
     */
    getKFold(input: RandomArrayNumberString<any>, k: number, options: KFoldOptions = {
        type: 'list',
        derange: false
    }): RandomArrayStringObject<any> {
        this._validateInput(input, false);

        if (typeof k !== 'number') {
            throw new Error('k-fold: Parameter "k" should be a number');
        }

        if (k > input.length || k <= 0) {
            throw new Error('k-fold: Parameter "k" should be greater then 0 and less input.length');
        }

        let result: RandomArrayStringObject<any>;
        
        if (options.type === 'list') {
            result = [];
        } else if (options.type === 'set') {
            result = {};
        } else {
            throw new Error('k-fold: Wrong output type, should be "list" or "set"');
        }

        let permutedInput: RandomArrayString<number | string>;
        if (!options.derange) {
            permutedInput = this._shuffle.getPermutation(input);
        } else {
            permutedInput = this._shuffle.getDerangement(input);
        }

        const folds: Array<number> = this._getFolds(input.length, k);
        let pindex: number = 0;
        let subResult: RandomArrayNumberString<any> = [];

        for (let i = 0; i < folds.length; i += 1) {
            for (let j = 0; j < folds[i]; j += 1) {
                subResult[j] = permutedInput[pindex];
                pindex += 1;
            }
            result[i] = subResult;
            subResult = [];
        }

        return result;
    }

    /**
     * Construct an array of "k" elements with with number of items in each fold
     * Max and min count of items differ at most of 1
     * Sum of all items shoul be "n"
     * @param {number} n - number of elements
     * @param {number} k - number of folds
     * @private
     */
    _getFolds(n: number, k: number): Array<number> {
        const result: Array<number> = [];
        const initialCount: number = Math.floor(n / k);
        let remain: number = n - k * initialCount;

        for (let i = 0; i < k; i += 1) {
            if (remain === 0) {
                result[i] = initialCount;
                continue;
            }
            result[i] = initialCount + 1;
            remain -= 1;
        }

        return result;
    }
}

export default KFold;
