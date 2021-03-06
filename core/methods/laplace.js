// @flow

/**
 * Laplace distribution
 * This is continuous distribution
 * https://en.wikipedia.org/wiki/Laplace_distribution
 * @param mu <number> - location, any value
 * @param b <number> - scale, b > 0
 * @returns Laplace distributed number
 * Created by Alexey S. Kiselev
 */

import type { MethodError, RandomArray } from '../types';
import type { IDistribution } from '../interfaces';
import prng from '../prng/prngProxy';

class Laplace implements IDistribution {
    location: number;
    scale: number;

    constructor(mu: number, b: number): void {
        this.location = Number(mu);
        this.scale = Number(b);
    }

    /**
     * Generates a random number
     * @returns a Laplace distributed number
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
        if(u <= 0.5){
            return this.location + this.scale * Math.log(2 * u);
        }
        return this.location - this.scale * Math.log(2 * (1 - u));
    }

    /**
     * Generates Laplace distributed numbers
     * @param n: number - Number of elements in resulting array, n > 0
     * @returns Array<number> - Laplace distributed numbers
     */
    distribution(n: number): RandomArray {
        let laplaceArray: RandomArray = [],
            random: RandomArray = (prng.random(n): any);
        for(let i: number = 0; i < n; i += 1){
            laplaceArray[i] = this._random(random[i]);
        }
        return laplaceArray;
    }

    /**
     * Error handling
     * @returns {boolean}
     */
    isError(): MethodError {
        if((!this.location && this.location !== 0) || !this.scale) {
            return {error: 'Laplace distribution: you should point parameters "mu" and "b" (scale) with numerical values'};
        }
        if(this.scale <= 0){
            return {error: 'Laplace distribution: parameter "b" (scale) must be a positive number'};
        }
        return { error: false };
    }

    /**
     * Refresh method
     * @param newMu: number - new parameter "mu"
     * @param newB: number - new parameter "b"
     * This method does not return values
     */
    refresh(newMu: number, newB: number): void {
        this.location = Number(newMu);
        this.scale = Number(newB);
    }

    /**
     * Class .toString method
     * @returns {string}
     */
    toString(): string {
        let info = [
            'Laplace Distribution',
            `Usage: unirand.laplace(${this.location}, ${this.scale}).random()`
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
        return 2 * Math.pow(this.scale, 2);
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
     * Kurtosis value
     * Information only
     * For calculating real kurtosis value use analyzer
     */
    get kurtosis(): number {
        return 3;
    }

    /**
     * Entropy value
     * Information only
     * This formula uses Euler's number (base of natural logarithm)
     * For calculating real entropy value use analyzer
     */
    get entropy(): number {
        return Math.log(2 * this.scale * 2.71828182845904523536);
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
            entropy: this.entropy,
            kurtosis: this.kurtosis
        };
    }
}

module.exports = Laplace;
