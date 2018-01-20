// @flow
/**
 * Common analyzer's methods
 * This class contains max, min, mean, median, mode, entropy, variance ... methods
 * Created by Alexey S. Kiselev
 */

import type { RandomArray } from '../types';
import { AnalyzerPublicMethod, AnalyzerSingleton } from '../decorators';

@AnalyzerSingleton
class Common {
    /**
     * Main input Array
     * I don't check whether this input is array
     * I did it in AnalyzerFactory
     */
    randomArray: RandomArray;

    /**
     * Maximum number in array
     * For some distributions can be really big (much bigger then mean)
     * @private
     */
    _maximum: number;

    /**
     * Minimum number in array
     * For some distributions can be really small (much smaller then mean)
     * @private
     */
    _minimum: number;

    /**
     * Mean value
     * @private
     */
    _mean: number;

    /**
     * Variance
     * @private
     */
    _variance: number;

    /**
     * Number of values in PDF and CDF functions
     * TODO: implement "options" mechanism for this parameter
     * @private
     */
    _values_in_pdf: number;

    /**
     * PDF object contains PDF function values
     * @private
     */
    _pdf: RandomArray;

    /**
     * PDF Values object contains PDF function x-values
     * @private
     */
    _pdf_values: Array<number>;

    /**
     * Entropy
     * @private
     */
    _entropy: number;

    constructor(randomArray: RandomArray): void {
        /**
         * Check if randomArray is array
         * if not - throw Error
         * @type {Array.<number>}
         */
        if(!Array.isArray(randomArray)) {
            throw new Error('Analyzer.Common: input randomArray must be an array');
        }

        /**
         * Create inner variables
         */
        this.randomArray = randomArray;
        this._maximum = -Infinity;
        this._minimum = Infinity;
        this._values_in_pdf = 5; //200;
        this._entropy = 0;

        /**
         * I am going to run calculateParams for calculate all parameters
         * I need it for performance, because I want to traverse array only once
         */
        this._calculateParams();
    }

    /**
     * Main methods for calculating random array parameters
     * I will traverse over array only once with O(n) time
     * During iteration I will calculate necessary parameters
     * Also I add some additional variables to calculate params
     * This method will not return nothing, but will calculate special properties
     * Then I will transfer this value to AnalyzerFactory via AnalyzerPublicMethod decorator
     * @private
     */
    _calculateParams(): void {
        /**
         * For mean value M and variance M2 I am going to use Knuth's algorithm
         * So, create M and M2 variables with initial zeros
         * Also I create a counter n for calculating values and additional variable delta
         */
        let M: number = 0,
            M2: number = 0,
            n: number = 0,
            delta: number;

        for(let rv of this.randomArray) {
            // Calculating max and min values
            if(rv > this._maximum) {
                this._maximum = rv;
            }

            if(rv < this._minimum) {
                this._minimum = rv;
            }

            // Calculating mean and variance
            n += 1;
            delta = rv - M;
            M += delta / n;
            M2 += delta * (rv - M);
        }

        // Assign mean and variance values
        this._mean = M;
        this._variance = M2 / n;

        /**
         * Calculating PDF
         * I am going to cut the range to <_values_in_pdf> values, then calculate range hit of random value
         * Then store this results to Analyzer public method "pdf"
         * Also I am going to use this results to calculate other parameters like entropy
         * If the size of input array is less then <_values_in_pdf> - use dynamic range length
         */
        let values_step: number = (this._maximum - this._minimum) / this._values_in_pdf,
            rvLength = this.randomArray.length,
            pdf: Array<number> = new Array(this._values_in_pdf),
            pdf_values: Array<number> = new Array(this._values_in_pdf),
            tempIndex;

        // Create PDF array with initial zeros
        pdf.fill(0);

        // Iterate over randomArray and add value to pdf
        for(let rv of this.randomArray) {
            tempIndex = (rv === this._minimum)
                ?1
                :Math.ceil((rv - this._minimum) / values_step);
            pdf[tempIndex - 1] += 1;
        }

        // Convert pdf to probability
        for(let i = 0; i < pdf.length; i += 1) {
            pdf[i] /= rvLength;
            pdf_values[i] = this._minimum + i * values_step;

            // Calculate entropy
            this._entropy -= pdf[i] * Math.log(pdf[i]);
        }

        this._pdf = pdf;
        this._pdf_values = pdf_values;
    }

    /**
     * Public method for AnalyzerFactory
     * @returns {number} - maximum value in array
     */
    @AnalyzerPublicMethod
    get max(): number {
        return this._maximum;
    }

    /**
     * Public method for AnalyzerFactory
     * @returns {number} - minimum value in array
     */
    @AnalyzerPublicMethod
    get min(): number {
        return this._minimum;
    }

    /**
     * Public method for Analyzer
     * @returns {number} - mean value of random array
     */
    @AnalyzerPublicMethod
    get mean(): number {
        return this._mean;
    }

    @AnalyzerPublicMethod
    get mode(): number {
        return 1;//this.randomArray;
    }

    @AnalyzerPublicMethod
    get median(): void {

    }

    /**
     * Public method for Analyzer
     * @returns {number} - variance of random array
     */
    @AnalyzerPublicMethod
    get variance(): number {
        return this._variance;
    }

    /**
     * Public method for Analyzer
     * @returns {number} - Entropy of random distribution
     */
    @AnalyzerPublicMethod
    get entropy(): number {
        return this._entropy;
    }

    @AnalyzerPublicMethod
    get skewness(): void {

    }

    /**
     * Public method for Analyzer
     * @returns {Object} - PDF function
     */
    @AnalyzerPublicMethod
    get pdf(): { 'values': Array<number>, 'probabilities': Array<number> } {
        return {
            values: this._pdf_values,
            probabilities: this._pdf
        };
    }
}

module.exports = Common;
