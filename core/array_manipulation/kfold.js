// @flow
/**
 * k-fold method
 * Get k sets with random elements
 * Does not mutate original array
 * Created by Alexey S. Kiselev
 */

import ArrayManipulation from './base';
import Shuffle from './shuffle';

import type { KFoldOptions, KFoldCrossValidation, RandomArrayNumberString,
    RandomArrayStringObject, RandomArrayString } from '../types';
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
    }): RandomArrayStringObject<any> | KFoldCrossValidation {
        this._validateInput(input, false);

        if (typeof k !== 'number') {
            throw new Error('k-fold: Parameter "k" should be a number');
        }

        if (k > input.length || k <= 0) {
            throw new Error('k-fold: Parameter "k" should be greater then 0 and less input.length');
        }

        const folds: Array<number> = this._getFolds(input.length, k);
        let permutedInput: RandomArrayString<number | string>;
        if (!options.derange) {
            permutedInput = this._shuffle.getPermutation(input);
        } else {
            permutedInput = this._shuffle.getDerangement(input);
        }
        
        if (options.type === 'list') {
            return this._getListSetKFold(permutedInput, folds, []);
        } else if (options.type === 'set') {
            return this._getListSetKFold(permutedInput, folds, {});
        } else if (options.type === 'crossvalidation') {
            return this._getCrossValidationKFold(permutedInput, folds);
        } 
        throw new Error('k-fold: Wrong output type, should be "list", "set" or "crossvalidation"');
    }

    /**
     * Generates kfold output for "crossvalidation" type
     * @param {*} permutedInput 
     * @param {*} folds 
     * @param {*} result 
     */
    _getCrossValidationKFold(
        permutedInput: RandomArrayString<number | string>,
        folds: Array<number>
    ): KFoldCrossValidation {
        const result = [];
        const listFolds: RandomArrayStringObject<any> = this._getListSetKFold(permutedInput, folds, []);
        for (let i = 0; i < listFolds.length; i += 1) {
            result.push({
                id: i,
                test: listFolds[i].slice(),
                data: this._generateData(listFolds, i)
            });
        }

        return result;
    }

    /**
     * Genarates data for crossvalidation
     * Collects all data from all folds except fold[i]
     * @param {RandomArrayStringObject<any>} listFolds 
     * @param {number} i
     * @private
     */
    _generateData(listFolds: RandomArrayStringObject<any>, i: number): Array<RandomArrayStringObject<any>> {
        const result: Array<RandomArrayStringObject<any>> = [];
        for (let j = 0; j < i; j += 1) {
            this._addSubData(listFolds[j], result);
        }
        for (let j = i + 1; j < listFolds.length; j += 1) {
            this._addSubData(listFolds[j], result);
        }

        return result;
    }

    /**
     * @param {RandomArrayStringObject<any>} listFolds 
     * @param {Array<RandomArrayStringObject<any>>} result
     * @private
     */
    _addSubData(listFolds: RandomArrayStringObject<any>, result: Array<RandomArrayStringObject<any>>): void {
        for (let k = 0; k < listFolds.length; k += 1) {
            result.push(listFolds[k]);
        }
    }

    /**
     * Generates kfold output for "list" and "set" types
     * @param {RandomArrayString<number | string>} permutedInput
     * @param {Array<number>} folds
     * @param {RandomArrayStringObject<any>} result
     * @private
     */
    _getListSetKFold(
        permutedInput: RandomArrayString<number | string>,
        folds: Array<number>,
        result: RandomArrayStringObject<any>
    ): RandomArrayStringObject<any> {
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
