// @flow

/**
 * Geometric Distribution
 * This is discreet distribution
 * https://en.wikipedia.org/wiki/Geometric_distribution
 * @param p: number (0 <= p <= 1) - Probability of success
 * @returns Geometric Distributed Value
 * Created by Alexey S. Kiselev
 */

import type {MethodError, RandomArray} from '../types';

class Geometric {
    successProb: number;

    constructor(p: number): void {
        this.successProb = Number(p);
    }

    /**
     * Generates a random number
     * @returns a Geometric distributed number
     */
    random(): number {
        let res: number = 1;
        while(Math.random() >= this.successProb){
            res += 1;
        }
        return res;
    }

    /**
     * Generates Geometric distributed numbers
     * @param n: number - Number of elements in resulting array, n > 0
     * @returns Array<number> - Geometric distributed numbers
     */
    distribution(n: number): RandomArray {
        let geometricArray: RandomArray = [];
        for(let i:number = 0; i < n; i += 1){
            geometricArray[i] = this.random();
        }
        return geometricArray;
    }

    /**
     * Error handling
     * Parameter "p" must be 0 <= p <= 1
     * @returns {boolean}
     */
    isError(): MethodError {
        if(!this.successProb && this.successProb !== 0){
            return {error: 'Geometric distribution: you should specify parameter "p" with numerical value'};
        }
        if(this.successProb < 0 || this.successProb > 1) {
            return {error: 'Geometric distribution: parameter "p" (probability of success) must be 0 <= p <= 1'};
        }
        return { error: false };
    }

    /**
     * Refresh method
     * @param newP: number - new parameter "p"
     * This method does not return values
     */
    refresh(newP: number): void {
        this.successProb = Number(newP);
    }

    /**
     * Class .toString method
     * @returns {string}
     */
    toString(): string {
        let info = [
            'Geometric Distribution',
            `Usage: randomjs.geometric(${this.successProb}).random()`
        ];
        return info.join('\n');
    }

    /**
     * Mean value
     * Information only
     * For calculating real mean value use analyzer
     */
    get mean(): number {
        return 1 / this.successProb;
    }

    /**
     * Geometric distribution doesn't have unique Median value
     */

    /**
     * Mode value - value, which appears most often
     * Information only
     * For calculating real mode value use analyzer
     */
    get mode(): number {
        return 1;
    }

    /**
     * Variance value
     * Information only
     * For calculating real variance value use analyzer
     */
    get variance(): number {
        return (1 - this.successProb) / Math.pow(this.successProb, 2);
    }

    /**
     * Skewness value
     * Information only
     * For calculating real skewness value use analyzer
     */
    get skewness(): number {
        return (2 - this.successProb) / Math.sqrt(1 - this.successProb);
    }

    /**
     * Entropy value
     * Information only
     * For calculating real entropy value use analyzer
     */
    get entropy(): number {
        return (-(1 - this.successProb) * Math.log2(1 - this.successProb) - this.successProb * Math.log2(this.successProb)) / this.successProb;
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

module.exports = Geometric;
