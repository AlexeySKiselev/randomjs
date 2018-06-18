// @flow

/**
 * Weibull distribution
 * This is continuous distribution
 * https://en.wikipedia.org/wiki/Weibull_distribution
 * @param k <number> - shape parameter , k > 0
 * @param lambda <number> - scale parameter, lambda > 0
 * @returns Weibull distributed value
 * Created by Alexey S. Kiselev
 */

import type {MethodError, RandomArray} from '../types';
let Utils = require('../utils/utils');

class Weibull {
    k: number;
    lambda: number;
    gamma: Function;

    constructor(k: number, lambda: number): void {
        this.k = Number(k);
        this.lambda = Number(lambda);
        this.gamma = Utils.gamma;
    }

    /**
     * Generates a random number
     * @returns a Triangular distributed number
     */
    random(): number {
        return this.lambda * Math.pow(-Math.log(1 - Math.random()), 1 / this.k);
    }

    /**
     * Generates Weibull distributed numbers
     * @param n: number - Number of elements in resulting array, n > 0
     * @returns Array<number> - Weibull distributed numbers
     */
    distribution(n: number): RandomArray {
        let weibullArray: RandomArray = [];
        for(let i: number = 0; i < n; i += 1){
            weibullArray[i] = this.random();
        }
        return weibullArray;
    }

    /**
     * Error handling
     * @returns {boolean}
     */
    isError(): MethodError {
        if(!this.k || !this.lambda) {
            return {error: 'Weibull distribution: you should point "k", "lambda" numerical values'};
        }
        if(this.k <= 0) {
            return {error: 'Weibull distribution: parameters "k" must greater then zero'};
        }

        if(this.lambda <= 0) {
            return {error: 'Weibull distribution: parameters "lambda" must be greater then zero'};
        }
        return { error: false };
    }

    /**
     * Refresh method
     * @param newK: number - new parameter "k"
     * @param newLambda: number - new parameter "lambda"
     * This method does not return values
     */
    refresh(newK: number, newLambda: number): void {
        this.k = Number(newK);
        this.lambda = Number(newLambda);
    }

    /**
     * Class .toString method
     * @returns {string}
     */
    toString(): string {
        let info = [
            'Weibull Distribution',
            `Usage: randomjs.weibull(${this.k}, ${this.lambda}).random()`
        ];
        return info.join('\n');
    }

    /**
     * Mean value
     * Information only
     * For calculating real mean value use analyzer
     */
    get mean(): number {
        return this.lambda * this.gamma(1 + 1 / this.k);
    }

    /**
     * Median value
     * Information only
     * For calculating real median value use analyzer
     */
    get median(): number {
        return this.lambda * Math.pow(Math.log(2), 1 / this.k);
    }

    /**
     * Mode value - value, which appears most often
     * Information only
     * For calculating real mode value use analyzer
     */
    get mode(): number {
        if(this.k > 1) {
            return this.lambda * Math.pow((this.k - 1) / this.k, 1 / this.k);
        } else {
            return 0;
        }
    }

    /**
     * Variance value
     * Information only
     * For calculating real variance value use analyzer
     */
    get variance(): number {
        return Math.pow(this.lambda, 2) * (this.gamma(1 + 2 / this.k) - Math.pow(this.gamma(1 + 1 / this.k), 2));
    }

    /**
     * Entropy value
     * Information only
     * For calculating real entropy value use analyzer
     */
    get entropy(): number {
        return 0.5772156649015328606065121 * (1 - 1 / this.k) + Math.log(this.lambda / this.k) + 1;
    }

    /**
     * Skewness value
     * Information only
     */
    get skewness(): number {
        return (this.gamma(1 + 3 / this.k) * Math.pow(this.lambda, 3) - 3 * this.mean * this.variance - Math.pow(this.mean, 3)) / Math.pow(this.variance, 1.5);
    }

    /**
     * Kurtosis value
     * Information only
     */
    get kurtosis(): number {
        return -3 + (Math.pow(this.lambda, 4) * this.gamma(1 + 4 / this.k) - 4 * this.skewness * Math.pow(this.variance, 1.5) * this.mean - 6 * Math.pow(this.mean, 2) * this.variance - Math.pow(this.mean, 4)) / Math.pow(this.variance, 2);
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
            entropy: this.entropy,
            skewness: this.skewness,
            kurtosis: this.kurtosis
        };
    }
}

module.exports = Weibull;
