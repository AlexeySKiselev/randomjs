// @flow
/**
 * Chi Square Distribution
 * This is continuous distribution
 * https://en.wikipedia.org/wiki/Chi-squared_distribution
 * @param k: number - degrees of freedom k > 0
 * @returns Chi Square Distributed value
 * Created by Alexey S. Kiselev
 */

let Normal = require('./normal'),
    Utils = require('../utils/utils');

class ChiSquare {
    constructor(k: number): void {
        this.degrees = Number(k);
        this.normal = new Normal(0, 1);
    }

    /**
     * Generates a random number
     * @returns a Chi Square distributed number
     */
    random(): number {
        let res: number = 0;
        for(let i: number = 0; i < this.degrees; i += 1){
            res += Math.pow(this.normal.random(), 2);
        }
        return res;
    }

    /**
     * Generates Chi Square distributed numbers
     * @param n: number - Number of elements in resulting array, n > 0
     * @returns Array<number> - Chi Square distributed numbers
     */
    distribution(n: number) {
        let chiSquareArray: Array<number> = [];
        for(let i:number = 0; i < n; i += 1){
            chiSquareArray[i] = this.random();
        }
        return chiSquareArray;
    }

    /**
     * Error handling
     * Parameter "k" must be positive
     * @returns {boolean}
     */
    isError(): boolean | {error: string} {
        if(!this.degrees){
            return {error: 'Chi Square distribution: you should point parameter "k" positive numerical value'};
        }
        if(this.degrees <= 0){
            return {error: 'Chi Square distribution: parameter "k" must be positive integer'};
        }
        return false;
    }

    /**
     * Refresh method
     * @param newK: number - new parameter "k"
     * This method does not return values
     */
    refresh(newK: number): void {
        this.degrees = Number(newK);
    }

    /**
     * Class .toString method
     * @returns {string}
     */
    toString(): string {
        let info = [
            'Chi Square Distribution',
            `Usage: randomjs.chisquare(${this.degrees}).random()`
        ];
        return info.join('\n');
    }

    /**
     * Mean value
     * Information only
     * For calculating real mean value use analyzer
     */
    get mean(): number {
        return this.degrees;
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
        return Math.max(this.degrees - 2, 0);
    }

    /**
     * Variance value
     * Information only
     * For calculating real variance value use analyzer
     */
    get variance(): number {
        return 2 * this.degrees;
    }

    /**
     * Skewness value
     * Information only
     * For calculating real skewness value use analyzer
     */
    get skewness(): number {
        return Math.sqrt(2 / this.degrees);
    }

    /**
     * Entropy value
     * Information only
     * For calculating real entropy value use analyzer
     */
    get entropy(): number {
        return 0.5 * this.degrees + Math.log(2 * Utils.gamma(this.degrees / 2)) + (1 - 0.5 * this.degrees) * Utils.digamma(this.degrees / 2);
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

module.exports = ChiSquare;
