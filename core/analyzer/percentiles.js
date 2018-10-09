// @flow
/**
 * Common analyzer's methods
 * This class contains max, min, mean, median, mode, entropy, variance ... methods
 * Created by Alexey S. Kiselev
 */

import type { PercentileInput, RandomArray } from '../types';
import { AnalyzerPublicMethod, AnalyzerPublicFunction, AnalyzerSingleton } from '../decorators';

@AnalyzerSingleton
class Percentiles {
    /**
     * Main input Array
     */
    randomArray: RandomArray;

    constructor(randomArray: RandomArray): void {
        this.randomArray = randomArray.sort((a, b) => {
            return a - b;
        });
    }

    /**
     * Calculate particular percentile
     * @returns {number} or {undefined} in case of impossible percentile
     * @private
     */
    _calculate_percentile(value: number): ?number {
        if(value < 0 || value > 1 || typeof value !== 'number') {
            return undefined;
        }
        if(value === 0 || value === 1) {
            return this.randomArray[(this.randomArray.length - 1) * value];
        }
        let percentile_index: number = Math.floor(this.randomArray.length * value) - 1;
        if(percentile_index < 0) {
            return undefined;
        }
        if(this.randomArray.length % 2 === 0){
            return this.randomArray[percentile_index] + (1 - value) * (this.randomArray[percentile_index + 1] - this.randomArray[percentile_index]);
        }
        return this.randomArray[percentile_index + 1];
    }

    /**
     * Quartiles - 25%, 50% (median), 75%
     * @returns {{q1: number, q2: number, q3: number}}
     */
    @AnalyzerPublicMethod
    get quartiles(): {[string]: ?number} {
        return {
            'q1': this._calculate_percentile(0.25),
            'q2': this._calculate_percentile(0.5),
            'q3': this._calculate_percentile(0.75)
        };
    }

    /**
     * Median value - 50% Quartile
     * @returns {number}
     */
    @AnalyzerPublicMethod
    get median(): ?number {
        return this._calculate_percentile(0.5);
    }

    /**
     * Percentiles
     * Keep correct order for percentiles
     * @returns number or list of value depends on input
     */
    @AnalyzerPublicFunction
    percentile(value: PercentileInput<number>): ?PercentileInput<?number> {
        if(typeof value === 'number') {
            return this._calculate_percentile(value);
        } else if(Array.isArray(value)) {
            let percentile_array: Array<?number> = [];
            for(let i = 0; i < value.length; i += 1) {
                percentile_array[i] = this._calculate_percentile(value[i]);
            }
            return percentile_array;
        }
        throw new Error('Analyzer: input must be a number or an Array of numbers');
    }

    /**
     * Public method for analyzer
     * @returns {number} - Interquartile range
     */
    @AnalyzerPublicMethod
    get interquartile_range(): ?number {
        let quartiles: {[string]: ?number} = this.quartiles;
        if(quartiles['q3'] && quartiles['q1']) {
            return quartiles['q3'] - quartiles['q1'];
        }
        return undefined;
    }
}

module.exports = Percentiles;
