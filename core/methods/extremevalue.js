// @flow

/**
 * Extreme (Gumbel-type) Value distribution
 * This is continuous distribution
 * https://en.wikipedia.org/wiki/Generalized_extreme_value_distribution
 * @param mu <number> - location, any value
 * @param sigma <number> - scale, sigma > 0
 * @returns Extreme Value distributed numbers
 * Created by Alexey S. Kiselev on 27.11.2017.
 */

import type {MethodError, RandomArray} from '../types';

class ExtremeValue {
    mu: number;
    sigma: number;

    constructor(mu: number,sigma: number): void {
        this.mu = Number(mu);
        this.sigma = Number(sigma);
    }

    /**
     * Generates a random number
     * @returns a extreme value distributed number
     */
    random(): number {
        return this.mu - this.sigma * Math.log(-Math.log(Math.random()));
    }

    /**
     * Generates extreme value distributed numbers
     * @param n: number - Number of elements in resulting array, n > 0
     * @returns Array<number> - extreme value distributed numbers
     */
    distribution(n: number): RandomArray {
        let extremeValueArray: RandomArray = [];
        for(let i: number = 0; i < n; i += 1){
            extremeValueArray[i] = this.random();
        }
        return extremeValueArray;
    }

    /**
     * Error handling
     * @returns {boolean}
     */
    isError(): MethodError {
        if((!this.mu && this.mu !== 0) || !this.sigma) {
            return {error: 'Extreme Value (Gumbel type) distribution: you should point parameters "mu" and "sigma" with numerical values'};
        }
        if(this.sigma <= 0){
            return {error: 'Extreme Value (Gumbel type) distribution: parameter "sigma" must be a positive number'};
        }
        return { error: false };
    }

    /**
     * Refresh method
     * @param newMu: number - new parameter "mu"
     * @param newSigma: number - new parameter "sigma"
     * This method does not return values
     */
    refresh(newMu: number, newSigma: number): void {
        this.mu = Number(newMu);
        this.sigma = Number(newSigma);
    }

    /**
     * Class .toString method
     * @returns {string}
     */
    toString(): string {
        let info = [
            'Extreme Value (Gumbel type) Distribution',
            `Usage: randomjs.extremevalue(${this.mu}, ${this.sigma}).random()`
        ];
        return info.join('\n');
    }

    /**
     * Mean value
     * Information only
     * Calculate this value using Euler constant
     * For calculating real mean value use analyzer
     */
    get mean(): number {
        return this.mu + this.sigma * 0.57721566490153286;
    }

    /**
     * Median value
     * Information only
     * For calculating real median value use analyzer
     */
    get median(): number {
        return this.mu - this.sigma * Math.log(Math.log(2));
    }

    /**
     * Mode value - value, which appears most often
     * Information only
     * For calculating real mode value use analyzer
     */
    get mode(): number {
        return this.mu;
    }

    /**
     * Variance value
     * Information only
     * For calculating real variance value use analyzer
     */
    get variance(): number {
        return Math.pow(this.sigma * Math.PI, 2) / 6;
    }

    /**
     * Entropy value
     * Information only
     * For calculating real entropy value use analyzer
     */
    get entropy(): number {
        return Math.log(this.sigma) + 1.57721566490153286;
    }

    /**
     * Skewness value
     * Information only
     * For calculating real value of skewness use analyzer
     */
    get skewness(): number {
        let riemann: number = 1.202056903159594;
        return 12 * Math.sqrt(6) * riemann / Math.pow(Math.PI, 3);
    }

    /**
     * Kurtosis value
     * Information only
     * For calculating real value of kurtosis use analyzer
     */
    get kurtosis(): number {
        return 12 / 5;
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

module.exports = ExtremeValue;
