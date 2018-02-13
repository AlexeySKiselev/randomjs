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
     * Median value
     * @private
     */
    _median: number;

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
         * Check if array is too small
         */
        if(randomArray.length <= 10) {
            throw new Error('Analyzer.Common: input randomArray is too small, that is no reason to analyze');
        }

        /**
         * Create inner variables
         */
        this.randomArray = randomArray;
        this._maximum = -Infinity;
        this._minimum = Infinity;
        this._values_in_pdf = 199;
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
        this._variance = M2 / (n - 1);

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
            pdf: RandomArray = new Array(values_in_pdf + 1),
            cdf: RandomArray = new Array(values_in_pdf + 1),
            pdf_values: RandomArray = new Array(values_in_pdf + 1),
            values_step: number = (this._maximum === this._minimum)
                ? 1
                : (this._maximum - this._minimum) / (values_in_pdf - 1),
            tempIndex;

        // Variable for skewness
        let sumOfCubes: number = 0;

        // Variable for Kurtosis
        let sumOfFourths: number = 0;

        // Create PDF and CDF arrays with initial zeros
        pdf.fill(0);

        // Iterate over randomArray and add value to pdf
        for(let rv of this.randomArray) {
            tempIndex = Math.floor((rv - this._minimum) / values_step);
            pdf[tempIndex] += 1;

            // Calculate sum of cubes for skewness
            sumOfCubes += Math.pow(rv - this._mean, 3);

            // Calculate sum of 4-powers for Kurtosis
            sumOfFourths += Math.pow(rv - this._mean, 4) / Math.pow(this._variance, 2);
        }

        // Calculate skewness
        this._skewness = sumOfCubes / ((rvLength - 1) * Math.pow(this._variance, 1.5));

        // Calculate Kurtosis
        this._kurtosis = sumOfFourths / (rvLength - 1);

        // Cumulative variable for CDF
        let sumOfPDF: number = 0;

        /**
         * Add special variables for calculating median
         * Increase pdf_low until it achieves 0.5
         * At 0.5 assign median_low and median_high
         * For saving calculating time add variable catch_median (false in initial)
         * Then calculate average value
         */
        let pdf_low: number = 0,
            catch_median: boolean = false;

        /**
         * Calculate mode value
         * max_pdf - maximum value of pdf
         * max_mode - value of max_pds
         * I am going to compare value with delta = 0.1% due to accuracy
         */
        let max_pdf: number = pdf[0] / rvLength;

        // Convert pdf to probability
        for(let i = 0; i < pdf.length; i += 1) {
            pdf[i] /= rvLength;
            // I move values by 0.5 for centering approximation bar
            pdf_values[i] = this._minimum + i * values_step;

            // Calculate CDF
            sumOfPDF += pdf[i];
            cdf[i] = sumOfPDF;

            // Increase pdf_low
            if(!catch_median) {
                if(pdf_low < 0.499999) {
                    pdf_low += pdf[i];
                } else {
                    // Assign median value and stop calculation median
                    this._median = (pdf_values[i] + pdf_values[i - 1]) / 2;
                    catch_median = true;
                }
            }

            // Calculate mode
            if(pdf[i] - max_pdf > 0.05 * pdf[i]) {
                max_pdf = pdf[i];
                this._modes = [pdf_values[i]];
            } else if(pdf[i] - max_pdf > -0.05 * pdf[i]) {
                this._modes.push(pdf_values[i]);
            }

            // Calculate entropy
            this._entropy -= (pdf[i] === 0 || values_step === 0)?0:(pdf[i] * Math.log(pdf[i] / values_step));
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
     * @returns {number} - median of random array
     */
    @AnalyzerPublicMethod
    get median(): number {
        return this._median;
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
     * Pearson's skewness: mode and median
     * Public method for Analyzer
     * @returns {Object} - object with mean and median skewness
     */
    @AnalyzerPublicMethod
    get pearson(): { skewness_mode: ?number, skewness_median: number } {
        return {
            skewness_mode: (this._modes.length === 1)?((this._mean - this._modes[0]) / this.standard_deviation):undefined,
            skewness_median: (this._mean - this._median) / this.standard_deviation
        };
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
