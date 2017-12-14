// @flow
/**
 * Student's t-distribution
 * This is continuous distribution
 * https://en.wikipedia.org/wiki/Student%27s_t-distribution
 * @param v <number> - degrees of freedom, v > 0
 * @returns Student's t-distributed value
 * Created by Alexey S. Kiselev
 */

let Normal = require('./normal'),
    Chi = require('./chi');

class Student {
    degrees: number;
    normal: Normal;
    chi: Chi;

    constructor(v: number): void {
        this.degrees = Number(v);
        this.normal = new Normal(0, 1);

        /*
         * Use random value (1) for Chi distribution, then refresh before usage
         */
        this.chi = new Chi(1);
    }

    /**
     * Generates a random number
     * @returns a Student's t-distributed number
     */
    random(): number {
        this.chi.refresh(this.degrees);
        return this.normal.random() / this.chi.random();
    }

    /**
     * Generates Student's t-distributed numbers
     * @param n: number - Number of elements in resulting array, n > 0
     * @returns Array<number> - Student's t-distributed numbers
     */
    distribution(n: number): Array<number> {
        let studentArray: Array<number> = [];
        this.chi.refresh(this.degrees);
        for(let i: number = 0; i < n; i += 1){
            studentArray[i] = this.normal.random() / this.chi.random();
        }
        return studentArray;
    }

    /**
     * Error handling
     * @returns {boolean}
     */
    isError(): boolean | {error: string} {
        if(!this.degrees) {
            return {error: 'Student\'s t-distribution: you should point "v" (degrees of freedom) numerical value'};
        }
        if(this.degrees < 0) {
            return {error: 'Student\'s t-distribution: parameter "v" (degrees of freedom) must be a positive value'};
        }
        return false;
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
    get mean(): number {
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
    get variance(): number {
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
    get skewness(): number {
        if(this.degrees > 3) {
            return 0;
        }
        return undefined;
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
            skewness: this.skewness
        };
    }
}

// TODO: implement entropy formula after Beta-function implementation

module.exports = Student;
