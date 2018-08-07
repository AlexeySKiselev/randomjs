// @flow

/**
 * Lognormal distribution
 * This is continuous distribution
 * https://en.wikipedia.org/wiki/Log-normal_distribution
 * @param mu <number> - location, any number
 * @param sigma <number>, sigma > 0
 * @returns Lognormal distributed number
 * Created by Alexey S. Kiselev
 */

import type { MethodError, RandomArray } from '../types';
// Import Normal Distribution class
let Normal = require('./normal');

class Lognormal {
    mu: number;
    sigma: number;
    normal: Normal;

    constructor(mu: number, sigma: number): void {
        this.mu = Number(mu);
        this.sigma = Number(sigma);
        this.normal = new Normal(0, 1);
    }

    /**
     * Generates a random number
     * @returns a Lognormal distributed number
     */
    random(): number {
        return Math.exp(this.mu + this.sigma * this.normal.random());
    }

    /**
     * Generates lognormal distributed numbers
     * @param n: number - Number of elements in resulting array, n > 0
     * @returns Array<number> - lognormal distributed numbers
     */
    distribution(n: number): RandomArray {
        let lognormalArray: RandomArray = [];
        for(let i: number = 0; i < n; i += 1){
            lognormalArray[i] = this.random();
        }
        return lognormalArray;
    }

    /**
     * Error handling
     * @returns {boolean}
     */
    isError(): MethodError {
        if((!this.mu && this.mu !== 0) || !this.sigma) {
            return {error: 'Lognormal distribution: you should point parameters "mu" and "sigma" with numerical values'};
        }
        if(this.sigma <= 0){
            return {error: 'Lognormal distribution: parameter "sigma" must be a positive number'};
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
            'Lognormal Distribution',
            `Usage: unirand.lognormal(${this.mu}, ${this.sigma}).random()`
        ];
        return info.join('\n');
    }

    /**
     * Mean value
     * Information only
     * For calculating real mean value use analyzer
     */
    get mean(): number {
        return Math.exp(this.mu + 0.5 * Math.pow(this.sigma, 2));
    }

    /**
     * Median value
     * Information only
     * For calculating real median value use analyzer
     */
    get median(): number {
        return Math.exp(this.mu);
    }

    /**
     * Mode value - value, which appears most often
     * Information only
     * For calculating real mode value use analyzer
     */
    get mode(): number {
        return Math.exp(this.mu - Math.pow(this.sigma, 2));
    }

    /**
     * Variance value
     * Information only
     * For calculating real variance value use analyzer
     */
    get variance(): number {
        return (Math.exp(Math.pow(this.sigma, 2)) - 1) * Math.pow(this.mean, 2);
    }

    /**
     * Skewness value
     * Information only
     * For calculating real skewness value use analyzer
     */
    get skewness(): number {
        let temp: number = Math.exp(Math.pow(this.sigma, 2)) - 1;
        return (temp + 3) * Math.sqrt(temp);
    }

    /**
     * Kurtosis value
     * Information only
     * For calculating real kurtosis value use analyzer
     */
    get kurtosis(): number {
        let sigma2: number = Math.pow(this.sigma, 2);
        return Math.exp(4 * sigma2) + 2 * Math.exp(3 * sigma2) + 3 * Math.exp(2 * sigma2) - 6;
    }

    /**
     * Entropy value
     * Information only
     * For calculating real entropy value use analyzer
     */
    get entropy(): number {
        return Math.log(this.sigma * Math.exp(this.mu + 0.5) * Math.sqrt(2 * Math.PI));
    }

    /**
     * Fisher information matrix
     * Information only
     */
    get fisher(): Array<Array<number>> {
        return [[(1 / Math.pow(this.sigma, 2)), 0], [0, (0.5 / Math.pow(this.sigma, 4))]];
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
            kurtosis: this.kurtosis,
            entropy: this.entropy,
            fisher: this.fisher
        };
    }
}

module.exports = Lognormal;
