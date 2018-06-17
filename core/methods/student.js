// @flow

/**
 * Student's t-distribution
 * This is continuous distribution
 * https://en.wikipedia.org/wiki/Student%27s_t-distribution
 * @param v <number> - degrees of freedom, v > 0
 * @returns Student's t-distributed value
 * Created by Alexey S. Kiselev
 */

import type { MethodError, RandomArray } from '../types';

class Student {
    degrees: number;
    _b: number;

    constructor(v: number): void {
        this.degrees = Number(v);
        this._b = Math.sqrt((2 / Math.sqrt(Math.E)) - 1);
    }

    /**
     * Generates a random number
     * @returns a Student's t-distributed number
     */
    random(): number {
        let randomNumber = this._random();
        // Limit result to get good distribution
        if(Math.abs(randomNumber) > 12) {
            return this.random();
        }
        return randomNumber;
    }

    /**
     * Generate Student t-value with TIR algorithm
     * @returns a Student's t-distributed number
     */
    _random(): number {
        let u, v, x;
        /*eslint-disable no-constant-condition */
        while(true) {
            // --- step 1 ---
            u = Math.random();
            if (u < this._b / 2) {
                //  --- step 2 ---
                v = Math.random();
                x = 4 * u - this._b;
                if (v <= (1 - 0.5 * Math.abs(x))) {
                    return x;
                }
                if (v <= this._u_alpha(this.degrees, x)) {
                    return x;
                }
                // here go to step 1
            } else {
                // --- step 3 ---
                if (u < 0.5) {
                    x = (Math.abs(4 * u - 1 - this._b) + this._b) * Math.sign(4 * u - 1 - this._b);
                    v = Math.random();
                    // --- step 4 ---
                    if (v <= (1 - 0.5 * Math.abs(x))) {
                        return x;
                    }
                    if (v >= (1 + Math.pow(this._b, 2)) / (1 + Math.pow(x, 2))) {
                        continue;
                    }
                    if (v <= this._u_alpha(this.degrees, x)) {
                        return x;
                    }
                } else {
                    if (u < 0.75) {
                        // --- step 5 ---
                        x = Math.sign(8 * u - 5) * 2 / (Math.abs(8 * u - 5) + 1);
                        v = Math.random() / Math.pow(x, 2);
                        // --- step 4 ---
                        if (v <= (1 - 0.5 * Math.abs(x))) {
                            return x;
                        }
                        if (v >= (1 + Math.pow(this._b, 2)) / (1 + Math.pow(x, 2))) {
                            continue;
                        }
                        if (v <= this._u_alpha(this.degrees, x)) {
                            return x;
                        }
                    } else {
                        // --- step 6 ---
                        x = 2 / (8 * u - 7);
                        v = Math.random();
                        if (v < Math.pow(x, 2) * this._u_alpha(this.degrees, x)) {
                            return x;
                        }
                    }
                }
            }
        }
    }

    /**
     * u_alpha function
     */
    _u_alpha(alpha: number, x: number): number {
        return Math.pow(1 + Math.pow(x, 2)/ alpha, -0.5 * (alpha + 1));
    }

    /**
     * Generates Student's t-distributed numbers
     * @param n: number - Number of elements in resulting array, n > 0
     * @returns Array<number> - Student's t-distributed numbers
     */
    distribution(n: number): RandomArray {
        let studentArray: RandomArray = [];
        for(let i: number = 0; i < n; i += 1){
            studentArray[i] = this.random();
        }
        return studentArray;
    }

    /**
     * Error handling
     * @returns {boolean}
     */
    isError(): MethodError {
        if(!this.degrees) {
            return {error: 'Student\'s t-distribution: you should point "v" (degrees of freedom) numerical value'};
        }
        if(this.degrees < 0) {
            return {error: 'Student\'s t-distribution: parameter "v" (degrees of freedom) must be a positive value'};
        }
        return { error: false };
    }

    /**
     * Refresh method
     * @param newV: number - new parameter "v"
     * This method does not return values
     */
    refresh(newV: number): void {
        this.degrees = Number(newV);
    }

    /**
     * Class .toString method
     * @returns {string}
     */
    toString(): string {
        let info = [
            'Student\'s t-distribution',
            `Usage: randomjs.student(${this.degrees}).random()`
        ];
        return info.join('\n');
    }

    /**
     * Mean value
     * Information only
     * For calculating real mean value use analyzer
     */
    get mean(): ?number {
        if(this.degrees > 1) {
            return 0;
        }
        return undefined;
    }

    /**
     * Median value
     * Information only
     * For calculating real median value use analyzer
     */
    get median(): number {
        return 0;
    }

    /**
     * Mode value - value, which appears most often
     * Information only
     * For calculating real mode value use analyzer
     */
    get mode(): number {
        return 0;
    }

    /**
     * Variance value
     * Information only
     * For calculating real variance value use analyzer
     */
    get variance(): ?number {
        if(this.degrees > 2) {
            return this.degrees / (this.degrees - 2);
        } else if(this.degrees > 1 && this.degrees <= 2){
            return Infinity;
        }
        return undefined;
    }

    /**
     * Skewness value
     * Information only
     * For calculating real skewness value use analyzer
     */
    get skewness(): ?number {
        if(this.degrees > 3) {
            return 0;
        }
        return undefined;
    }

    /**
     * Kurtosis value
     * Information only
     * For calculating real kurtosis value use analyzer
     */
    get kurtosis(): ?number {
        if(this.degrees > 4) {
            return 6 / (this.degrees - 4);
        } else if(this.degrees > 2 && this.degrees <= 4) {
            return Infinity;
        }
        return undefined;
    }

    // TODO: implement Beta function for entropy

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
            kurtosis: this.kurtosis
        };
    }
}

// TODO: implement entropy formula after Beta-function implementation

module.exports = Student;
