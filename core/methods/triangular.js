// @flow

/**
 * Triangular distribution
 * This is continuous distribution
 * https://en.wikipedia.org/wiki/Triangular_distribution
 * @param a <number> - any number
 * @param b <number> - b > a
 * @param c <number> - a <= c <= b
 * @returns Triangular distributed value
 * Created by Alexey S. Kiselev
 */

import type {MethodError, RandomArray} from '../types';

class Triangular {
    a: number;
    b: number;
    c: number;

    constructor(a: number, b: number, c: number): void {
        this.a = Number(a);
        this.b = Number(b);
        this.c = Number(c);
    }

    /**
     * Generates a random number
     * @returns a Triangular distributed number
     */
    random(): number {
        let u = Math.random();
        if(u <= ((this.c - this.a) / (this.b - this.a))){
            return this.a + Math.sqrt(u * (this.c - this.a) * (this.b - this.a));
        } else {
            return this.b - Math.sqrt(u * (this.b - this.a) - this.c + this.a) * (this.b - this.c);
        }
    }

    /**
     * Generates Triangular distributed numbers
     * @param n: number - Number of elements in resulting array, n > 0
     * @returns Array<number> - Triangular distributed numbers
     */
    distribution(n: number): RandomArray {
        let triangularArray: RandomArray = [];
        for(let i: number = 0; i < n; i += 1){
            triangularArray[i] = this.random();
        }
        return triangularArray;
    }

    /**
     * Error handling
     * @returns {boolean}
     */
    isError(): MethodError {
        if((!this.a && this.a !== 0) || (!this.b && this.b !== 0) || (!this.c && this.c !== 0)) {
            return {error: 'Triangular distribution: you should point "a", "b" and "c" numerical values'};
        }
        if(this.b <= this.a) {
            return {error: 'Triangular distribution: parameters "b" must be greater then parameter "a"'};
        }

        if(this.c < this.a || this.c > this.b) {
            return {error: 'Triangular distribution: parameters "c" must be greater then or equal to parameter "a" and lower then or equal to parameter "b"'};
        }
        return { error: false };
    }

    /**
     * Refresh method
     * @param newA: number - new parameter "a"
     * @param newB: number - new parameter "b"
     * @param newC: number - new parameter "c"
     * This method does not return values
     */
    refresh(newA: number, newB: number, newC: number): void {
        this.a = Number(newA);
        this.b = Number(newB);
        this.c = Number(newC);
    }

    /**
     * Class .toString method
     * @returns {string}
     */
    toString(): string {
        let info = [
            'Triangular Distribution',
            `Usage: randomjs.triangular(${this.a}, ${this.b}, ${this.c}).random()`
        ];
        return info.join('\n');
    }

    /**
     * Mean value
     * Information only
     * For calculating real mean value use analyzer
     */
    get mean(): number {
        return (this.a + this.b + this.c) / 3;
    }

    /**
     * Median value
     * Information only
     * For calculating real median value use analyzer
     */
    get median(): number {
        if(this.c >= 0.5 * (this.a + this.b)){
            return this.a + Math.sqrt((this.b - this.a) * (this.c - this.a) / 2);
        } else {
            return this.b - Math.sqrt((this.b - this.a) * (this.b - this.c) / 2);
        }
    }

    /**
     * Mode value - value, which appears most often
     * Information only
     * For calculating real mode value use analyzer
     */
    get mode(): number {
        return this.c;
    }

    /**
     * Variance value
     * Information only
     * For calculating real variance value use analyzer
     */
    get variance(): number {
        return (Math.pow(this.a, 2) + Math.pow(this.b, 2) + Math.pow(this.c, 2) - this.a * this.b - this.a * this.c - this.b - this.c) / 18;
    }

    /**
     * Skewness value
     * Information only
     * For calculating real skewness value use analyzer
     */
    get skewness(): number {
        return (Math.sqrt(2) * (this.a + this.b - 2 * this.c) * (2 * this.a - this.b - this.c) *(this.a + this.c - 2 * this.b)) / (5 * Math.pow(18 * this.variance, 1.5));
    }

    /**
     * Entropy value
     * Information only
     * For calculating real entropy value use analyzer
     */
    get entropy(): number {
        return 0.5 + Math.log((this.b - this.a) / 2);
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
            skewness: this.skewness
        };
    }
}

module.exports = Triangular;
