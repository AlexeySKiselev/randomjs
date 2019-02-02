// @flow

/**
 * Bernoulli Distribution
 * https://en.wikipedia.org/wiki/Bernoulli_distribution
 * This is discreet distribution
 * @param p: number (0 <= p <= 1) - Probability of success
 * @returns 0 or 1
 * Created by Alexey S. Kiselev
 */

import type {MethodError, RandomArray} from '../types';
import prng from '../prng/prngProxy';
import type { IDistribution } from '../interfaces';

class Bernoulli implements IDistribution {
    p: number;

    constructor(p: number): void {
        this.p = Number(p);
    }

    /**
     * Generates a random number
     * @returns a Bernoulli distributed number
     * This method returns only "1" or "0"
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

    _random(u: number): 0 | 1 {
        return (u <= this.p) ? 1 : 0;
    }

    /**
     * Generates Bernoulli distributed numbers
     * @param n: number - Number of elements in resulting array, n > 0
     * @returns Array<number> - Bernoulli distributed numbers
     */
    distribution(n: number): Array<number> {
        let bernoulliArray: Array<number> = [],
            random: RandomArray = (prng.random(n): any);
        for(let i: number = 0; i < n; i += 1){
            bernoulliArray[i] = this._random(random[i]);
        }
        return bernoulliArray;
    }

    /**
     * Error handling
     * For this distribution parameter "p" must be 0 <= p <= 1
     * @returns {boolean}
     */
    isError(): MethodError {
        if(!this.p && this.p !== 0) {
            return {error: 'Bernoulli distribution: you should point "p" numerical value'};
        }

        if(this.p < 0 || this.p > 1) {
            return {error: 'Bernoulli distribution: Parameter "p" must be from 0 to 1 inclusive'};
        }
        return { error: false };
    }

    /**
     * Refresh method
     * @param newP: number - new parameter "p"
     * This method does not return values
     */
    refresh(newP: number): void {
        this.p = Number(newP);
    }

    /**
     * Class .toString method
     * @returns {string}
     */
    toString(): string {
        let info = [
            'Bernoulli Distribution',
            `Usage: unirand.bernoulli(${this.p}).random()`
        ];
        return info.join('\n');
    }

    /**
     * Mean value
     * Information only
     * For calculating real mean value use analyzer
     */
    get mean(): number {
        return this.p;
    }

    /**
     * Median value
     * Information only
     * For calculating real median value use analyzer
     */
    get median(): number {
        if(this.p < (1 - this.p)){
            return 0;
        } else if(this.p === 0.5){
            return 0.5;
        } else {
            return 1;
        }
    }

    /**
     * Variance value
     * Information only
     * For calculating real variance value use analyzer
     */
    get variance(): number {
        return this.p * (1 - this.p);
    }

    /**
     * Skewness value
     * Information only
     * For calculating real skewness value use analyzer
     */
    get skewness(): number {
        return (1 - 2 * this.p) / Math.sqrt(this.p * (1 - this.p));
    }

    /**
     * Entropy value
     * Information only
     * For calculating real entropy value use analyzer
     */
    get entropy(): number {
        return -1 * (Math.log(1- this.p) * (1 - this.p) + Math.log(this.p) * this.p);
    }

    /**
     * Fisher information
     * Information only
     */
    get fisher(): number {
        return 1 / (this.p * (1 - this.p));
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
            fisher: this.fisher
        };
    }
}

module.exports = Bernoulli;
