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
import prng from '../prng/prngProxy';

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
        let res: number = 1,
            random: number = (prng.random(): any);
        while(random >= this.successProb){
            res += 1;
            random = prng.next();
        }
        return res;
    }

    /**
     * Generates Geometric distributed numbers
     * @param n: number - Number of elements in resulting array, n > 0
     * @returns Array<number> - Geometric distributed numbers
     */
    distribution(n: number): RandomArray {
        let geometricArray: RandomArray = [],
            random: number = (prng.random(): any),
            res: number;
        for(let i = 0; i < n; i += 1){
            res = 1;
            random = prng.next();
            while(random >= this.successProb){
                res += 1;
                random = prng.next();
            }
            geometricArray[i] = res;
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
            `Usage: unirand.geometric(${this.successProb}).random()`
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
     * Kurtosis value
     * Information only
     * For calculating real kurtosis value use analyzer
     */
    get kurtosis(): number {
        return 6 + Math.pow(this.successProb, 2) / (1 - this.successProb);
    }

    /**
     * Entropy value
     * Information only
     * For calculating real entropy value use analyzer
     */
    get entropy(): number {
        return (- (1 - this.successProb) * Math.log(1 - this.successProb) - this.successProb * Math.log(this.successProb)) / this.successProb;
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
            entropy: this.entropy,
            kurtosis: this.kurtosis
        };
    }
}

module.exports = Geometric;
