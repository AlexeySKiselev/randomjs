// @flow
/**
 * Common analyzer's methods
 * This class contains max, min, mean, median, mode, entropy, variance ... methods
 * Created by Alexey S. Kiselev
 */

import type { RandomArray, AnalyzerPDF } from '../types';
import { AnalyzerPublicMethod, AnalyzerSingleton } from '../decorators';

@AnalyzerSingleton
class Common {
    /**
     * Main input Array
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
     * Skewness value
     * @private
     */
    _skewness: number;

    /**
     * Kurtosis value
     * @private
     */
    _kurtosis: number;

    /**
     * Number of values in PDF and CDF functions
     * @private
     */
    _values_in_pdf: number;

    /**
     * PDF object contains PDF function values
     * @private
     */
    _pdf: RandomArray;

    /**
     * CDF object contains CDF function values
     * @private
     */
    _cdf: RandomArray;

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

    /**
     * Modes array
     * @private
     */
    _modes: RandomArray;

    constructor(randomArray: RandomArray, options?: {[string]: any}): void {
        /**
         * Check if randomArray is array
         * if not - throw Error
         * @type {Array.<number>}
         */
        if(!Array.isArray(randomArray)) {
            throw new Error('Analyzer.Common: input randomArray must be an array');
        }

        /**
         * Check if array is too small
         */
        if(randomArray.length < 3) {
            throw new Error('Analyzer.Common: input randomArray is too small, that is no reason to analyze');
        }

        /**
         * Create inner variables
         */
        this.randomArray = randomArray;
        this._maximum = -Infinity;
        this._minimum = Infinity;
        this._values_in_pdf = 200;
        if(options && Number(options.pdf)) {
            this._values_in_pdf = Number(options.pdf);
        }
        this._entropy = 0;
        this._modes = [];

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
            M3: number = 0,
            M4: number = 0,
            n: number = 0,
            delta: number,
            delta_n: number,
            delta_n2: number,
            term1: number,
            correction: number = 100; // correction needs to calculate floats with better accuracy

        for(let rv of this.randomArray) {
            // Calculating max and min values
            if(rv > this._maximum) {
                this._maximum = rv;
            }

            if(rv < this._minimum) {
                this._minimum = rv;
            }

            // Calculating moments
            n += 1;
            delta = rv * correction - M;
            delta_n = delta / n;
            delta_n2 = Math.pow(delta_n, 2);
            term1 = delta * delta_n2 * (n - 1);
            M += delta_n;
            M4 += term1 * delta_n * (n * n - 3 * n + 3) + 6 * delta_n2 * M2 - 4 * delta_n * M3;
            M3 += (n - 2) * term1  - 3 * delta_n * M2;
            M2 += delta * (rv * correction - M);
        }

        // Assign mean, variance, skewness and kurtosis values
        this._mean = M / correction;
        this._variance = M2 / ((n - 1) * Math.pow(correction, 2));
        this._skewness = Math.sqrt(n) * M3 / Math.pow(M2, 1.5);
        this._kurtosis = n * M4 / (M2 * M2);

        /**
         * Calculating PDF and CDF
         * I am going to cut the range to <_values_in_pdf> values, then calculate range hit of random value
         * Then store this results to Analyzer public method "pdf"
         * Also I am going to use this results to calculate other parameters like entropy
         * If the size of input array is less then <_values_in_pdf> - use dynamic range length
         */
        let rvLength = this.randomArray.length,
            values_in_pdf: number = (rvLength < this._values_in_pdf)
                ? rvLength
                : this._values_in_pdf,
            pdf: RandomArray = new Array(values_in_pdf),
            cdf: RandomArray = new Array(values_in_pdf),
            pdf_values: RandomArray = new Array(values_in_pdf),
            values_step: number = (this._maximum === this._minimum)
                ? 1
                : (this._maximum - this._minimum) / (values_in_pdf - 1),
            tempIndex;

        // Create PDF and CDF arrays with initial zeros
        pdf.fill(0);

        // Iterate over randomArray and add value to pdf
        for(let rv of this.randomArray) {
            tempIndex = Math.floor((rv - this._minimum) / values_step);
            pdf[tempIndex] += 1;
        }

        // Cumulative variable for CDF
        let sumOfPDF: number = 0;

        /**
         * Calculate mode value
         * max_pdf - maximum value of pdf
         * max_mode - value of max_pds
         * I am going to compare value with delta = 0.1% due to accuracy
         */
        let max_pdf: number = pdf[0] / rvLength;

        /**
         * Calculate cumulative step for entropy for collect step for pdf equals to zero
         * Iterate over PDF to find first non zero value (except with index 0)
         * I need it to calculate correct entropy for index 0
         */
        let cumulative_step: number = values_step;
        for(let i = 1; i < pdf.length; i += 1) {
            if(pdf[i] !== 0)
                break;
            cumulative_step += values_step;
        }

        // Convert pdf to probability
        for(let i = 0; i < pdf.length; i += 1) {
            pdf[i] /= rvLength;
            pdf_values[i] = this._minimum + i * values_step;

            // Calculate CDF
            sumOfPDF += pdf[i];
            cdf[i] = sumOfPDF;

            // Calculate mode
            if(pdf[i] - max_pdf > 0.005 * pdf[i]) {
                max_pdf = pdf[i];
                this._modes = [pdf_values[i]];
            } else if(pdf[i] - max_pdf > -0.005 * pdf[i]) {
                this._modes.push(pdf_values[i]);
            }

            // Calculate entropy
            cumulative_step += values_step;
            if(pdf[i] !== 0 && pdf[i] !== 1) {
                this._entropy -= (cumulative_step === 0)?0:(pdf[i] * Math.log(pdf[i] / cumulative_step));
                cumulative_step = 0;
            }
        }

        this._pdf = pdf;
        this._pdf_values = pdf_values;
        this._cdf = cdf;
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
     * Public method for AnalyzerFactory
     * @returns {number} - maximum value in array
     */
    @AnalyzerPublicMethod
    get max(): number {
        return this._maximum;
    }

    /**
     * Public method for Analyzer
     * @returns {number} - mean value of random array
     */
    @AnalyzerPublicMethod
    get mean(): number {
        return this._mean;
    }

    /**
     * Public method for Analyzer
     * @returns {number} - mode value for random distribution
     */
    @AnalyzerPublicMethod
    get mode(): RandomArray {
        return this._modes;
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
     * @returns {number} - standard deviation
     */
    @AnalyzerPublicMethod
    get standard_deviation(): number {
        return Math.sqrt(this._variance);
    }

    /**
     * Public method for Analyzer
     * @returns {number} - Entropy of random distribution
     */
    @AnalyzerPublicMethod
    get entropy(): number {
        return this._entropy;
    }

    /**
     * Public method for Analyzer
     * @returns {number} - Skewness of random distribution
     */
    @AnalyzerPublicMethod
    get skewness(): number {
        return this._skewness;
    }

    /**
     * Public method for Analyzer
     * @returns {number} - Kurtosis value of random distribution
     */
    @AnalyzerPublicMethod
    get kurtosis(): number {
        return this._kurtosis;
    }

    /**
     * Public method for Analyzer
     * @returns {AnalyzerPDF} - object with PDF function and its values
     */
    @AnalyzerPublicMethod
    get pdf(): AnalyzerPDF {
        return {
            values: this._pdf_values,
            probabilities: this._pdf
        };
    }

    /**
     * Public method for Analyzer
     * @returns {AnalyzerPDF} - object with CDF function and its values
     */
    @AnalyzerPublicMethod
    get cdf(): AnalyzerPDF {
        return {
            values: this._pdf_values,
            probabilities: this._cdf
        };
    }
}

module.exports = Common;
