// @flow
/**
 * Common analyzer's methods
 * This class contains max, min, mean, median, mode, entropy, variance ... methods
 * Created by Alexey S. Kiselev
 */

import { IAnalyzerMethods} from '../interfaces';
import { AnalyzerPublicMethod, AnalyzerSingleton } from '../decorators';

@AnalyzerSingleton
class Common {
    /**
     * Main input Array
     * I don't check whether this input is array
     * I did it in AnalyzerFactory
     */
    randomArray: IAnalyzerMethods.randomArray;

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

    constructor(randomArray: Array<number>): void {
        this.randomArray = randomArray;
        this._maximum = -Infinity;
        this._minimum = Infinity;

        /**
         * I am going to run calculateParams for calculate all parameters
         * I need it for performance, because I want to traverse array only once
         */
        this._calculateParams();
    }

    /**
     * Main methods for calculating random array parameters
     * I will traverse over array only once
     * During iteration I will store elements to different local hash tables
     * Also I add some additional variables to calculate params
     * This method will not return nothing, but will calculate special properties
     * Then I will transfer this value to AnalyzerFactory via AnalyzerPublicMethod decorator
     * @private
     */
    _calculateParams(): void {

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

    @AnalyzerPublicMethod
    get mean() {
        return (this.max + this.min) / 2;
    }

    @AnalyzerPublicMethod
    get mode() {
        return this.randomArray;
    }

    @AnalyzerPublicMethod
    get median() {

    }

    @AnalyzerPublicMethod
    get variance() {

    }

    @AnalyzerPublicMethod
    get entropy() {

    }

    @AnalyzerPublicMethod
    get skewness() {

    }

    sortRandom() {
        return this.randomArray;
    }

    prodTen() {
        return 10 * this.randomArray[0];
    }
}

module.exports = Common;
