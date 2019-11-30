// @flow
/**
 * Zipf distribution
 * This is discreet distribution
 * https://en.wikipedia.org/wiki/Zipf%27s_law
 * @param alpha <number> - alpha >= 0, float
 * @param shape <number> - shape > 1, integer
 * @returns Zipf distributed value
 * Created by Alexey S. Kiselev
 */

import type { MethodError, RandomArray } from '../types';
import type { IDistribution } from '../interfaces';
import prng from '../prng/prngProxy';

class Zipf implements IDistribution {
    alpha: number;
    shape: number;
    _harmonics: Array<number>;
    _c: number;
    _sumProbs: Array<number>;
    _harmonicAlphaMinusOne: ?number;
    _harmonicAlphaMinusTwo: ?number;

    constructor(alpha: number, shape: number): void {
        this.alpha = Number(alpha);
        this.shape = Math.floor(Number(shape));
        this._harmonicAlphaMinusOne = null;
        this._harmonicAlphaMinusTwo = null;
        if (isNaN(this.alpha) || isNaN(this.shape)) {
            return;
        }
        this._init();
    }

    /**
     * Initialization
     * Generates harmonics
     * @private
     */
    _init(): void {
        this._harmonics = [];
        this._c = 0;
        this._sumProbs = [0];
        this._generate_harmonics();
    }

    /**
     * Generates harmonics up to <shape>
     * @private
     */
    _generate_harmonics(): void {
        if (this.shape <= this._harmonics.length) {
            return;
        }
        const harmonicsLength = this._harmonics.length;
        let temp: number;
        for (let i = harmonicsLength + 1; i <= this.shape; i += 1) {
            temp = Math.pow(i, this.alpha);
            this._c = this._c + (1 / temp);
            this._harmonics[i - 1] = this._c;
            this._sumProbs[i] = this._sumProbs[i - 1] + 1 / temp;
        }
    }

    /**
     * Generates harmonics for shifted <alpha>
     * @param {number} shift
     * @private
     */
    _generate_harmonic_shifted_alpha(shift: number): number {
        let _c = 0;
        for (let i = 1; i <= this.shape; i += 1) {
            _c = _c + 1 / Math.pow(i, this.alpha - shift);
        }
        return _c;
    }

    /**
     * Generates single random value, O(log(shape)) time complexity
     * @param {number} u
     * @return {number}
     * @private
     */
    _random(u: number): number {
        let low = 0,
            high = this.shape,
            mid,
            zipfValue,
            normalize = this._harmonics[this.shape - 1];

        do {
            mid = Math.floor(0.5 * (low + high));
            if (
                (this._sumProbs[mid] / normalize) >= u
                && (this._sumProbs[mid - 1] / normalize) < u
            ) {
                zipfValue = mid;
                break;
            } else if ((this._sumProbs[mid] / normalize) >= u) {
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        } while (low <= high);

        return zipfValue;
    }

    /**
     * Generates uniformly distributed value, but not 0 and 1
     * @private
     */
    _generate_uniform_random(): number {
        let u: number = 0;
        while (u === 0 || u === 1) {
            u = prng.random();
        }

        return u;
    }

    /**
     * Generates uniformly distributed value, but not 0 and 1
     * @private
     */
    _generate_uniform_next(): number {
        let u: number = 0;
        while (u === 0 || u === 1) {
            u = prng.next();
        }

        return u;
    }

    /**
     * Generates a random number
     * @returns {number} a Zipf distributed number
     */
    random(): number {
        return this._random(this._generate_uniform_random());
    }

    /**
     * Generates next seeded random number
     * @returns {number} a Zipf distributed number
     */
    next(): number {
        return this._random(this._generate_uniform_next());
    }

    /**
     * Generates Zipf distributed numbers
     * @param n: number - Number of elements in resulting array, n > 0
     * @returns Array<number> - Zipf distributed numbers
     */
    distribution(n: number): RandomArray {
        let zipfArray: RandomArray = [],
            random: RandomArray = (prng.random(n): any);
        for(let i: number = 0; i < n; i += 1){
            zipfArray[i] = this._random(random[i]);
        }
        return zipfArray;
    }

    /**
     * Error handling
     * @returns {boolean}
     */
    isError(): MethodError {
        if (isNaN(this.alpha) || isNaN(this.shape)) {
            return {error: 'Zipf distribution: you should point "alpha" and "shape" numerical values'};
        }
        if (this.alpha < 0) {
            return {error: 'Zipf distribution: parameters "alpha" must be >= 0'};
        }

        if (this.shape <= 1) {
            return {error: 'Zipf distribution: parameters "shape" must be > 1'};
        }
        return { error: false };
    }

    /**
     * Refresh method
     * @param newAlpha: number - new parameter "alpha"
     * @param newShape: number - new parameter "shape"
     * This method does not return values
     */
    refresh(newAlpha: number, newShape: number): void {
        // refresh is expensive - avoid refreshing for the same <alpha> and <shape> values
        if (this.alpha === newAlpha && this.shape === newShape) {
            return;
        }
        this._harmonicAlphaMinusOne = null; // need to recalculate after refresh
        this._harmonicAlphaMinusTwo = null; // need to recalculate after refresh
        this.shape = Math.floor(Number(newShape));
        if (this.alpha === newAlpha && !isNaN(this.shape)) { // do not recalculate everything
            this._generate_harmonics();
            return;
        }
        // recalculate all harmonics
        this.alpha = Number(newAlpha);
        if (isNaN(this.alpha) || isNaN(this.shape)) {
            return;
        }
        this._init();
    }

    /**
     * Class .toString method
     * @returns {string}
     */
    toString(): string {
        let info = [
            'Zipf Distribution',
            `Usage: unirand.zipf(${this.alpha}, ${this.shape}).random()`
        ];
        return info.join('\n');
    }

    /**
     * Mean value
     * Information only
     * For calculating real mean value use analyzer
     */
    get mean(): number {
        if (this._harmonicAlphaMinusOne === null) {
            this._harmonicAlphaMinusOne = this._generate_harmonic_shifted_alpha(1);
        }
        return this._harmonicAlphaMinusOne / this._harmonics[this.shape - 1];
    }

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
        if (this._harmonicAlphaMinusTwo === null) {
            this._harmonicAlphaMinusTwo = this._generate_harmonic_shifted_alpha(2);
        }
        return (this._harmonicAlphaMinusTwo / this._harmonics[this.shape - 1]) - Math.pow(this.mean, 2);
    }

    /**
     * Entropy value
     * Information only
     * For calculating real entropy value use analyzer
     */
    get entropy(): number {
        let _c: number = 0;
        for (let i = 1; i <= this.shape; i += 1) {
            _c += Math.log(i) / Math.pow(i, this.alpha);
        }

        return Math.log(this._harmonics[this.shape - 1]) + this.alpha * _c / this._harmonics[this.shape - 1];
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
            entropy: this.entropy
        };
    }
}

module.exports = Zipf;
