// @flow

/**
 * Poisson Distribution (Knuth algorithm)
 * This is discreet distribution
 * https://en.wikipedia.org/wiki/Poisson_distribution
 * @param lambda: number (lambda > 0)
 * @returns Poisson Distributed integer number
 * Created by Alexey S. Kiselev
 */

import type { MethodError, RandomArray } from '../types';
import type { IDistribution } from '../interfaces';
import prng from '../prng/prngProxy';

class Poisson implements IDistribution {
    lambda: number;

    constructor(lambda: number): void {
        this.lambda = Number(lambda);
    }

    /**
     * Generates a random number
     * @returns a Poisson distributed number
     */
    random(): number {
        prng.random();
        return this._random();
    }

    /**
     * Generates next seeded random number
     * @returns {number}
     */
    next(): number {
        return this._random();
    }

    _random(): number {
        let res: number = 0,
            p: number = 1,
            L: number = Math.exp(-this.lambda);
        do {
            p *= prng.next();
            res += 1;
        } while(p >= L);
        return res - 1;
    }

    /**
     * Generates Poisson distributed numbers
     * @param n: number - Number of elements in resulting array, n > 0
     * @returns Array<number> - Poisson distributed numbers
     */
    distribution(n: number): RandomArray {
        let poissonArray: RandomArray = [];
        prng.random();
        for(let i: number = 0; i < n; i += 1){
            poissonArray[i] = this._random();
        }
        return poissonArray;
    }

    /**
     * Error handling
     * Parameter "lambda" must be positive integer
     * @returns {boolean}
     */
    isError(): MethodError {
        if(!this.lambda) {
            return {error: 'Poisson distribution: you should point parameter "lambda" with numerical value'};
        }
        if(this.lambda <= 0){
            return {error: 'Poisson distribution: parameter "lambda" must be positive integer'};
        }
        return { error: false };
    }

    /**
     * Refresh method
     * @param newLambda: number - new parameter "lambda"
     * This method does not return values
     */
    refresh(newLambda: number): void {
        this.lambda = Number(newLambda);
    }

    /**
     * Class .toString method
     * @returns {string}
     */
    toString(): string {
        let info = [
            'Poisson Distribution',
            `Usage: unirand.poisson(${this.lambda}).random()`
        ];
        return info.join('\n');
    }

    /**
     * Mean value
     * Information only
     * For calculating real mean value use analyzer
     */
    get mean(): number {
        return this.lambda;
    }

    /**
     * Median (approximate value)
     * Information only
     * For calculating real median value use analyzer
     */
    get median(): number {
        return Math.floor(this.lambda + 0.33333333 - 0.02 * this.lambda);
    }

    /**
     * There are no exact Mode value
     */

    /**
     * Variance value
     * Information only
     * For calculating real variance value use analyzer
     */
    get variance(): number {
        return this.lambda;
    }

    /**
     * Skewness value
     * Information only
     * For calculating real skewness value use analyzer
     */
    get skewness(): number {
        return 1 / Math.sqrt(this.lambda);
    }

    /**
     * Kurtosis value
     * Information only
     * For calculating real kurtosis value use analyzer
     */
    get kurtosis(): number {
        return 1 / this.lambda;
    }

    /**
     * Fisher information
     * Information only
     * For calculating real fisher information value use analyzer
     */
    get fisher(): number {
        return 1 / this.lambda;
    }

    /**
     * Entropy value (result agrees with C. Knessl, “Integral representations and asymptotic
     * expansions for Shannon and Renyi entropies,”)
     * Information only
     * For calculating real value use analyzer
     */
    get entropy(): number {
        return 0.5 * Math.log(2 * Math.PI * this.lambda) + 0.5 - 1 / (12 * this.lambda) - 1 / (24 * Math.pow(this.lambda, 2));
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
            fisher: this.fisher,
            kurtosis: this.kurtosis,
            entropy: this.entropy
        };
    }
}

module.exports = Poisson;
