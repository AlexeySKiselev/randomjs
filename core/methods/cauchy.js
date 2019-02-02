// @flow

/**
 * Cauchy Distribution (also called Lorenz distribution)
 * This is continuous distribution
 * https://en.wikipedia.org/wiki/Cauchy_distribution
 * @param x: number - location any number
 * @param gamma: number - scale positive number
 * @returns a Cauchy Distributed number
 * Created by Alexey S. Kiselev
 */

import type { MethodError, RandomArray } from '../types';
import prng from '../prng/prngProxy';
const TAN_LIMIT = 12;

class Cauchy {
    location: number;
    scale: number;

    constructor(x: number, gamma: number): void {
        this.location = Number(x);
        this.scale = Number(gamma);
    }

    /**
     * Generates a random number
     * So, Math.tan can be huge, and it make analysis very hard (because value can be Infinity)
     * I am going to limit values by 12gamma
     * I implement recursive approach
     * @returns a normal distributed number
     */
    random(): number {
        let randomTan: number = Math.tan(Math.PI * ((prng.random(): any) - 0.5));
        while (Math.abs(randomTan) > TAN_LIMIT) {
            randomTan = Math.tan(Math.PI * (prng.next() - 0.5));
        }
        return this.location + this.scale * randomTan;
    }

    /**
     * Generates next seeded random number
     * @returns {number}
     */
    next(): number {
        let randomTan: number = Math.tan(Math.PI * ((prng.next(): any) - 0.5));
        while (Math.abs(randomTan) > TAN_LIMIT) {
            randomTan = Math.tan(Math.PI * (prng.next() - 0.5));
        }
        return this.location + this.scale * randomTan;
    }

    /**
     * Generates Cauchy distributed numbers
     * @param n: number - Number of elements in resulting array, n > 0
     * @returns Array<number> - Cauchy distributed numbers
     */
    distribution(n: number): RandomArray {
        let cauchyArray: RandomArray = [],
            random: RandomArray = (prng.random(n): any),
            randomTan: number;
        for(let i: number = 0; i < n; i += 1){
            randomTan = Math.tan(Math.PI * (random[i] - 0.5));
            while (Math.abs(randomTan) > TAN_LIMIT) {
                randomTan = Math.tan(Math.PI * (prng.next() - 0.5));
            }
            cauchyArray[i] = this.location + this.scale * randomTan;
        }
        return cauchyArray;
    }

    /**
     * Error handling
     * Parameter "gamma" must be positive
     * @returns {boolean}
     */
    isError(): MethodError {
        if(!this.location || (!this.scale && this.scale !== 0)){
            return {error: 'Cauchy distribution: you should point "x" and "gamma" numerical values'};
        }
        if(this.scale <= 0) {
            return {error: 'Cauchy distribution: parameter "gamma" must be positive'};
        }
        return { error: false };
    }

    /**
     * Refresh method
     * @param newX: number - new parameter "x"
     * @param newGamma: number - new parameter "gamma"
     * This method does not return values
     */
    refresh(newX: number, newGamma: number): void {
        this.location = Number(newX);
        this.scale = Number(newGamma);
    }

    /**
     * Class .toString method
     * @returns {string}
     */
    toString(): string {
        let info = [
            'Cauchy Distribution',
            `Usage: unirand.cauchy(${this.location}, ${this.scale}).random()`
        ];
        return info.join('\n');
    }

    /**
     * Mean value of Cauchy distribution is undefined
     */

    /**
     * Median value
     * Information only
     * For calculating real median value use analyzer
     */
    get median(): number {
        return this.location;
    }

    /**
     * Mode value - value, which appears most often
     * Information only
     * For calculating real mode value use analyzer
     */
    get mode(): number {
        return this.location;
    }

    /**
     * Variance and Skewness values of Cauchy distribution are undefined
     */

    /**
     * Entropy value
     * Information only
     * For calculating real entropy value use analyzer
     */
    get entropy(): number {
        return Math.log(4 * Math.PI * this.scale);
    }

    /**
     * All parameters of distribution in one object
     * Information only
     */
    get parameters(): {} {
        return {
            median: this.median,
            mode: this.mode,
            entropy: this.entropy
        };
    }
}

module.exports = Cauchy;
