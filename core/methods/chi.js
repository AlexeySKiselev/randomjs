// @flow
/**
 * Chi Distribution
 * This is continuous distribution
 * https://en.wikipedia.org/wiki/Chi_distribution
 * @param k: number - degrees of freedom k > 0
 * @returns Chi Distributed value
 * Created by Alexey S. Kiselev
 */

let ChiSquare = require('./chisquare'),
    Utils = require('../utils/utils');

class Chi {
    constructor(k: number): void {
        this.degrees = k;
        this.chiSquare = new ChiSquare(this.degrees);
    }

    /**
     * Generates a random number
     * @returns a Chi distributed number
     */
    random(): number {
        return Math.sqrt(this.chiSquare.random() / this.degrees);
    }

    /**
     * Generates Chi distributed numbers
     * @param n: number - Number of elements in resulting array, n > 0
     * @returns Array<number> - Chi distributed numbers
     */
    distribution(n: number) {
        let chiArray: Array<number> = [];
        for(let i:number = 0; i < n; i += 1){
            chiArray[i] = this.random();
        }
        return chiArray;
    }

    /**
     * Error handling
     * Parameter "k" must be positive
     * @returns {boolean}
     */
    isError(): boolean | {error: string} {
        if(this.degrees <= 0){
            return {error: 'Chi distribution: parameter "k" must be positive integer'};
        }
        return false;
    }

    /**
     * Refresh method
     * @param newK: number - new parameter "k"
     * This method does not return values
     */
    refresh(newK: number): void {
        this.degrees = newK;
    }

    /**
     * Class .toString method
     * @returns {string}
     */
    toString(): string {
        let info = [
            'Chi Distribution',
            `Usage: randomjs.chi(${this.degrees}).random()`
        ];
        return info.join('\n');
    }

    /**
     * Mean value
     * Information only
     * For calculating real mean value use analyzer
     */
    get mean(): number {
        return Math.sqrt(2) * Utils.gamma((this.degrees + 1) / 2) / Utils.gamma(this.degrees / 2);
    }

    /**
     * This distribution haven't exact Median value
     */

    /**
     * Mode value
     * Information only
     * For calculating real mode value use analyzer
     */
    get mode(): number {
        if(this.degrees >= 1){
            return Math.sqrt(this.degrees - 1);
        }
    }

    /**
     * Variance value
     * Information only
     * For calculating real variance value use analyzer
     */
    get variance(): number {
        return Math.pow(this.degrees, 2) - Math.pow(this.mean, 2);
    }

    /**
     * Skewness value
     * Information only
     * For calculating real skewness value use analyzer
     */
    get skewness(): number {
        return this.mean * (1 - 2 * this.variance) / (this.variance * Math.sqrt(this.variance));
    }

    /**
     * Entropy value
     * Information only
     * For calculating real entropy value use analyzer
     */
    get entropy(): number {
        return Math.log(Utils.gamma(this.degrees / 2)) + 0.5 * (this.degrees - Math.log(2) - (this.degrees - 1) * Utils.digamma(this.degrees / 2));
    }

    /**
     * All parameters of distribution in one object
     * Information only
     */
    get parameters(): {} {
        return {
            mean: this.mean,
            mode: this.mode,
            variance: this.variance,
            skewness: this.skewness,
            entropy: this.entropy
        };
    }
}

module.exports = Chi;
