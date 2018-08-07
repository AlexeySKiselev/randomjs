// @flow

/**
 * Exponential distribution
 * This is continuous distribution
 * https://en.wikipedia.org/wiki/Exponential_distribution
 * @param lambda <number> - rate parameter, lambda > 0
 * @returns Exponentially distribution numbers
 * Created by Alexey S. Kiselev
 */

import type {MethodError, RandomArray} from '../types';

class Exponential {
    lambda: number;

    constructor(lambda: number): void {
        this.lambda = Number(lambda);
    }

    /**
     * Generates a random number
     * @returns a exponential distributed number
     */
    random(): number {
        return (-Math.log(Math.random()) / this.lambda);
    }

    /**
     * Generates exponential distributed numbers
     * @param n: number - Number of elements in resulting array, n > 0
     * @returns Array<number> - exponential distributed numbers
     */
    distribution(n: number): RandomArray {
        let exponentialArray: RandomArray = [];
        for(let i: number = 0; i < n; i += 1){
            exponentialArray[i] = this.random();
        }
        return exponentialArray;
    }

    /**
     * Error handling
     * @returns {boolean}
     */
    isError(): MethodError {
        if(!this.lambda) {
            return {error: 'Exponential distribution: you should point parameter "lambda" with numerical value'};
        }
        if(this.lambda <= 0){
            return {error: 'Exponential distribution: parameter "lambda" must be a positive number'};
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
            'Exponential Distribution',
            `Usage: unirand.exponential(${this.lambda}).random()`
        ];
        return info.join('\n');
    }

    /**
     * Mean value
     * Information only
     * For calculating real mean value use analyzer
     */
    get mean(): number {
        return 1 / this.lambda;
    }

    /**
     * Median value
     * Information only
     * For calculating real median value use analyzer
     */
    get median(): number {
        return Math.log(2) / this.lambda;
    }

    /**
     * Mode value - value, which appears most often
     * Information only
     * For calculating real mode value use analyzer
     */
    get mode(): number {
        return 0;
    }

    /**
     * Variance value
     * Information only
     * For calculating real variance value use analyzer
     */
    get variance(): number {
        return 1 / Math.pow(this.lambda, 2);
    }

    /**
     * Skewness value
     * Information only
     * For calculating real skewness value use analyzer
     */
    get skewness(): number {
        return 2;
    }

    /**
     * Kurtosis value
     * Information only
     * For calculating real kurtosis value use analyzer
     */
    get kurtosis(): number {
        return 6;
    }

    /**
     * Entropy value
     * Information only
     * For calculating real entropy value use analyzer
     */
    get entropy(): number {
        return 1 - Math.log(this.lambda);
    }

    /**
     * Fisher information matrix
     * Information only
     */
    get fisher(): number {
        return this.variance;
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
            fisher: this.fisher
        };
    }
}

module.exports = Exponential;
