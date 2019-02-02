// @flow

/**
 * Logistic distribution
 * This is continuous distribution
 * https://en.wikipedia.org/wiki/Logistic_distribution
 * @param mu <number> - location, any number
 * @param s <number> - scale, s > 0
 * @returns Logistic distributed number
 * Created by Alexey S. Kiselev
 */

import type { RandomArray, MethodError } from '../types';
import prng from '../prng/prngProxy';

class Logistic {
    location: number;
    scale: number;

    constructor(mu: number, s: number): void {
        this.location = Number(mu);
        this.scale = Number(s);
    }

    /**
     * Generates a random number
     * @returns a Logistic distributed number
     */
    random(): number {
        let u: number = (prng.random(): any);
        return this._random(u);
    }

    /**
     * Generates next seeded random number
     * @returns {number}
     */
    next(): number {
        return this._random(prng.next());
    }

    _random(u: number): number {
        return this.location + this.scale * Math.log(u / (1 - u));
    }

    /**
     * Generates Logistic distributed numbers
     * @param n: number - Number of elements in resulting array, n > 0
     * @returns Array<number> - Logistic distributed numbers
     */
    distribution(n: number): RandomArray {
        let logisticArray: RandomArray = [],
            random: RandomArray = (prng.random(n): any);
        for(let i: number = 0; i < n; i += 1){
            logisticArray[i] = this._random(random[i]);
        }
        return logisticArray;
    }

    /**
     * Error handling
     * @returns {boolean}
     */
    isError(): MethodError {
        if((!this.location && this.location !== 0) || !this.scale) {
            return {error: 'Logistic distribution: you should point parameters "mu" and "s" (scale) with numerical values'};
        }
        if(this.scale <= 0){
            return {error: 'Logistic distribution: parameter "s" (scale) must be a positive number'};
        }
        return { error: false };
    }

    /**
     * Refresh method
     * @param newMu: number - new parameter "mu"
     * @param newS: number - new parameter "sigma"
     * This method does not return values
     */
    refresh(newMu: number, newS: number): void {
        this.location = Number(newMu);
        this.scale = Number(newS);
    }

    /**
     * Class .toString method
     * @returns {string}
     */
    toString(): string {
        let info = [
            'Logistic Distribution',
            `Usage: unirand.logistic(${this.location}, ${this.scale}).random()`
        ];
        return info.join('\n');
    }

    /**
     * Mean value
     * Information only
     * For calculating real mean value use analyzer
     */
    get mean(): number {
        return this.location;
    }

    /**
     * Median value
     * Information only
     * For calculating real median value use analyzer
     */
    get median(): number {
        return this.location;
    }

    /**
     * Mode value - value, which appears most often
     * Information only
     * For calculating real mode value use analyzer
     */
    get mode(): number {
        return this.location;
    }

    /**
     * Variance value
     * Information only
     * For calculating real variance value use analyzer
     */
    get variance(): number {
        return Math.pow(this.scale * Math.PI, 2) / 3;
    }

    /**
     * Kurtosis value
     * Information only
     * For calculating real kurtosis value use analyzer
     */
    get kurtosis(): number {
        return 1.2;
    }

    /**
     * Skewness value
     * Information only
     * For calculating real skewness value use analyzer
     */
    get skewness(): number {
        return 0;
    }

    /**
     * Entropy value
     * Information only
     * This formula esus Euler's number (base of natural logarithm)
     * For calculating real entropy value use analyzer
     */
    get entropy(): number {
        return Math.log(this.scale) + 2;
    }

    /**
     * All parameters of distribution in one object
     * Information only
     */
    get parameters(): {} {
        return {
            mean: this.mean,
            median: this.median,
            mode: this.mode,
            variance: this.variance,
            skewness: this.skewness,
            entropy: this.entropy
        };
    }
}

module.exports = Logistic;
