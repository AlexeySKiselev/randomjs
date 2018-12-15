// @flow
/**
 * Winsorize method
 * https://en.wikipedia.org/wiki/Winsorizing
 * Created by Alexey S. Kiselev
 */

import ArrayManipulation from './base';
import Percentiles from '../analyzer/percentiles';

import type { IWinsorize } from '../interfaces';
import type { PercentileInput, RandomArray } from '../types';

class Winsorize extends ArrayManipulation implements IWinsorize {

    _percentile: Percentiles;

    constructor(): void {
        super();
    }

    winsorize(input: RandomArray, limits: PercentileInput<number> = 0.05, mutate: boolean = true): RandomArray {
        this._validateInput(input, false);
        this._percentile = new Percentiles(input.slice());

        let _percentileLimits: Array<number> = this._parseLimits(limits),
            _percentiles: any = this._percentile.percentile(_percentileLimits),
            min_percentile_value: number = this._binarySearch(_percentiles[0]),
            max_percentile_value: number = this._binarySearch(_percentiles[1]);

        if(mutate === false) {
            input = input.slice();
        }

        // Change input array values
        for(let i = 0; i < input.length; i += 1) {
            if(input[i] < _percentiles[0]) {
                input[i] = min_percentile_value;
            }
            if (input[i] > _percentiles[1]) {
                input[i] = max_percentile_value;
            }
        }
        return input;
    }

    _parseLimits(limits: any): Array<number> {
        if(typeof limits === 'number') {
            if(limits >= 0.5 || limits <=0) {
                throw new Error('Winsorize: limits should be less then 0.5 and greater then 0');
            }
            return [limits, 1 - limits];
        } else if(Array.isArray(limits)) {
            let limit1: number = limits[0],
                limit2: number = limits[1];
            if(typeof limit1 !== 'number' || typeof limit2 !== 'number') {
                throw new Error('Winsorize: should point limits as numbers');
            }
            if(limit1 <= 0 || limit1 >= 1 || limit2 <= limit1 || limit2 >= 1) {
                throw new Error('Winsorize: You should point correct limits');
            }
            return [limit1, limit2];
        }
        return [0.05, 0.95];
    }

    /**
     * Binary search for elements less then lower percentile
     * and elements greater then upper percentile
     * @private
     */
    _binarySearch(value: number): number {
        let start: number = 0,
            stop: number = this._percentile.randomArray.length - 1,
            middle: number;

        while (start <= stop) {
            middle = Math.floor((stop + start) / 2);
            if (value < this._percentile.randomArray[middle]) {
                stop = middle - 1;
            } else if (value > this._percentile.randomArray[middle]) {
                start = middle + 1;
            } else {
                return this._percentile.randomArray[middle];
            }
        }
        return ((this._percentile.randomArray[start] - value) < (value - this._percentile.randomArray[stop]))
            ? this._percentile.randomArray[start]
            : this._percentile.randomArray[stop];
    }
}

export default Winsorize;
