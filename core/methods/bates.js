// @flow
/**
 * Bates distribution
 * https://en.wikipedia.org/wiki/Bates_distribution
 * @param a: number (any value)
 * @param b: number (any value), b > a
 * @param n: integer, n >= 1
 * @returns random number with Bates distribution
 * Created by Alexey S. Kiselev
 */

import type { MethodError, RandomArray } from '../types';
let Uniform = require('./uniform');

class Bates {
    a: number;
    b: number;
    n: number;
    _uniform: Uniform;

    constructor(n: number, a: number = 0, b: number = 1) {
        this.n = Math.floor(n);
        this.a = Math.min(a, b);
        this.b = Math.max(a, b);
        this._uniform = new Uniform(this.a, this.b);
    }

    /**
     * Generates a random number
     * @returns a Bates distributed number
     */
    random(): number {
        let m: number = 0,
            random_number: number = 0;
        for(let k = 1; k <= this.n; k += 1) {
            m += 1;
            random_number += (this._uniform.random() - random_number) / m;
        }
        return random_number;
    }

    /**
     * Generates random distribution
     * @returns an array with Bates distributed numbers
     */
    distribution(n: number): RandomArray {
        let batesArray: RandomArray = [];
        for(let i: number = 0; i < n; i += 1){
            batesArray[i] = this.random();
        }
        return batesArray;
    }

    isError(): MethodError {
        if(!this.a && this.a !== 0) {
            return {error: 'Bates distribution: you should point "a" numerical value'};
        }

        if(!this.b && this.b !== 0) {
            return {error: 'Bates distribution: you should point "b" numerical value'};
        }

        if(!this.n || this.n < 1) {
            return {error: 'Bates distribution: you should point "n" positive integer value'};
        }

        if(this.a === this.b) {
            return {error: 'Bates distribution: Parameter "b" must be greater then "a"'};
        }
        return { error: false };
    }

    /**
     * Refresh method
     * @param newA: number - new parameter "a"
     * @param newB: number - new parameter "b"
     * @param newN: number - new parameter "n"
     * This method does not return values
     */
    refresh(newN: number, newA: number = 0, newB: number = 1): void {
        this.n = Math.floor(newN);
        this.a = Math.min(newA, newB);
        this.b = Math.max(newA, newB);
    }

    /**
     * Class .toString method
     * @returns {string}
     */
    toString(): string {
        let info = [
            'Bates Distribution',
            `Usage: randomjs.bates(${this.n}, ${this.a}, ${this.b}).random()`
        ];
        return info.join('\n');
    }

    /**
     * Mean value
     * Information only
     * For calculating real mean value use analyzer
     */
    get mean(): number {
        return (this.a + this.b) / 2;
    }

    /**
     * Variance value
     * Information only
     * For calculating real variance value use analyzer
     */
    get variance(): number {
        return Math.pow(this.b - this.a, 2) / (12 * this.n);
    }

    /**
     * Skewness value
     * Information only
     * For calculating real skewness value use analyzer
     */
    get skewness(): number {
        return 0;
    }

    /**
     * Kurtosis value
     * Information only
     */
    get kurtosis(): number {
        return -1.2 / this.n;
    }

    /**
     * All parameters of distribution in one object
     * Information only
     */
    get parameters(): {} {
        return {
            mean: this.mean,
            variance: this.variance,
            skewness: this.skewness,
            kurtosis: this.kurtosis
        };
    }
}

module.exports = Bates;
