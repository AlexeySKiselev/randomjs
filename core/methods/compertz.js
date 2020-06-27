// @flow
/**
 * Compertz Distribution
 * This is continuous distribution
 * https://en.wikipedia.org/wiki/Gompertz_distribution
 * @param nu: number - shape > 0
 * @param b: number - scale > 0
 * @returns Compertz Distributed value
 * Created by Alexey S. Kiselev
 */

import prng from '../prng/prngProxy';
import type { MethodError, RandomArray } from '../types';
import type { IDistribution } from '../interfaces';

class Compertz implements IDistribution {
    nu: number;
    b: number;

    constructor(nu: number, b: number): void {
        this.nu = Number(nu);
        this.b = Number(b);
    }

    /**
     * Generates a random number
     * @returns a Compertz distributed number
     */
    _random(u: number): number {
        return Math.log(1 - Math.log(1 - u) / this.nu) / this.b;
    }

    random(): number {
        return this._random(prng.random());
    }

    next(): number {
        return this._random(prng.next());
    }

    /**
     * Generates Compertz distributed numbers
     * @param n: number - Number of elements in resulting array, n > 0
     * @returns Array<number> - Compertz distributed numbers
     */
    distribution(n: number): RandomArray {
        let compertzArray: RandomArray = [],
            random: RandomArray = (prng.random(n): any);
        for(let i: number = 0; i < n; i += 1){
            compertzArray[i] = this._random(random[i]);
        }
        return compertzArray;
    }

    /**
     * Error handling
     * @returns {boolean}
     */
    isError(): MethodError {
        if(!this.nu || this.nu <= 0) {
            return {error: 'Compertz distribution: you should point parameter "nu" (shape) with positive numerical value'};
        }
        if(!this.b || this.b <= 0) {
            return {error: 'Compertz distribution: you should point parameter "b" (scale) with positive numerical value'};
        }
        return { error: false };
    }

    /**
     * Refresh method
     * @param newNu: number - new parameter "bu"
     * @param newB: number - new parameter "b"
     * This method does not return values
     */
    refresh(newNu: number, newB: number): void {
        this.nu = Number(newNu);
        this.b = Number(newB);
    }

    /**
     * Class .toString method
     * @returns {string}
     */
    toString(): string {
        let info = [
            'Compertz Distribution',
            `Usage: unirand.compertz(${this.nu}, ${this.b}).random()`
        ];
        return info.join('\n');
    }

    /**
     * Median value
     * Information only
     * For calculating real median value use analyzer
     */
    get median(): number {
        return this._random(0.5);
    }

    /**
     * All parameters of distribution in one object
     * Information only
     */
    get parameters(): {} {
        return {
            median: this.median
        };
    }
}

module.exports = Compertz;
