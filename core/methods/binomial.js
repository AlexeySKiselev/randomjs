// @flow

/**
 * Binomial Distribution
 * This is discreet distribution
 * https://en.wikipedia.org/wiki/Binomial_distribution
 * @param n: number - Number of Independent Bernoulli trials
 * @param p: number (0 <= p <= 1) - Probability of success
 * @returns Binomial Distributed number
 * Created by Alexey S. Kiselev
 */

import type {MethodError, RandomArray} from '../types';

class Binomial {
    trials: number;
    successProb: number;

    constructor(n: number, p: number) {
        this.trials = Number(n);
        this.successProb = Number(p);
    }

    /**
     * Generates a random number
     * @returns a Binomial distributed number
     */
    random(): number {
        let res: number = 0;
        for(let i: number = 0; i < this.trials; i += 1){
            if(Math.random() < this.successProb) {
                res += 1;
            }
        }
        return res;
    }

    /**
     * Generates Binomial distributed numbers
     * @param n: number - Number of elements in resulting array, n > 0
     * @returns Array<number> - Binomial distributed numbers
     */
    distribution(n: number): RandomArray {
        let binomialArray: RandomArray = [];
        for(let i:number = 0; i < n; i += 1){
            binomialArray[i] = this.random();
        }
        return binomialArray;
    }

    /**
     * Error handling
     * Parameter "n" must be positive integer
     * Parameter "p" must be 0 <= p <= 1
     * @returns {boolean}
     */
    isError(): MethodError {
        if(!this.trials|| (!this.successProb && this.successProb !== 0)) {
            return {error: 'Binomial distribution: you should point parameter "n" like a positive integer and parameter "p" like a numerical value'};
        }
        if(this.trials <= 0){
            return {error: 'Binomial distribution: parameter "n" must be positive integer'};
        }
        if(this.successProb < 0 || this.successProb > 1) {
            return {error: 'Binomial distribution: parameter "p" (probability of success) must be 0 <= p <= 1'};
        }
        return { error: false };
    }

    /**
     * Refresh method
     * @param newN: number - new parameter "n"
     * @param newP: number - new parameter "p"
     * This method does not return values
     */
    refresh(newN: number, newP: number): void {
        this.trials = Number(newN);
        this.successProb = Number(newP);
    }

    /**
     * Class .toString method
     * @returns {string}
     */
    toString(): string {
        let info = [
            'Binomial Distribution',
            `Usage: unirand.binomial(${this.trials}, ${this.successProb}).random()`
        ];
        return info.join('\n');
    }

    /**
     * Mean value
     * Information only
     * For calculating real mean value use analyzer
     */
    get mean(): number {
        return this.trials * this.successProb;
    }

    /**
     * Median value
     * Information only
     * For calculating real median value use analyzer
     */
    get median(): number {
        return (Math.floor(this.trials * this.successProb) + Math.floor(this.trials * this.successProb)) / 2;
    }

    /**
     * There are no exact Mode and Median parameters
     */

    /**
     * Variance value
     * Information only
     * For calculating real variance value use analyzer
     */
    get variance(): number {
        return this.trials * this.successProb * (1 - this.successProb);
    }

    /**
     * Skewness value
     * Information only
     * For calculating real skewness value use analyzer
     */
    get skewness(): number {
        return (1 - 2* this.successProb) / Math.sqrt(this.variance);
    }

    /**
     * Entropy value
     * Information only
     */
    get entropy(): number {
        return 0.5 * 0.693 * Math.log2(2* Math.PI * Math.E * this.trials * this.successProb * (1 - this.successProb));
    }

    /**
     * Kurtosis value
     * Information only
     */
    get kurtosis(): number {
        return (1 - 6 * this.successProb * (1 - this.successProb)) / (this.trials * this.successProb * (1 - this.successProb));
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

module.exports = Binomial;
