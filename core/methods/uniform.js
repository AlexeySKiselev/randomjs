// @flow

/**
 * Continuous Uniform Distribution
 * https://en.wikipedia.org/wiki/Uniform_distribution_(continuous)
 * @param min: number - Minimal value of Uniform Distribution
 * @param max: number - Maximum value of Uniform Distribution
 * @returns Uniform Distributed value based on parameters
 * Created by Alexey S. Kiselev
 */

import type {MethodError, RandomArray} from '../types';
import prng from '../prng/prngProxy';

class Uniform {
    min: number;
    max: number;

    constructor(min: number = 0, max: number = 1): void {
        this.min = Math.min(min, max);
        this.max = Math.max(min, max);
    }

    /**
     * Generates a random number
     * Uses core Math.random() method but with [min, max] range
     */
    random(): number {
        return this._random((prng.random(): any));
    }

    /**
     * Generates next seeded random number
     * @returns {number}
     */
    next(): number {
        return this._random(prng.next());
    }

    _random(u: number): number {
        return this.min + u * (this.max - this.min);
    }

    /**
     * Generates an array of uniformly distributed numbers
     * @param n: number - number of elements in resulting array
     */
    distribution(n: number): RandomArray {
        let uniformArray: RandomArray = [],
            random: RandomArray = (prng.random(n): any);
        for(let i = 0; i < n; i += 1) {
            uniformArray[i] = this._random(random[i]);
        }
        return uniformArray;
    }

    /**
     * Error handling
     * Check if min === max then throw Error
     * @returns {boolean}
     */
    isError(): MethodError {
        if((!this.min && this.min !== 0) || (!this.max && this.max !== 0)) {
            return {error: 'Uniform distribution: you should point "min" and "max" numerical values'};
        }
        if(this.min === this.max) {
            return {error: 'Uniform distribution: min and max values can\'t be the same'};
        }
        return { error: false };
    }

    /**
     * Refresh method
     * @param newMin
     * @param newMax
     */
    refresh(newMin: number = 0, newMax: number = 1): void {
        this.min = Math.min(newMin, newMax);
        this.max = Math.max(newMin, newMax);
    }

    /**
     * toString() method
     * Show the description of this distribution
     * @returns {string}
     */
    toString() {
        let info = [
            'Continuous Uniform Distribution',
            `Usage: unirand.uniform(${this.min}, ${this.max}).random()`
        ];
        return info.join('\n');
    }

    /**
     * Mean value of this distribution
     * Information only
     * For calculating real mean value use analyzer
     */
    get mean(): number {
        return (this.min + this.max) / 2;
    }

    /**
     * Median value
     * Information only
     * For calculating real median value use analyzer
     */
    get median(): number {
        return (this.min + this.max) / 2;
    }

    /**
     * Variance value
     * Information only
     * For calculating real variance value use analyzer
     */
    get variance(): number {
        return Math.pow(this.max - this.min, 2) / 12;
    }

    /**
     * Skewness value
     * Information only
     */
    get skewness(): number {
        return 0;
    }

    /**
     * Entropy value
     * Information only
     */
    get entropy(): number {
        return Math.log(this.max - this.min);
    }

    /**
     * Kurtosis value
     * Information only
     */
    get kurtosis(): number {
        return - 6 / 5;
    }

    /**
     * All parameters of distribution in one object
     * Information only
     */
    get parameters(): {} {
        return {
            mean: this.mean,
            median: this.median,
            variance: this.variance,
            skewness: this.skewness,
            entropy: this.entropy,
            kurtosis: this.kurtosis
        };
    }
}

module.exports = Uniform;
